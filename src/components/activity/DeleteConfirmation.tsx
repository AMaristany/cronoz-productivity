
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-destructive mr-2">¿Confirmar?</span>
      <Button 
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="text-muted-foreground"
      >
        Cancelar
      </Button>
      <Button 
        variant="destructive"
        size="sm"
        onClick={onConfirm}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DeleteConfirmation;
