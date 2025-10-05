import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface DocumentsStepProps {
  loanData: any;
  setLoanData: (data: any) => void;
}

export const DocumentsStep = ({ loanData, setLoanData }: DocumentsStepProps) => {
  const [dragActive, setDragActive] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docType);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], docType);
    }
  };

  const handleFile = (file: File, docType: string) => {
    setLoanData({
      ...loanData,
      documents: {
        ...loanData.documents,
        [docType]: file.name,
      },
    });
  };

  const documents = [
    { id: "rg", label: "RG/CNH", required: true },
    { id: "address", label: "Comprovante de residência", required: true },
    { id: "car", label: "CAR (Cadastro Ambiental Rural)", required: true },
    { id: "invoices", label: "Notas fiscais", required: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Upload de documentos</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Envie os documentos necessários para análise do crédito
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className={`p-6 border-2 border-dashed transition-colors ${
              dragActive === doc.id
                ? "border-primary bg-primary/5"
                : loanData.documents[doc.id]
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/50"
            }`}
            onDragEnter={(e) => handleDrag(e, doc.id)}
            onDragLeave={(e) => handleDrag(e, doc.id)}
            onDragOver={(e) => handleDrag(e, doc.id)}
            onDrop={(e) => handleDrop(e, doc.id)}
          >
            <Label htmlFor={doc.id} className="cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                {loanData.documents[doc.id] ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    <div>
                      <p className="font-medium text-primary">
                        {doc.label} {doc.required && "*"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {loanData.documents[doc.id]}
                      </p>
                      <p className="text-xs text-primary mt-2">
                        Clique para substituir
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {doc.label} {doc.required && "*"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Arraste ou clique para enviar
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.required ? "Obrigatório" : "Opcional"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Label>
            <input
              id={doc.id}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0], doc.id);
                }
              }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Formatos aceitos:</strong> PDF, JPG, PNG (máx. 5MB por arquivo)
        </p>
      </div>
    </div>
  );
};
