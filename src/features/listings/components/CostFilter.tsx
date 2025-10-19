import { Card, CardContent, CardHeader } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { Label } from "@/shared/components/Label";

interface CostFilterProps {
  min: number;
  max: number;
  value1: number;
  value2: number;
  onChange: (value1: number, value2: number) => void;
}



export function CostFilter({ min, max, value1, value2, onChange }: CostFilterProps) {
  return (
    <Card className="w-45 px-3 py-0 border-none">
      <CardHeader className="p-0 mb-2">
        <Label variant="muted" size="sm" className="text-center">Price Range</Label>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={value1}
            placeholder={min.toLocaleString()}
            onChange={(e) => onChange(Number(e.target.value), value2)}
            className="flex-1"
          />
          <span className="text-sm tabular-nums text-muted-foreground whitespace-nowrap">-</span>
          <Input
            type="number"
            value={value2}
            placeholder={max.toLocaleString()}
            onChange={(e) => onChange(value1, Number(e.target.value))}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}