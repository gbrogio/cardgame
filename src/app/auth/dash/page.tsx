import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Separator } from "components/ui/separator";
import { CardTable } from "./card-table";

import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async () => {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const { data } = await supabase.from("cards").select("*");

	return (
		<main className="max-w-7xl mx-auto w-full">
			<Link href="/games" className="p-10 flex pb-0 hover:underline">
				<ChevronLeft className="mr-4" /> <span>Voltar</span>
			</Link>
			<div className="hidden space-y-6 p-10 pb-16 md:block">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Cartas</h2>
					<p className="text-muted-foreground">
						Crie e atualize as cartas para o jogo
					</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<CardTable data={data || []} />
				</div>
			</div>
		</main>
	);
};

export default Page;
