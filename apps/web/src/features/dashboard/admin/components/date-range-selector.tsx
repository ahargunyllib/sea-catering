import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import { ChevronDownIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

export default function DateRangeSelector({
	dateRange,
	setDateRange,
}: {
	dateRange: DateRange | undefined;
	setDateRange: (range: DateRange | undefined) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-between"
					onClick={(e) => e.stopPropagation()}
				>
					<span className="text-sm">
						{dateRange?.from
							? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`
							: "Select Date Range"}
					</span>
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto overflow-hidden p-0" align="start">
				<Calendar
					mode="range"
					captionLayout="dropdown"
					defaultMonth={dateRange?.from}
					selected={dateRange}
					onSelect={setDateRange}
					numberOfMonths={2}
					className="rounded-lg border shadow-sm"
				/>
			</PopoverContent>
		</Popover>
	);
}
