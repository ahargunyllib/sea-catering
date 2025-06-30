import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { createFileRoute } from "@tanstack/react-router";
import FormSection from "../features/subscribe/sections/form-section";
import HeroSection from "../features/subscribe/sections/hero-section";

export const Route = createFileRoute("/subscribe")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid h-svh">
			<Header />
			<main className="space-y-8 py-20 lg:py-40">
				<HeroSection />
				<FormSection />
			</main>
			<Footer />
		</div>
	);
}
