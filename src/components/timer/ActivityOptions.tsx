
import React from "react";
import { MoreVertical, Pencil } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

interface ActivityOptionsProps {
  onEdit: () => void;
}

const ActivityOptions: React.FC<ActivityOptionsProps> = ({ onEdit }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-cronoz-black-light border border-border">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          Cambiar nombre
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActivityOptions;
