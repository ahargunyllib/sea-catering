import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import { faqs } from "@/shared/data/faqs";

export default function FAQSection() {
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="grid gap-10 lg:grid-cols-2">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-4">
							<div>
								<Badge variant="outline">FAQ</Badge>
							</div>
							<div className="flex flex-col gap-2">
								<h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
									Frequently Asked Questions
								</h4>
								<p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
									Here are some of the most common questions we get about our
									catering services. If you have any other questions, feel free
									to reach out to us!
								</p>
							</div>
							<div />
						</div>
					</div>
					<Accordion type="single" collapsible className="w-full">
						{faqs.map((faq) => (
							<AccordionItem key={faq.question} value={faq.answer}>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</div>
	);
}
