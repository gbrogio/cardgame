/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type GameContext = {
	player:
		| {
				city: string;
				defense: number;
				justice: number;
				money: number;
				image: string;
				round: number;
				isOwner: boolean;
		  }
		| undefined;
	isOwner: boolean;
	saveGame: (newGame?: any) => GameContext["game"]["saves"];
	handlePlayer: React.Dispatch<React.SetStateAction<GameContext["player"]>>;
	handleDefaultGameState: React.Dispatch<
		React.SetStateAction<GameContext["game"]>
	>;
	game: {
		id: string;
		owner: string;
		saves: Omit<GameContext["game"], "saves" | "id" | "owner">[];
		players_ranking: string[];
		cards: {
			round: number;
			rules: string;
			target: string;
			name: string;
		}[];
		players: {
			city: string;
			defense: number;
			justice: number;
			money: number;
			image: string;
			round: number;
		}[];
		battle: boolean;
		playerTurn?: string;
	};
};

const GameContext = createContext<GameContext>({} as GameContext);
export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
	children,
	game: gameDefault,
	isOwner,
}: BTypes.FCChildren & { game: any; isOwner: boolean }) => {
	const supabase = createClientComponentClient();
	const router = useRouter();
	const [game, setGame] = useState<GameContext["game"]>(gameDefault);
	const [player, setPlayer] = useState<GameContext["player"]>();

	function saveGame(newGame?: any) {
		const gameToSave = newGame || game;
		const newSaves = [...(gameToSave.saves || [])];
		newSaves.unshift({
			players: gameToSave.players,
			players_ranking: gameToSave.players_ranking,
			playerTurn: `${gameToSave.playerTurn}`,
			cards: gameToSave.cards || [],
		});
		return newSaves;
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: reason
	useEffect(() => {
		const playerDefault = JSON.parse(
			localStorage.getItem(`${game.id}.player`) || "null",
		);
		if (playerDefault) {
			const player = game.players.find(({ city }) => city === playerDefault);
			setPlayer(player ? { ...player, isOwner } : undefined);
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reason
	useEffect(() => {
		const gameSB = supabase
			.channel("public:game_classes")
			.on(
				"postgres_changes",
				{
					event: "DELETE",
					schema: "public",
					table: "game_classes",
					filter: `id=eq.${gameDefault.id}`,
				},
				() => {
					localStorage.removeItem(`${game.id}.player`);
					toast.warn("O mestre fechou a sala");
					router.push("/");
				},
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "game_classes",
					filter: `id=eq.${gameDefault.id}`,
				},
				async (payload) => {
					setGame(payload.new as any);
					const user = await supabase.auth.getUser();
					const playerDefault = JSON.parse(
						localStorage.getItem(`${payload.new.id}.player`) || "null",
					);

					if (!playerDefault) return;
					if (playerDefault) {
						const player = payload.new.players.find(
							({ city }: any) => city === playerDefault,
						);
						setPlayer(player ? { ...player, isOwner } : undefined);
					}

					if (
						payload.new.players_ranking.includes(playerDefault) ||
						user.data.user?.id === payload.new.owner
					)
						return;
					localStorage.removeItem(`${payload.new.id}.player`);
					toast.warn("Você foi desconectado da sala");
					router.push("/");
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(gameSB);
		};
	}, []);

	const values = useMemo(
		() => ({
			handlePlayer: setPlayer,
			player,
			game,
			saveGame,
			isOwner,
			handleDefaultGameState: setGame,
		}),
		[player, game, isOwner],
	);

	return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
};
