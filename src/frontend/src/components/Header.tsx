import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { ProfileMenu } from "./ProfileMenu";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  userType?: "farmer" | "investor";
  isSidebarExpanded?: boolean;
}

export const Header = ({ userType = "farmer", isSidebarExpanded = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const isFarmer = userType === "farmer" || location.pathname === "/agricultor";

  return (
    <header className={`h-20 border-b border-border bg-background px-3 md:px-6 flex items-center justify-between fixed top-0 right-0 z-[60] transition-all duration-500 left-0 ${isSidebarExpanded ? 'md:left-64' : 'md:left-20'}`}>
      {/* Mobile Menu */}
      <MobileMenu userType={userType} />

      {/* Center/Left - Profile Toggle */}
      <div className="flex items-center gap-1 md:gap-2 bg-secondary rounded-full p-1 md:mx-0 mx-auto">
        <button 
          onClick={() => navigate("/investidor")}
          className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all ${
            !isFarmer 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-background text-muted-foreground"
          }`}
        >
          <span>💼</span>
          <span className={`hidden sm:inline ${!isFarmer ? "font-medium" : ""}`}>Investidor</span>
        </button>
        <button 
          onClick={() => navigate("/agricultor")}
          className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all ${
            isFarmer 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-background text-muted-foreground"
          }`}
        >
          <span>🌱</span>
          <span className={`hidden sm:inline ${isFarmer ? "font-medium" : ""}`}>Agricultor</span>
        </button>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-3">
        <NotificationsDrawer 
          open={notificationsOpen} 
          onOpenChange={setNotificationsOpen} 
        />
        
        <ProfileMenu />
      </div>
    </header>
  );
};
