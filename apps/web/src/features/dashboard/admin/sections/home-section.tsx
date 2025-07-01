import useDebounce from "@/shared/hooks/use-debounce";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import DateRangeSelector from "../components/date-range-selector";
import MetricsCards from "../components/metrics-cards";
import SubscriptionGrowthChart from "../components/subscription-growth-chart";

const route = getRouteApi("/dashboard");

export default function HomeSection() {
	const searchParams = route.useSearch();
	const navigate = route.useNavigate();
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: searchParams.startDate
			? new Date(searchParams.startDate)
			: new Date(2025, 5, 12),
		to: searchParams.endDate
			? new Date(searchParams.endDate)
			: new Date(2025, 11, 31),
	});
	const debouncedFilter = useDebounce(dateRange, 500);

	useEffect(() => {
		if (!debouncedFilter) return;
		if (!debouncedFilter.from || !debouncedFilter.to) return;

		const newSearch = {
			startDate: debouncedFilter.from?.toISOString().split("T")[0],
			endDate: debouncedFilter.to?.toISOString().split("T")[0],
		};
		const isDifferent = Object.entries(newSearch).some(
			([key, value]) =>
				searchParams[key as keyof typeof searchParams] !== value,
		);
		if (isDifferent) {
			navigate({ search: newSearch, replace: true });
		}
	}, [debouncedFilter, navigate, searchParams]);

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
