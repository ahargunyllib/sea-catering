import Header from "@/shared/components/header";
import { authClient } from "@/shared/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect } from "react";
import { z } from "zod/v4";
import HomeSection from "../features/dashboard/admin/sections/home-section";
import HeroSection from "../features/dashboard/user/sections/hero-section";
import OverviewSection from "../features/dashboard/user/sections/overview-section";
import Loader from "../shared/components/loader";
import { trpc } from "../shared/utils/trpc";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	validateSearch: zodValidator(
		z.object({
			startDate: z.string().optional(),
			endDate: z.string().optional(),
		}),
	),
});

function RouteComponent() {
	const { data: session, isPending } = authClient.useSession();

	const navigate = Route.useNavigate();

	const privateData = useQuery(trpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			navigate({
				to: "/login",
			});
		}
	}, [session, isPending, navigate]);

	if (isPending) {
		return <Loader />;
	}

	// For simplicity, we assume the user is an admin if their email ends with "@compfest.id"
	// In a real application, it should be checked by his role.
	const isAdmin = privateData.data?.user.email.endsWith("@compfest.id");

	return (
		<div className="grid h-svh">
			<Header />
			<main className="space-y-8 py-20 lg:py-40">
				{isAdmin ? (
					<HomeSection />
				) : (
					<>
						<HeroSection />
						<OverviewSection />
					</>
				)}
			</main>
		</div>
	);
}
