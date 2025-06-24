import { stat } from "@/shared/data/stats";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

export default function StatSection() {
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
					{stat.map((item) => (
						<div
							key={item.name}
							className="flex flex-col justify-between gap-0 rounded-md border p-6"
						>
							{item.trend > 0 ? (
								<MoveUpRight className="mb-10 h-4 w-4 text-primary" />
							) : (
								<MoveDownLeft className="mb-10 h-4 w-4 text-destructive" />
							)}
							<h2 className="flex max-w-xl flex-row items-end gap-4 text-left font-regular text-4xl tracking-tighter">
								{item.value}
								<span className="text-muted-foreground text-sm tracking-normal">
									{item.trend > 0 ? `+${item.trend}%` : `-${item.trend}%`}
								</span>
							</h2>
							<p className="max-w-xl text-left text-base text-muted-foreground leading-relaxed tracking-tight">
								{item.name}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
