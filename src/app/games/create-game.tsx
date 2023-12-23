"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { PencilRuler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export const CreateGame = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const supabase = createClientComponentClient();

	return (
		<Button
			className="self-end"
			variant="outline"
			disabled={loading}
			onClick={async () => {
				setLoading(true);
				const id = Math.random().toString(16).substring(2, 8).toUpperCase();
				const user = await supabase.auth.getUser();

				await supabase
					.from("game_classes")
					.insert({
						id,
						owner: user.data.user?.id,
						players: [],
						players_ranking: [],
						saves: [],
					})
					.then((res) => {
						if (res.error)
							return toast.error(
								"Ops.. Ocorreu algum erro ao criar seu game. Tente novamente mais tarde!",
							);
						router.push(`/games/${id}`);
					});

				setLoading(false);
			}}
		>
			<PencilRuler className="w-4 h-4 mr-4" /> Criar Sala
		</Button>
	);
};
