
import React from "react";
import { AlertCircle } from "lucide-react";

const EmptyActivities: React.FC = () => {
  return (
    <div className="glass-card p-8 text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2">No hay actividades</h3>
      <p className="text-muted-foreground">
        Regresa al cronómetro para crear tu primera actividad
      </p>
    </div>
  );
};

export default EmptyActivities;
