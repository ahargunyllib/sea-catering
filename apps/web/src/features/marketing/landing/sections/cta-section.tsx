import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { MoveRight } from "lucide-react";

export default function CTASection() {
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex flex-col items-center gap-8 rounded-md bg-muted p-4 text-center lg:p-14">
					<div>
						<Badge>Get started</Badge>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
							Ready to Transform Your Health?
						</h3>
						<p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
							Join us today and experience the convenience of healthy, delicious
							meals delivered right to your door. Whether you're looking to eat
							better, save time, or simply enjoy great food, we've got you
							covered.
						</p>
					</div>
					<div className="flex flex-row gap-4">
						<Button size="lg" className="gap-4">
							Start your subscription <MoveRight className="h-4 w-4" />
						</Button>
						<Button size="lg" className="gap-4" variant="outline">
							Pricing <MoveRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
