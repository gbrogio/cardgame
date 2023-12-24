import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Login } from "./login";
import { PlayerTurn } from "./player-turn";
import { Ranking } from "./ranking";

import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { GameProvider } from "context/game";
import { ChevronLeft } from "lucide-react";
import { Admin } from "./admin";
import { CloseGame } from "./close-game";

export const dynamic = "force-dynamic";

const GameClass = async ({ params }: { params: { id: string } }) => {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const { data, error } = await supabase
		.from("game_classes")
		.select("*")
		.eq("id", params.id);

	const { data: user } = await supabase.auth.getUser();

	const game = data?.[0];

	if (error || !game) return redirect("/");

	return (
		<GameProvider isOwner={game.owner === user.user?.id} game={game}>
			<main className="max-w-7xl w-full mx-auto p-4 pt-10 h-[calc(100dvh-6rem)] relative flex overflow-x-hidden">
				<Login />
				<div className="w-full flex flex-col p-4 overflow-y-auto">
					<div className="w-full flex justify-between items-center">
						<p className="uppercase font-bold text-xl">
							Sala: <span className="text-muted-foreground">{params.id}</span>
						</p>
						{game.owner === user.user?.id && <CloseGame />}
					</div>
					{game.owner === user.user?.id && <Admin />}
					<Separator className="my-8" />
					<PlayerTurn />
				</div>
				<input type="checkbox" id="side-ranking" className="sr-only peer" />
				<Button variant="secondary" asChild>
					<label
						htmlFor="side-ranking"
						className="absolute md:hidden right-4 z-10 top-1/2 peer-checked:right-64 border-primary border transition-all cursor-pointer select-none peer-checked:[&>svg]:rotate-180"
					>
						<ChevronLeft className="transition-all" />
					</label>
				</Button>
				<aside className="border-l border-border overflow-x-hidden h-full p-4 md:w-[420px] w-72 max-md:absolute transition-all bg-background max-md:peer-checked:translate-x-0 translate-x-8 right-0 max-md:h-[calc(100dvh-10rem)] overflow-y-auto max-md:max-w-0 max-md:peer-checked:max-w-xs">
					<h2 className="font-bold italic text-lg">Ranking:</h2>
					<Ranking />
				</aside>
			</main>
		</GameProvider>
	);
};

export default GameClass;
