import CTASection from "@/features/marketing/landing/sections/cta-section";
import FAQSection from "@/features/marketing/landing/sections/faq-section";
import HeroSection from "@/features/marketing/landing/sections/hero-section";
import StatSection from "@/features/marketing/landing/sections/stat-section";
import TestimonialSection from "@/features/marketing/landing/sections/testimonial-section";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="grid h-svh">
			<Header />
			<HeroSection />
			<StatSection />
			<TestimonialSection />
			<FAQSection />
			<CTASection />
			<Footer />
		</div>
	);
}
