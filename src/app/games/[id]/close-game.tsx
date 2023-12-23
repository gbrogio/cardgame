"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { useGameContext } from "context/game";
import { BookmarkX } from "lucide-react";
import { useRouter } from "next/navigation";

export const CloseGame = () => {
	const router = useRouter();
	const { game } = useGameContext();
	const supabase = createClientComponentClient();

	return (
		<Button
			variant="destructive"
			onClick={async () => {
				await supabase.from("game_classes").delete().eq("id", game.id);
				router.push("/games");
			}}
		>
			<BookmarkX className="w-4 h-4 mr-4" /> Fechar sala
		</Button>
	);
};
