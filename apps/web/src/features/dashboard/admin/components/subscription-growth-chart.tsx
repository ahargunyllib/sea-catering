import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/shared/components/ui/chart";
import { trpc } from "@/shared/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const route = getRouteApi("/dashboard");

export default function SubscriptionGrowthChart() {
	const searchParams = route.useSearch();
	const { data } = useQuery(
		trpc.getSubscriptionGrowth.queryOptions({
			startDate: searchParams.startDate || "2025-01-01",
			endDate: searchParams.endDate || "2025-12-31",
		}),
	);

	const chartConfig = {
		count: {
			label: "count",
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Subscription Growth</CardTitle>
				<CardDescription>New subscriptions over time</CardDescription>
			</CardHeader>
			<CardContent>
				{data?.subscriptionGrowth && (
					<ChartContainer config={chartConfig}>
						<AreaChart
							accessibilityLayer
							data={data.subscriptionGrowth}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value}
							/>
							<Area
								dataKey="count"
								type="natural"
								fill="var(--color-count)"
								fillOpacity={0.4}
								stroke="var(--color-count)"
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
