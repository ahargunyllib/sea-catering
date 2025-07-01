import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { getRouteApi } from "@tanstack/react-router";
import { DollarSign, RotateCcw, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/shared/utils/trpc";

const route = getRouteApi("/dashboard");

export default function MetricsCards() {
	const searchParams = route.useSearch();
	const { data } = useQuery(
		trpc.getMetrics.queryOptions({
			startDate: searchParams.startDate || "2025-01-01",
			endDate: searchParams.endDate || "2025-12-31",
		}),
	);

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						New Subscriptions
					</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{data?.newSubscriptions}</div>
					<p className="text-muted-foreground text-xs">This month</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Monthly Revenue</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						Rp {data?.monthlyRevenue.toLocaleString("id-ID")}
					</div>
					<p className="text-muted-foreground text-xs">+12% from last month</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Reactivations</CardTitle>
					<RotateCcw className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{data?.reactivations}</div>
					<p className="text-muted-foreground text-xs">This month</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						Active Subscriptions
					</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{data?.activeSubscriptions}</div>
					<p className="text-muted-foreground text-xs">Total active</p>
				</CardContent>
			</Card>
		</div>
	);
}
