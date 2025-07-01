import { useState } from "react";
import type { DateRange } from "react-day-picker";
import DateRangeSelector from "../components/date-range-selector";
import MetricsCards from "../components/metrics-cards";
import SubscriptionGrowthChart from "../components/subscription-growth-chart";

export default function HomeSection() {
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(2025, 5, 12),
		to: new Date(2025, 6, 15),
	});

	return (
		<div className="container mx-auto space-y-8">
			<div className="space-y-2">
				<h1 className="font-bold text-4xl">Admin Dashboard</h1>
				<p className="text-muted-foreground text-xl">
					SEA Catering Business Analytics
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="flex flex-col gap-8">
					<DateRangeSelector
						dateRange={dateRange}
						setDateRange={setDateRange}
					/>

					<MetricsCards />
				</div>
				<SubscriptionGrowthChart />
			</div>
		</div>
	);
}
