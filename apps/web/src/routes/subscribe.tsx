import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import FormSection from "../features/subscribe/sections/form-section";
import HeroSection from "../features/subscribe/sections/hero-section";
import { authClient } from "../shared/lib/auth-client";

export const Route = createFileRoute("/subscribe")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session, isPending } = authClient.useSession();

	const navigate = Route.useNavigate();

	useEffect(() => {
		if (!session && !isPending) {
			navigate({
				to: "/login",
			});
		}
	}, [session, isPending, navigate]);

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
