// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PeerSeedCPR is ERC1155, AccessControl, ReentrancyGuard {
    // ============ ROLES GRANULARES (Melhor Prática) ============
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    IERC20 public usdc;
    address public treasuryAddress;

    struct CPRData {
        uint256 fundingGoal;
        uint256 funded;
        bool released;
        uint256 deadline;
        uint256 totalCotas;
        uint256 valorCota;
        uint256 irPercent;
        uint256 iofPercent;
        uint256 peerseedTaxPpm;
        uint256 principal;
        uint256 juros;
    }

    mapping(uint256 => CPRData) public cprs;

    // ============ EVENTS ============
    event CPRCreated(uint256 indexed cprId, uint256 fundingGoal, uint256 deadline);
    event Funded(uint256 indexed cprId, address indexed buyer, uint256 amount);
    event FundsReleased(uint256 indexed cprId, uint256 amount);
    event AtomicSwap(uint256 indexed cprId, address indexed seller, address indexed buyer, uint256 cotas, uint256 price);
    event WaterfallExec(uint256 indexed cprId, uint256 principal, uint256 juros, uint256 fee, uint256 impostos);

    // ============ CONSTRUCTOR ============
    constructor(address _usdc, address _treasury, address _operator) ERC1155("") {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");
        require(_operator != address(0), "Invalid operator address");
        
        usdc = IERC20(_usdc);
        treasuryAddress = _treasury;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(TREASURY_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, _operator);
    }

    // ============ MODIFIERS ============
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender), "Not operator");
        _;
    }

    modifier onlyTreasury() {
        require(hasRole(TREASURY_ROLE, msg.sender), "Not treasury");
        _;
    }

    // ============ ADMIN FUNCTIONS ============
    function createCPR(
        uint256 cprId,
        uint256 fundingGoal,
        uint256 deadline,
        uint256 valorCota,
        uint256 ir,
        uint256 iof,
        uint256 feePpm,
        uint256 principal,
        uint256 juros
    ) external onlyAdmin {
        require(cprs[cprId].fundingGoal == 0, "CPR already exists");
        require(fundingGoal > 0, "Invalid funding goal");
        require(deadline > block.timestamp, "Invalid deadline");
        require(valorCota > 0, "Invalid valor cota");

        cprs[cprId] = CPRData({
            fundingGoal: fundingGoal,
            funded: 0,
            released: false,
            deadline: deadline,
            totalCotas: 0,
            valorCota: valorCota,
            irPercent: ir,
            iofPercent: iof,
            peerseedTaxPpm: feePpm,
            principal: principal,
            juros: juros
        });

        emit CPRCreated(cprId, fundingGoal, deadline);
    }

    // ============ OPERATOR FUNCTIONS ============
    function depositAndBuyToken(uint256 cprId, address buyer, uint256 cotas) 
        external 
        onlyOperator 
        nonReentrant 
    {
        CPRData storage c = cprs[cprId];
        
        require(c.fundingGoal > 0, "CPR does not exist");
        require(buyer != address(0), "Invalid buyer address");
        require(cotas > 0, "Invalid cotas amount");
        require(block.timestamp <= c.deadline, "Funding closed");
        
        uint256 requiredUSD = cotas * c.valorCota;
        require(c.funded + requiredUSD <= c.fundingGoal, "Overfunding");
        
        require(
            usdc.transferFrom(buyer, address(this), requiredUSD),
            "USDC transfer failed"
        );
        
        c.funded += requiredUSD;
        c.totalCotas += cotas;
        
        _mint(buyer, cprId, cotas, "");
        
        emit Funded(cprId, buyer, requiredUSD);
    }

    function executeAtomicSwap(
        uint256 cprId,
        address seller,
        address buyer,
        uint256 cotas,
        uint256 price
    ) external onlyOperator nonReentrant {
        require(seller != address(0) && buyer != address(0), "Invalid addresses");
        require(seller != buyer, "Same account");
        require(cotas > 0, "Invalid cotas amount");
        require(balanceOf(seller, cprId) >= cotas, "Insufficient tokens");
        
        require(
            usdc.transferFrom(buyer, seller, price),
            "USDC payment failed"
        );
        
        _safeTransferFrom(seller, buyer, cprId, cotas, "");
        
        emit AtomicSwap(cprId, seller, buyer, cotas, price);
    }

    // ============ TREASURY FUNCTIONS ============
    function releaseFunds(uint256 cprId) external onlyTreasury {
        CPRData storage c = cprs[cprId];
        
        require(c.fundingGoal > 0, "CPR does not exist");
        require(!c.released, "Already released");
        require(c.funded >= c.fundingGoal, "Funding goal not met");
        
        c.released = true;
        
        require(
            usdc.transfer(treasuryAddress, c.funded),
            "Transfer to treasury failed"
        );
        
        emit FundsReleased(cprId, c.funded);
    }

    function executeWaterfall(
        uint256 cprId,
        uint256 valueReceived,
        address[] calldata cotistaAddresses,
        uint256[] calldata cotistaShares,
        uint256 totalJurosPago
    ) external onlyTreasury nonReentrant {
        CPRData storage c = cprs[cprId];
        
        require(c.fundingGoal > 0, "CPR does not exist");
        require(c.released, "Funds not released");
        require(valueReceived > 0, "Invalid value");
        require(cotistaAddresses.length == cotistaShares.length, "Array mismatch");
        require(cotistaAddresses.length > 0, "Empty arrays");
        
        uint256 peerseedFee = (totalJurosPago * c.peerseedTaxPpm) / 1_000_000;
        uint256 netToDistribute = valueReceived - peerseedFee;
        
        uint256 totalCotas = c.totalCotas;
        require(totalCotas > 0, "No cotas");
        
        uint256 totalDistributed = 0;
        for (uint256 i = 0; i < cotistaAddresses.length; i++) {
            require(cotistaAddresses[i] != address(0), "Invalid address");
            
            uint256 share = (netToDistribute * cotistaShares[i]) / totalCotas;
            
            if (share > 0) {
                require(
                    usdc.transfer(cotistaAddresses[i], share),
                    "Distribution failed"
                );
                totalDistributed += share;
            }
        }
        
        uint256 remaining = valueReceived - totalDistributed;
        if (remaining > 0) {
            require(
                usdc.transfer(treasuryAddress, remaining),
                "Fee transfer failed"
            );
        }
        
        emit WaterfallExec(cprId, c.principal, totalJurosPago, peerseedFee, 0);
    }

    // ============ VIEW FUNCTIONS ============
    function getCPRData(uint256 cprId) external view returns (CPRData memory) {
        return cprs[cprId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
