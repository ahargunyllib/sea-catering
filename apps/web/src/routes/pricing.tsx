import PricingSection from "@/features/marketing/pricing/sections/pricing-section";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
	component: PricingComponent,
});

function PricingComponent() {
	return (
		<div className="grid h-svh">
			<Header />
			<PricingSection />
			<Footer />
		</div>
	);
}
