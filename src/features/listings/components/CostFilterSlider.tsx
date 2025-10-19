import { Slider } from "radix-ui";
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from "@/shared/components/Card";
import { Label } from "@/shared/components/Label";

interface CostFilterProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export function CostFilter({ min, max, value, onChange }: CostFilterProps) {
  return (
    <Card className="w-full p-3 border-none">
      <CardHeader className="p-0 mb-2">
        <Label variant="muted" size="sm" className="text-left ml-9">Price Range</Label>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums text-muted-foreground whitespace-nowrap">${min.toLocaleString()}</span>
          <div className="flex-1">
            <Slider.Root
              className="relative flex h-5 w-20 touch-none select-none items-center"
              value={[value]}
              onValueChange={(vals) => onChange(vals[0] ?? value)}
              min={min}
              max={max}
              step={1}
            >
              <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-stroke">
                <Slider.Range className="absolute h-full bg-highlight" />
              </Slider.Track>
              <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-highlight bg-background shadow focus:outline-none focus:ring-2 focus:ring-highlight" />
            </Slider.Root>
          </div>
          <span className="text-sm tabular-nums text-foreground whitespace-nowrap">${value.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}