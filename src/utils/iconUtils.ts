
import { 
  Book, Code, Coffee, Music, Dumbbell, Briefcase, Pencil, 
  TreeDeciduous, Bike, Trophy, Guitar, Computer, Server, Terminal,
  HeartPulse, Pizza, Plane, Car, Film, Globe, ShoppingBag, Sun, Gamepad2,
  PenTool, Smartphone, Camera, Star, Clock as ClockIcon, Palette, Building, Leaf,
  Flower, Mountain, Cloud, Network, Database, Monitor, LucideIcon
} from "lucide-react";

// Map of icon names to Lucide icon components
export const Icons: Record<string, LucideIcon> = {
  "Lectura": Book,
  "Código": Code,
  "Descanso": Coffee,
  "Música": Music,
  "Pesas": Dumbbell,
  "Trabajo": Briefcase,
  "Estudio": Pencil,
  "Árbol": TreeDeciduous,
  "Bicicleta": Bike,
  "Fútbol": Trophy, // Changed from Football to Trophy as a fallback
  "Trofeo": Trophy,
  "Guitarra": Guitar,
  "Ordenador": Computer,
  "Servidor": Server,
  "Terminal": Terminal,
  "Salud": HeartPulse,
  "Comida": Pizza,
  "Viajes": Plane,
  "Coche": Car,
  "Películas": Film,
  "Internet": Globe,
  "Compras": ShoppingBag,
  "Sol": Sun,
  "Juegos": Gamepad2,
  "Diseño": PenTool,
  "Móvil": Smartphone,
  "Fotografía": Camera,
  "Favorito": Star,
  "Tiempo": ClockIcon,
  "Arte": Palette,
  "Edificio": Building,
  "Hoja": Leaf,
  "Baloncesto": Dumbbell, // Changed from Activity to Dumbbell
  "Flor": Flower,
  "Montaña": Mountain,
  "Nube": Cloud,
  "Red": Network,
  "Base de datos": Database,
  "Monitor": Monitor,
  "Voleibol": Trophy // Changed from Volleyball to Trophy
};
