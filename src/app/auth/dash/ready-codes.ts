export const readyCodes = [
	{
		code: [
			"const NUMBER_OF_ROUNDS = 5",
			"",
			"if (PLAYER_CURRENT === PLAYER_TARGET) {",
			"  if (ROUND < NUMBER_OF_ROUNDS) {",
			"    playerSkip(PLAYER_CURRENT);",
			"  } else {",
			"    excludeCardEffects();",
			"  }",
			"}",
		].join("\n"),
		label: "Bloqueio",
		value: "block",
	},
	{
		code: [
			"const NUMBER_OF_ROUNDS = 5",
			"",
			"if (PLAYER_CURRENT === PLAYER_TARGET) {",
			"  if (ROUND > NUMBER_OF_ROUNDS) excludeCardEffects();",
			"",
			"  else if (ROUND < NUMBER_OF_ROUNDS) {",
			"    avanceToRound(ROUND + 1);",
			"  }",
			"",
			"  else if (ROUND === NUMBER_OF_ROUNDS) {",
			"    PLAYERS[PLAYER_TARGET].defense -= 10;",
			"    PLAYERS[PLAYER_TARGET].money -= 10;",
			"    PLAYERS[PLAYER_TARGET].justice -= 10;",
			"    updatePlayers(PLAYERS);",
			"  }",
			"}",
		].join("\n"),
		label: "Atacar após 5 rounds",
		value: "attack",
	},
];