import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { DollarSign, RotateCcw, TrendingUp, Users } from "lucide-react";

export default function MetricsCards() {
	const data = {
		metrics: {
			newSubscriptions: 47,
			monthlyRevenue: 125400000,
			reactivations: 8,
			activeSubscriptions: 312,
		},
	};

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
					<div className="font-bold text-2xl">
						{data.metrics.newSubscriptions}
					</div>
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
						Rp {data.metrics.monthlyRevenue.toLocaleString("id-ID")}
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
					<div className="font-bold text-2xl">{data.metrics.reactivations}</div>
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
					<div className="font-bold text-2xl">
						{data.metrics.activeSubscriptions}
					</div>
					<p className="text-muted-foreground text-xs">Total active</p>
				</CardContent>
			</Card>
		</div>
	);
}
