"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useGameContext } from "context/game";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AvatarGenerator } from "random-avatar-generator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getRandomNumber } from "utils/get-random-number";
const generator = new AvatarGenerator();

export const Login = () => {
	const { saveGame, player, game } = useGameContext();
	const router = useRouter();
	const [randomNumber, setRandomNumber] = useState<number | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(true);
	const supabase = createClientComponentClient();

	useEffect(() => {
		setOpen(!player);
	}, [player]);

	async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		const { city } = event.target as unknown as {
			[key: string]: { value: string };
		};
		localStorage.setItem(`${game.id}.player`, JSON.stringify(city.value));
		const playerExists = game.players.find(
			(player) => player.city === city.value,
		);
		if (playerExists)
			return toast.warn("Nome da cidade já em uso, digite outro");
		if (!randomNumber)
			return toast.warn("Ei você esqueceu de rolar o D20! Quer ficar pobre?");
		setIsLoading(true);

		const points =
			randomNumber > 0 && randomNumber <= 4
				? 100
				: randomNumber > 4 && randomNumber <= 8
					? 200
					: randomNumber > 8 && randomNumber <= 12
						? 400
						: randomNumber > 12 && randomNumber <= 16
							? 800
							: 1600;

		const newPlayer = {
			city: city.value,
			defense: points,
			image: generator.generateRandomAvatar(),
			justice: points,
			money: points,
			round: 0,
		};

		const newGame = {
			playerTurn: game.playerTurn ? game.playerTurn : newPlayer.city,
			players: [...game.players, newPlayer],
			players_ranking: [...game.players, newPlayer]
				.sort((a, b) => {
					const aPoints = a.defense + a.justice + a.money;
					const bPoints = b.defense + b.justice + b.money;
					return aPoints - bPoints;
				})
				.map((item) => item.city),
		};

		await supabase
			.from("game_classes")
			.update({
				...newGame,
				saves: saveGame({
					...newGame,
					cards: game.cards || [],
				}),
			})
			.eq("id", game.id)
			.then((res) => {
				if (res.error) {
					localStorage.removeItem(`${game.id}.player`);
					return toast.error(
						"Ocorreu um erro ao criar sua cidade! Tente novamente mais tarde.",
					);
				}

				setOpen(false);
			});
		setIsLoading(false);
	}

	return (
		<Dialog open={open}>
			<DialogContent
				handleClickClose={() => router.push("/")}
				className="sm:max-w-[425px]"
			>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Criar Perfil</DialogTitle>
						<DialogDescription>
							Faça o registros dos dados conforme as instruções do mestre
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col space-y-4 my-8">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="city">Nome da Cidade</Label>
							<Input
								id="city"
								name="city"
								placeholder="Utopia 42"
								required
								className="col-span-3"
								disabled={isLoading}
							/>
						</div>
					</div>
					<div className="flex flex-col space-y-4 my-8">
						<Button
							type="button"
							disabled={randomNumber !== undefined}
							onClick={() => setRandomNumber(getRandomNumber(1, 20))}
						>
							Rolar D20
						</Button>

						<span className="text-muted-foreground text-sm italic">
							Role o dado para obter um valor:
						</span>
						<span className="text-muted-foreground text-lg flex items-center justify-between">
							Sua sorte é:{" "}
							<strong className="mx-4 text-8xl">{randomNumber || "0"}</strong>
						</span>

						{!!randomNumber && (
							<span className="text-muted-foreground text-lg flex items-center justify-between">
								Parabéns você{" "}
								{randomNumber > 0 && randomNumber <= 4
									? "é: POBRE"
									: randomNumber > 4 && randomNumber <= 8
										? "faz parte da: CLASSE MÉDIA BAIXA"
										: randomNumber > 8 && randomNumber <= 12
											? "faz parte da: CLASSE MÉDIA ALTA"
											: randomNumber > 12 && randomNumber <= 16
												? "é: RICO"
												: "é: MILIONÁRIO"}
							</span>
						)}
					</div>

					<DialogFooter>
						<Button disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								"Criar Perfil"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
