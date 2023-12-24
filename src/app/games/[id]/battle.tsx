"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { CardSelect, CardSelectItem } from "components/ui/card-select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "components/ui/dialog";
import { useGameContext } from "context/game";
import { Swords } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CardPlayers = ({ getPlayer }: { getPlayer: (p: string) => void }) => {
	const { game } = useGameContext();
	return (
		<CardSelect
			onChangeValue={(v) => getPlayer(v[0])}
			className="w-full flex flex-wrap gap-4 mb-8"
		>
			{game.players.map((player) => (
				<CardSelectItem
					key={player.city}
					value={player.city}
					className="max-w-[260px]"
				>
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
				</CardSelectItem>
			))}

			{!game.players.length && (
				<span className="text-muted-foreground mb-4 block text-sm italic text-center w-full">
					Aguardando outros jogadores...
				</span>
			)}
		</CardSelect>
	);
};

export const Battle = ({ disabled }: { disabled: any }) => {
	const { saveGame, game, player } = useGameContext();
	const supabase = createClientComponentClient();
	const [open, setOpen] = useState(!!(player?.isOwner && game.battle));
	const [playerWinner, setPlayerWinner] = useState<string | undefined>();
	const [playerLooser, setPlayerLooser] = useState<string | undefined>();

	useEffect(() => {
		setOpen(!!(player?.isOwner && game.battle));
	}, [game, player]);

	return (
		<>
			<Dialog open={open}>
				<DialogContent showCloseButton={false} className="max-w-7xl overflow-auto max-h-[70dvh]">
					<DialogHeader>
						<DialogTitle>Modo Batalha</DialogTitle>
						<DialogDescription>
							Faça conforme as instruções do mestre
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col space-y-4 my-2">
						<h2>Selecione o Vencedor:</h2>
						<CardPlayers getPlayer={setPlayerWinner} />
					</div>
					<div className="flex flex-col space-y-4 mb-2">
						<h2>Selecione o Perdedor:</h2>
						<CardPlayers getPlayer={setPlayerLooser} />
					</div>
					<DialogFooter>
						<Button
							disabled={!playerWinner || !playerLooser}
							onClick={async () => {
								const newPlayers = [...game.players];

								const playerIndex = newPlayers.findIndex(
									({ city }) => playerWinner === city,
								);
								const playerSelectedIndex = newPlayers.findIndex(
									({ city }) => city === playerLooser,
								);

								newPlayers[playerIndex].defense += Math.round(
									newPlayers[playerSelectedIndex].defense / 2,
								);
								newPlayers[playerIndex].justice += Math.round(
									newPlayers[playerSelectedIndex].justice / 2,
								);
								newPlayers[playerIndex].money += Math.round(
									newPlayers[playerSelectedIndex].money / 2,
								);

								newPlayers[playerSelectedIndex].defense = Math.round(
									newPlayers[playerSelectedIndex].defense / 2,
								);
								newPlayers[playerSelectedIndex].justice = Math.round(
									newPlayers[playerSelectedIndex].justice / 2,
								);
								newPlayers[playerSelectedIndex].money = Math.round(
									newPlayers[playerSelectedIndex].money / 2,
								);

								const players_ranking = [...newPlayers]
									.sort((a, b) => {
										const aPoints = a.defense + a.justice + a.money;
										const bPoints = b.defense + b.justice + b.money;
										return aPoints - bPoints;
									})
									.map((item) => item.city);

								await supabase
									.from("game_classes")
									.update({
										saves: saveGame(),
										players: newPlayers,
										players_ranking,
										battle: false,
									})
									.eq("id", game.id)
									.then((res) => {
										if (res.error)
											toast.error(
												"Não foi possivel finalizar a batalha. Tente novamente.",
											);
										else setOpen(false);
									});
							}}
						>
							Acabar com a batalha
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Button
				type="button"
				disabled={disabled}
        title="Entrar em batalha"
				onClick={() => {
					const playerIndex = game.players.findIndex(
						({ city }) => player?.city === city,
					);
					const nextPlayerIndex =
						playerIndex + 1 === game.players.length ? 0 : playerIndex + 1;

					supabase
						.from("game_classes")
						.update({
							playerTurn: game.players[nextPlayerIndex].city,
							battle: true,
						})
						.eq("id", game.id)
						.then((res) => {
							if (res.error)
								toast.error(
									"Não foi possivel entrar em batalha. Tente novamente.",
								);
							else setOpen(!!(player?.isOwner && game.battle));
						});
				}}
				className="fixed top-1/2 cursor-pointer -translate-y-1/2 bg-primary p-4 h-auto rounded-full shadow-md hover:scale-105 transition-all active:scale-95"
			>
				<Swords />
				<span className="sr-only">Entrar em Batalhar</span>
			</Button>
		</>
	);
};
