import { useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { MoveRight } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
	const [titleNumber, setTitleNumber] = useState(0);
	const titles = useMemo(
		() => ["nutritious", "customizable", "delicious", "fresh", "healthy"],
		[],
	);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (titleNumber === titles.length - 1) {
				setTitleNumber(0);
			} else {
				setTitleNumber(titleNumber + 1);
			}
		}, 2000);
		return () => clearTimeout(timeoutId);
	}, [titleNumber, titles]);

	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
					<div>
						<Button variant="secondary" size="sm">
							SEA Catering
						</Button>
					</div>
					<div className="flex flex-col gap-4">
						<h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
							<span className="text-spektr-cyan-50">Healthy Meals,</span>
							<span className="relative flex w-full justify-center overflow-hidden text-center md:pt-1 md:pb-4">
								&nbsp;
								{titles.map((title, index) => (
									<motion.span
										key={title}
										className="absolute font-semibold"
										initial={{ opacity: 0, y: "-100" }}
										transition={{ type: "spring", stiffness: 50 }}
										animate={
											titleNumber === index
												? { y: 0, opacity: 1 }
												: { y: titleNumber > index ? -150 : 150, opacity: 0 }
										}
									>
										{title}
									</motion.span>
								))}
							</span>
							<span className="text-spektr-cyan-50"> Anytime, Anywhere.</span>
						</h1>

						<p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
							SEA Catering delivers <strong>customizable healthy meals</strong>{" "}
							across Indonesia. Tailored to your dietary needs, we bring{" "}
							<strong>nutritional balance</strong> right to your
							doorstep—whether you're at home, in the office, or at the gym.
						</p>
					</div>
					<div className="flex flex-row gap-3">
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
