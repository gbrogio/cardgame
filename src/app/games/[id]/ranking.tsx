"use client";

import { useGameContext } from "context/game";
import Image from "next/image";

export const Ranking = () => {
	const { game } = useGameContext();

	return (
		<ul className="my-8 space-y-4 md:w-fit">
			{!game.players.length && (
				<span className="text-sm w-full text-center italic text-muted-foreground">
					Aguardando Jogadores...
				</span>
			)}
			{[...game.players]
				.sort(
					(a, b) =>
						game.players_ranking.indexOf(b.city) -
						game.players_ranking.indexOf(a.city),
				)
				.map((player, i) => (
					<li
						key={player.city}
						className="flex flex-col p-2 px-4 rounded-md border border-border w-fit"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<Image
									src={player.image}
									loader={() => player.image}
									aria-hidden
									alt=""
									className="w-10 h-10"
									unoptimized
									width={100}
									height={100}
								/>
								<p className="font-bold truncate max-w-[260px]">
									{player.city}
								</p>
							</div>
							<span className="text-primary/80 text-xl font-bold">
								{i + 1}º
							</span>
						</div>

						<div className="flex space-x-6 mt-4">
							<span className="text-muted-foreground italic">
								Defesa: {player.defense}
							</span>
							<span className="text-muted-foreground italic">
								Justiça: {player.justice}
							</span>
							<span className="text-muted-foreground italic">
								Dineiro: {player.money}
							</span>
						</div>
					</li>
				))}
		</ul>
	);
};
