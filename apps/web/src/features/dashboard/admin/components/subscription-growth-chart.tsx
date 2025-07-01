import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/shared/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function SubscriptionGrowthChart() {
	const chartData = [
		{ month: "January", count: 186 },
		{ month: "February", count: 305 },
		{ month: "March", count: 237 },
		{ month: "April", count: 73 },
		{ month: "May", count: 209 },
		{ month: "June", count: 214 },
	];

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
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
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
			</CardContent>
		</Card>
	);
}
