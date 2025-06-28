import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { pricings } from "@/shared/data/pricings";
import { cn } from "@/shared/lib/utils";
import { CheckCircle } from "lucide-react";

export default function PricingSection() {
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="mb-16 text-center">
					<h2 className="mb-6 font-black text-4xl md:text-5xl">
						Choose Your <span className="text-primary">Health Journey</span>
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
						Flexible plans designed to fit your lifestyle and health goals.
					</p>
				</div>
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
					{pricings.map((pricing, index) => (
						<Card
							// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since plans are static and won't change.
							key={index}
							className={cn(
								"relative border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:bg-white/10",
								pricing.popular && "ring-2 ring-emerald-500/50",
							)}
						>
							{pricing.popular && (
								<Badge className="-top-3 -translate-x-1/2 absolute left-1/2 transform bg-primary text-primary-foreground">
									Most Popular
								</Badge>
							)}
							<CardContent className="p-8">
								<div className="mb-8 text-center">
									<h3 className="mb-2 font-bold text-2xl">{pricing.name}</h3>
									<p className="mb-4 text-muted-foreground">
										{pricing.subtitle}
									</p>
									<div className="mb-2 flex items-baseline justify-center">
										<span className="font-black text-4xl">
											Rp{pricing.price}
										</span>
										<span className="ml-2 text-muted-foreground">/meal</span>
									</div>
									<p className="text-muted-foreground text-sm">
										{pricing.description}
									</p>
								</div>

								<ul className="mb-8 space-y-3">
									{pricing.features.map((feature, featureIndex) => (
										<li
											// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since features are static and won't change.
											key={featureIndex}
											className="flex items-center text-muted-foreground"
										>
											<CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
											{feature}
										</li>
									))}
								</ul>

								<Button className="w-full">Get Started</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
