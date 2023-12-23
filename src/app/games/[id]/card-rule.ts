export function cardRule(
	game: any,
	{ excludeCardEffects, avanceToRound, updatePlayers, playerSkip, setCard }: any,
) {
	let i = -1;
	for (const c of game.cards || []) {
		i++;
		if (!c.rules.length) return;
		setCard(i)

		const PLAYER_CURRENT = game.players.findIndex(
			(p: any) => p.city === game.playerTurn,
		);
		const PLAYER_TARGET = game.players.findIndex(
			(p: any) => p.city === c.target,
		);
		const PLAYERS = [...game.players];
		const ROUND = c.round;

		eval(c.rules);
	}
}
