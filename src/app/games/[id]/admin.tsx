"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { useGameContext } from "context/game";
import { History, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

import { cn } from "utils/cn";

export const Admin = () => {
	const { game } = useGameContext();
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClientComponentClient();

	async function goBackInGame() {
		const newSaves = [...game.saves];
		const history =
			newSaves.length === 1 ? newSaves[0] : newSaves.splice(0, 2)[1];
		const cities = game.players.map((p) => p.city);

		await supabase
			.from("game_classes")
			.update({
				playerTurn: cities.includes(history?.playerTurn || "")
					? history?.playerTurn
					: cities[
							history?.players.findIndex(
								(p) => p.city === history?.playerTurn,
							) || 0
						],
				players: history?.players.filter(({ city }) => cities.includes(city)),
				players_ranking: history?.players_ranking.filter((city) =>
					cities.includes(city),
				),
				saves: [history, ...newSaves],
			})
			.eq("id", game.id)
			.then((res) => {
				if (res.error)
					toast.error("Não foi possivel desfazer a última. Tente novamente.");
			});
	}

	return (
		<div className="w-full flex flex-col">
			<div className="mt-4 self-end">
				<Button
					variant="outline"
					disabled={!(game.saves?.length > 1)}
					onClick={goBackInGame}
				>
					<History className="w-4 h-4 mr-4" />
					Desfazer ultima ação
				</Button>
			</div>
			<ul className="flex flex-wrap gap-4 mt-10">
				{game.players.map((player, i) => (
					<div
						className={cn(
							"flex flex-col min-w-[260px] w-fit relative rounded-lg px-8 py-8 items-center justify-center space-y-4 bg-accent opacity-80",
							{
								"ring-4 ring-green-400/20 border border-green-400 opacity-100":
									player.city === game.playerTurn,
							},
						)}
						key={player.city}
					>
						{player.city === game.playerTurn && (
							<span className="absolute text-green-400 top-4 right-4">
								Eu jogo!
							</span>
						)}
						<Image
							src={player.image}
							loader={() => player.image}
							aria-hidden
							alt=""
							className="w-8 h-8"
							unoptimized
							width={100}
							height={100}
						/>
						<span className="bold">{player.city}</span>

						<div className="">
							<Button
								variant="destructive"
								disabled={isLoading}
								onClick={async () => {
									setIsLoading(true);
									const newPlayers = [...game.players];
									newPlayers.splice(i, 1);
									await supabase
										.from("game_classes")
										.update({
											players: newPlayers,
											players_ranking: [...newPlayers]
												.sort(
													(a, b) =>
														a.defense +
														a.justice +
														a.money -
														b.defense +
														b.justice +
														b.money,
												)
												.map((player) => player.city),
										})
										.eq("id", game.id)
										.then((res) => {
											if (res.error)
												toast.error(
													"Não foi possivel remover o jogador. Tente novamente!",
												);
										});
									setIsLoading(false);
								}}
							>
								<Trash className="w-4 h-4 mr-4" />
								Remover da sala
							</Button>
						</div>
					</div>
				))}
			</ul>
		</div>
	);
};
