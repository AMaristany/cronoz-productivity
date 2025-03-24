
import React, { useState } from "react";
import Layout from "../components/Layout";
import Stats from "../components/Stats";
import { Button } from "../components/ui/button";
import { Info } from "lucide-react";
import { trackEvent, ANALYTICS_EVENTS } from "../utils/analyticsUtils";

const Statistics: React.FC = () => {
  const [showManifesto, setShowManifesto] = useState(false);
  
  const toggleManifesto = () => {
    const newState = !showManifesto;
    setShowManifesto(newState);
    
    // Track the event
    if (newState) {
      trackEvent(ANALYTICS_EVENTS.OPEN_MANIFESTO);
    } else {
      trackEvent(ANALYTICS_EVENTS.CLOSE_MANIFESTO);
    }
  };
  
  return (
    <Layout title="Estadísticas">
      <Stats />
      
      <div className="mt-12 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground/50 text-xs"
          onClick={toggleManifesto}
        >
          <Info className="w-3 h-3 mr-1" />
          Info
        </Button>
      </div>
      
      {showManifesto && (
        <div className="mt-4 p-4 rounded-lg bg-muted/30 text-xs leading-relaxed text-muted-foreground animate-fade-in">
          <h3 className="font-semibold mb-2">RECUPERA TU TIEMPO</h3>
          <p>
            Tu atención es saqueada a cada segundo, Cronoz te devuelve el timón 🧭.<br />
            Haz más deporte. Lee más. Aprende a hacer cosas nuevas. Dedica tiempo a la gente que quieres.<br />
            Cada minuto consciente es una victoria contra el ruido 📢, una declaración de independencia 🚩.<br />
            Cronoz mide lo que importa para que tomes el control de tu tiempo ⏳.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Statistics;
