import { Button } from "@/components/ui/button";

interface FilterControlsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "none", name: "None" },
  { id: "vintage", name: "Vintage" },
  { id: "bw", name: "B&W" },
  { id: "bright", name: "Bright" },
];

export default function FilterControls({ selectedFilter, onFilterChange }: FilterControlsProps) {
  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div className="space-y-3">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            variant="ghost"
            className={`glassmorphism w-16 h-16 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors ${
              selectedFilter === filter.id ? "bg-white/30" : ""
            }`}
          >
            <span className="text-xs font-medium">{filter.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
