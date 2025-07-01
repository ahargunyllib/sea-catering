import Header from "@/shared/components/header";
import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "../features/dashboard/user/sections/hero-section";
import OverviewSection from "../features/dashboard/user/sections/overview-section";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

// function RouteComponent() {
// 	const { data: session, isPending } = authClient.useSession();

// 	const navigate = Route.useNavigate();

// 	const privateData = useQuery(trpc.privateData.queryOptions());

// 	useEffect(() => {
// 		if (!session && !isPending) {
// 			navigate({
// 				to: "/login",
// 			});
// 		}
// 	}, [session, isPending, navigate]);

// 	if (isPending) {
// 		return <div>Loading...</div>;
// 	}

// 	return (
// 		<div>
// 			<h1>Dashboard</h1>
// 			<p>Welcome {session?.user.name}</p>
// 			<p>privateData: {privateData.data?.message}</p>
// 		</div>
// 	);
// }

function RouteComponent() {
	const isAdmin = false;
	return (
		<div className="grid h-svh">
			<Header />
			<main className="space-y-8 py-20 lg:py-40">
				{isAdmin ? null : (
					<>
						<HeroSection />
						<OverviewSection />
					</>
				)}
			</main>
		</div>
	);
}
