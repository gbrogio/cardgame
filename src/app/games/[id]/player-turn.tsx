"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { CardSelect, CardSelectItem } from "components/ui/card-select";
import { Input } from "components/ui/input";
import { useGameContext } from "context/game";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "utils/cn";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "components/ui/dialog";
import { toast } from "react-toastify";
import { getRandomNumber } from "utils/get-random-number";
import { Battle } from "./battle";
import { cardRule } from "./card-rule";

export const PlayerTurn = () => {
	const { game, player, saveGame } = useGameContext();
	const [openD3, setOpenD3] = useState(player?.round === 3);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingImage, setLoadingImage] = useState(false);
	const [imageSrc, setImageSrc] = useState<string | undefined>();
	const [isPlayerTurn, setIsPlayerTurn] = useState(false);
	const [cardNumber, setCardNumber] = useState<undefined | string>();
	const [playerSelected, setPlayerSelected] = useState<string | undefined>();
	const supabase = createClientComponentClient();
	const [randomNumber, setRandomNumber] = useState(0);

	useEffect(() => {
		console.log(game.battle);
		if (game.battle) {
			setIsPlayerTurn(false);
			return;
		}
		setIsPlayerTurn(player?.city === game.playerTurn);
		if (player?.city === game.playerTurn) setOpenD3(player?.round === 3);
	}, [game, player]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reason
	useEffect(() => {
		if (!(player?.city === game.playerTurn)) return;
		let card: number | undefined;
		async function playerSkip(index: number) {
			if (card === undefined) return;
			const newCards = [...game.cards];
			newCards[card].round += 1;
			setIsPlayerTurn(false);
			await supabase
				.from("game_classes")
				.update({
					playerTurn:
						game.players[game.players.length === index + 1 ? 0 : index + 1]
							.city,
					cards: newCards,
				})
				.eq("id", game.id);
		}

		async function updatePlayers(players: typeof game.players) {
			if (card === undefined) return;
			const newCards = [...game.cards];
			newCards[card].round += 1;
			await supabase
				.from("game_classes")
				.update({
					cards: newCards,
					players,
				})
				.eq("id", game.id);
		}

		async function avanceToRound(round: number) {
			if (card === undefined) return;
			const newCards = [...game.cards];
			newCards[card].round = round;
			await supabase
				.from("game_classes")
				.update({
					cards: newCards,
				})
				.eq("id", game.id);
		}

		async function excludeCardEffects() {
			if (card === undefined) return;
			const newCards = [...game.cards];
			newCards.splice(card, 1);
			toast.info(
				`Acabaram os efeitos da carta ${card}º:${newCards[card].name}. Sob o jogador: ${newCards[card].target}`,
			);
			await supabase
				.from("game_classes")
				.update({
					cards: newCards,
					saves: saveGame(),
				})
				.eq("id", game.id);
		}

		cardRule(game, {
			excludeCardEffects,
			avanceToRound,
			updatePlayers,
			playerSkip,
			setCard: (i: number) => {
				card = i;
			},
		});
	}, [isPlayerTurn]);

	async function getCardImage(card: string) {
		const { data } = await supabase
			.from("cards")
			.select("image_url")
			.eq("id", Number(card))
			.single();

		setImageSrc(data?.image_url as string);
	}

	useEffect(() => {
		setLoadingImage(true);
		setImageSrc(undefined);
		if (cardNumber) getCardImage(cardNumber);
		else {
			setImageSrc(undefined);
			setLoadingImage(false);
		}
	}, [cardNumber]);

	async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!playerSelected) return toast.warn("Selecione um jogador primeiro");
		setIsLoading(true);

		(
			event.target as unknown as { [k: string]: { value: string } }
		).card_number.value = "";

		const { data: card } = await supabase
			.from("cards")
			.select("*")
			.eq("id", Number(cardNumber))
			.single();

		const newPlayers = [...game.players];

		const playerIndex = newPlayers.findIndex(
			({ city }) => player?.city === city,
		);
		const nextPlayerIndex =
			playerIndex + 1 === newPlayers.length ? 0 : playerIndex + 1;
		const playerSelectedIndex = newPlayers.findIndex(
			({ city }) => city === playerSelected,
		);
		newPlayers[playerIndex].round =
			newPlayers[playerIndex].round === 3
				? 0
				: newPlayers[playerIndex].round + 1;
		newPlayers[playerIndex].defense +=
			(card?.sender as { [key: string]: number })?.defense || 0;
		newPlayers[playerIndex].justice +=
			(card?.sender as { [key: string]: number })?.justice || 0;
		newPlayers[playerIndex].money +=
			(card?.sender as { [key: string]: number })?.money || 0;

		newPlayers[playerSelectedIndex].defense +=
			(card?.receiver as { [key: string]: number })?.defense || 0;
		newPlayers[playerSelectedIndex].justice +=
			(card?.receiver as { [key: string]: number })?.justice || 0;
		newPlayers[playerSelectedIndex].money +=
			(card?.receiver as { [key: string]: number })?.money || 0;

		const players_ranking = [...newPlayers]
			.sort((a, b) => {
				const aPoints = a.defense + a.justice + a.money;
				const bPoints = b.defense + b.justice + b.money;
				return aPoints - bPoints;
			})
			.map((item) => item.city);

		const newCards = [...(game.cards || [])];
		if (card.rule.length)
			newCards.push({
				rules: card.rule,
				target: newPlayers[playerSelectedIndex].city,
				round: 0,
        name: card.name || 'Carta'
			});

		await supabase
			.from("game_classes")
			.update({
				saves: saveGame(),
				players: newPlayers,
				playerTurn: game.players[nextPlayerIndex].city,
				players_ranking,
				cards: newCards,
			})
			.eq("id", game.id)
			.then((res) => {
				if (res.error)
					toast.error("Não foi possivel lançar sua carta. Tente novamente.");
			});
		setIsLoading(false);
		setCardNumber(undefined);
		setPlayerSelected(undefined);
	}

	return (
		<div className="h-full flex flex-col">
			<Battle disabled={!isPlayerTurn} />

			<Dialog open={openD3} onOpenChange={setOpenD3}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>D3</DialogTitle>
						<DialogDescription>
							Faça conforme as instruções do mestre
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col space-y-4 my-8">
						<Button
							type="button"
							onClick={() => setRandomNumber(getRandomNumber(1, 3))}
						>
							Rolar D20
						</Button>

						<span className="text-muted-foreground text-sm italic">
							Role o dado para obter um valor:
						</span>
						<span className="text-muted-foreground text-lg flex items-center justify-between">
							Sua sorte é:{" "}
							<strong className="mx-4 text-8xl">{randomNumber}</strong>
						</span>
					</div>
					<DialogFooter>
						<DialogTrigger>
							<Button>Feito</Button>
						</DialogTrigger>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<div className="h-full py-8 mx-auto w-fit">
				<div className="flex flex-col relative rounded-lg px-8 py-8 items-center justify-center w-96 h-[500px] space-y-4 bg-accent opacity-80">
					{imageSrc ? (
						<>
							<Image
								src={imageSrc}
								alt=""
								width={800}
								height={800}
								className={cn("w-full h-full rounded-lg")}
								onLoad={() => setLoadingImage(false)}
							/>
							{loadingImage && (
								<span className="text-sm italic absolute">
									Carregando imagem...
								</span>
							)}
						</>
					) : (
						<span className="absolute text-sm italic">
							Aguardando o número da carta
						</span>
					)}
				</div>
			</div>
			<span className="text-muted-foreground mb-4 block text-sm italic">
				Selecione uma cidade e lançe a carta!
			</span>
			<CardSelect
				defaultValue={playerSelected ? [playerSelected] : []}
				onChangeValue={(v) => setPlayerSelected(v[0])}
				className={cn("w-full flex flex-wrap gap-4 mb-8", {
					"opacity-50 pointer-events-none": !isPlayerTurn || isLoading,
				})}
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
			<form onSubmit={onSubmit} className="h-fit flex space-x-8 pb-8">
				<Input
					type="number"
					name="card_number"
					placeholder="Número da carta (ex. 42)"
					disabled={!isPlayerTurn || isLoading}
					min={0}
					max={200}
					required
					onChange={({ target: { value } }) => setCardNumber(value)}
				/>
				<Button disabled={!isPlayerTurn || isLoading}>
					Lançar{" "}
					{isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
				</Button>
			</form>
		</div>
	);
};
