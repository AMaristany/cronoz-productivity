
import React, { useState } from "react";
import { Activity } from "../types";
import { createActivity } from "../utils/timerUtils";
import { Book, Code, Coffee, Music, Dumbbell, Briefcase, Pencil } from "lucide-react";

interface NewActivityFormProps {
  onSubmit: (activity: Activity) => void;
  onCancel: () => void;
}

const COLORS = [
  "#8FD694", // Cronoz green
  "#5BAA60", // Cronoz dark green
  "#4A7FE8", // Blue
  "#9B51E0", // Purple
  "#F2994A", // Orange
  "#EB5757", // Red
  "#2D9CDB", // Light blue
];

const ICONS = [
  { icon: <Book className="w-5 h-5" />, name: "Lectura" },
  { icon: <Code className="w-5 h-5" />, name: "Programación" },
  { icon: <Coffee className="w-5 h-5" />, name: "Descanso" },
  { icon: <Music className="w-5 h-5" />, name: "Música" },
  { icon: <Dumbbell className="w-5 h-5" />, name: "Ejercicio" },
  { icon: <Briefcase className="w-5 h-5" />, name: "Trabajo" },
  { icon: <Pencil className="w-5 h-5" />, name: "Estudio" },
];

const NewActivityForm: React.FC<NewActivityFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    const newActivity = createActivity(
      name,
      ICONS[selectedIconIndex].name,
      selectedColor
    );
    
    onSubmit(newActivity);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nombre de la actividad
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Lectura, Trabajo, Ejercicio..."
          className="input-field w-full"
          autoFocus
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Icono
        </label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((icon, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIconIndex(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                selectedIconIndex === index
                  ? "border-cronoz-green text-white"
                  : "border-gray-200 text-gray-600 dark:border-cronoz-black-light dark:text-gray-300"
              }`}
              style={{
                backgroundColor: selectedIconIndex === index ? selectedColor : "transparent"
              }}
            >
              {icon.icon}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full transition-all ${
                selectedColor === color
                  ? "ring-2 ring-offset-2 ring-cronoz-green"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="button-secondary flex-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className={`button-primary flex-1 ${
            !name.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Crear Actividad
        </button>
      </div>
    </form>
  );
};

export default NewActivityForm;
