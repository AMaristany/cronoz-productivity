import React, { useState } from "react";
import { Activity } from "../types";
import { createActivity } from "../utils/timerUtils";
import { 
  Book, Code, Coffee, Music, Dumbbell, Briefcase, Pencil, 
  TreeDeciduous, Bike, Trophy, Guitar, Computer, Server, Terminal,
  HeartPulse, Pizza, Plane, Car, Film, Globe, ShoppingBag, Sun, Gamepad2,
  PenTool, Smartphone, Camera, Star, Clock, Palette, Building, Leaf,
  Flower, Mountain, Cloud, Network, Database, Monitor, Plus
} from "lucide-react";

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
  "#6FCF97", // Light green
  "#BB6BD9", // Light purple
  "#F2C94C", // Yellow
];

const ICON_CATEGORIES = [
  {
    name: "Básicos",
    icons: [
      { icon: <Book className="w-5 h-5" />, name: "Lectura" },
      { icon: <Coffee className="w-5 h-5" />, name: "Descanso" },
      { icon: <Pencil className="w-5 h-5" />, name: "Estudio" },
      { icon: <Briefcase className="w-5 h-5" />, name: "Trabajo" },
      { icon: <Clock className="w-5 h-5" />, name: "Tiempo" },
    ]
  },
  {
    name: "Naturaleza",
    icons: [
      { icon: <TreeDeciduous className="w-5 h-5" />, name: "Árbol" },
      { icon: <Leaf className="w-5 h-5" />, name: "Hoja" },
      { icon: <Flower className="w-5 h-5" />, name: "Flor" },
      { icon: <Mountain className="w-5 h-5" />, name: "Montaña" },
      { icon: <Sun className="w-5 h-5" />, name: "Sol" },
      { icon: <Cloud className="w-5 h-5" />, name: "Nube" },
    ]
  },
  {
    name: "Deportes",
    icons: [
      { icon: <Bike className="w-5 h-5" />, name: "Bicicleta" },
      { icon: <Trophy className="w-5 h-5" />, name: "Fútbol" },
      { icon: <Dumbbell className="w-5 h-5" />, name: "Baloncesto" },
      { icon: <Trophy className="w-5 h-5" />, name: "Voleibol" },
      { icon: <Dumbbell className="w-5 h-5" />, name: "Pesas" },
      { icon: <Trophy className="w-5 h-5" />, name: "Trofeo" },
    ]
  },
  {
    name: "Música",
    icons: [
      { icon: <Music className="w-5 h-5" />, name: "Música" },
      { icon: <Guitar className="w-5 h-5" />, name: "Guitarra" },
    ]
  },
  {
    name: "Digital",
    icons: [
      { icon: <Code className="w-5 h-5" />, name: "Código" },
      { icon: <Computer className="w-5 h-5" />, name: "Ordenador" },
      { icon: <Database className="w-5 h-5" />, name: "Base de datos" },
      { icon: <Network className="w-5 h-5" />, name: "Red" },
      { icon: <Server className="w-5 h-5" />, name: "Servidor" },
      { icon: <Terminal className="w-5 h-5" />, name: "Terminal" },
      { icon: <Monitor className="w-5 h-5" />, name: "Monitor" },
      { icon: <Smartphone className="w-5 h-5" />, name: "Móvil" },
    ]
  },
  {
    name: "Otros",
    icons: [
      { icon: <HeartPulse className="w-5 h-5" />, name: "Salud" },
      { icon: <Pizza className="w-5 h-5" />, name: "Comida" },
      { icon: <Plane className="w-5 h-5" />, name: "Viajes" },
      { icon: <Car className="w-5 h-5" />, name: "Coche" },
      { icon: <Film className="w-5 h-5" />, name: "Películas" },
      { icon: <Globe className="w-5 h-5" />, name: "Internet" },
      { icon: <ShoppingBag className="w-5 h-5" />, name: "Compras" },
      { icon: <Gamepad2 className="w-5 h-5" />, name: "Juegos" },
      { icon: <PenTool className="w-5 h-5" />, name: "Diseño" },
      { icon: <Camera className="w-5 h-5" />, name: "Fotografía" },
      { icon: <Star className="w-5 h-5" />, name: "Favorito" },
      { icon: <Palette className="w-5 h-5" />, name: "Arte" },
      { icon: <Building className="w-5 h-5" />, name: "Edificio" },
    ]
  }
];

const ALL_ICONS = ICON_CATEGORIES.flatMap(category => category.icons);

const NewActivityForm: React.FC<NewActivityFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0);
  const [currentCategory, setCurrentCategory] = useState<string>("Básicos");
  const [showMoreIcons, setShowMoreIcons] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    const newActivity = createActivity(
      name,
      ALL_ICONS[selectedIconIndex].name,
      selectedColor
    );
    
    onSubmit(newActivity);
  };
  
  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(100vh-200px)]">
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
        
        {!showMoreIcons ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {ALL_ICONS.slice(0, 7).map((icon, index) => (
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
            <button
              type="button"
              onClick={() => setShowMoreIcons(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 dark:border-cronoz-black-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cronoz-black-light"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-thin">
              {ICON_CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setCurrentCategory(category.name)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                    currentCategory === category.name
                      ? "bg-cronoz-green text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-cronoz-black-light dark:text-gray-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 mb-2">
              {ICON_CATEGORIES.find(cat => cat.name === currentCategory)?.icons.map((icon, index) => {
                const actualIndex = ALL_ICONS.findIndex(i => i.name === icon.name);
                
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setSelectedIconIndex(actualIndex)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      selectedIconIndex === actualIndex
                        ? "border-cronoz-green text-white"
                        : "border-gray-200 text-gray-600 dark:border-cronoz-black-light dark:text-gray-300"
                    }`}
                    style={{
                      backgroundColor: selectedIconIndex === actualIndex ? selectedColor : "transparent"
                    }}
                  >
                    {icon.icon}
                  </button>
                );
              })}
            </div>
            
            <button
              type="button"
              onClick={() => setShowMoreIcons(false)}
              className="text-sm text-cronoz-green hover:underline"
            >
              Mostrar menos
            </button>
          </>
        )}
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
