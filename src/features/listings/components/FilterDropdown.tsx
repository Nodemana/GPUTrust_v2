import { Button } from "@/shared/components/Button";
import { Card, CardContent, CardHeader } from "@/shared/components/Card";
import { Label } from "@/shared/components/Label";
import { cn } from "@/shared/utils/cn";
import { DropdownMenu } from "radix-ui";
import { useState } from "react";

interface FilterDropdownProps {
    label: string;
    options: {value: string, label: string}[];
    className?: string;
    onSelect?: (value: string) => void;
}

export function FilterDropdown({label, options, className, onSelect}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    
    return (
        <Card className="border-none">
         <CardHeader className="p-0 mb-2">
        <Label variant="muted" size="sm" className="text-center">{label}</Label>
      </CardHeader>
      <CardContent className="p-0">
        <DropdownMenu.Root onOpenChange={setIsOpen}>
		<DropdownMenu.Trigger asChild>
			<Button variant="outline" className={className}>
				{selectedValue ? options.find(opt => opt.value === selectedValue)?.label : "All"}
				{isOpen ? (
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
				) : (
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
				)}
			</Button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content className="border border-stroke min-w-[14rem] rounded-md bg-secondary p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade [&>svg]:fill-secondary [&>svg]:stroke-stroke [&>svg]:stroke-1">
				<DropdownMenu.Label />
				<DropdownMenu.Item />

				<DropdownMenu.Group className="">
					{options.map((option) => (
						<DropdownMenu.Item 
							key={option.value} 
							onSelect={() => {
								setSelectedValue(option.value);
								onSelect?.(option.value);
							}}
						
                        className={cn(
                            "bg-secondary rounded-md px-2 py-1",
                            selectedValue === option.value ? "bg-highlight text-text-dark" : "bg-secondary text-foreground"
                        )}>
							{option.label}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Group>
				<DropdownMenu.Arrow className="fill-secondary stroke-stroke stroke-3"/>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
    </CardContent>
    </Card>

    );
}