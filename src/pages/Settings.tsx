
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

const Settings: React.FC = () => {
  const [simultaneousActivities, setSimultaneousActivities] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark" | "eco">("light");
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSimultaneous = localStorage.getItem("simultaneousActivities");
    if (savedSimultaneous) {
      setSimultaneousActivities(savedSimultaneous === "true");
    }
    
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "eco" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);
  
  const handleSimultaneousToggle = (checked: boolean) => {
    setSimultaneousActivities(checked);
    localStorage.setItem("simultaneousActivities", String(checked));
  };
  
  const handleThemeChange = (value: "light" | "dark" | "eco") => {
    setTheme(value);
    localStorage.setItem("theme", value);
    applyTheme(value);
  };
  
  const applyTheme = (theme: "light" | "dark" | "eco") => {
    const htmlEl = document.documentElement;
    
    // Remove all theme classes first
    htmlEl.classList.remove("light", "dark", "eco");
    
    // Add the appropriate class
    htmlEl.classList.add(theme);
    
    // For eco theme, add specific styles
    if (theme === "eco") {
      document.body.style.backgroundColor = "#F8F3E6"; // Sepia background
    } else {
      document.body.style.backgroundColor = "";
    }
  };
  
  return (
    <Layout title="Ajustes">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>
              Configura tus preferencias para la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="simultaneous" className="text-base">Actividades simultáneas</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Permite iniciar múltiples actividades al mismo tiempo
                </p>
              </div>
              <Switch 
                id="simultaneous"
                checked={simultaneousActivities}
                onCheckedChange={handleSimultaneousToggle}
              />
            </div>
            
            <div>
              <Label className="text-base mb-3 block">Tema</Label>
              <RadioGroup 
                value={theme} 
                onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "eco")}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Modo Claro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Modo Oscuro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="eco" id="eco" />
                  <Label htmlFor="eco">Modo Eco</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>Versión</Label>
              <span className="text-muted-foreground">0.1</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
