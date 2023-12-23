import { Dot } from "lucide-react";
import { CreateGame } from "./create-game";

const Page = () => {
	return (
		<main className="max-w-7xl mx-auto p-4 pt-10 flex flex-col space-y-8">
			<CreateGame />

			<div className="bg-accent overflow-hidden shadow sm:rounded-lg p-4 text-muted-foreground">
				<h2 className="text-lg text-foreground font-bold mb-4 text=">Sobre</h2>
				<p>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos beatae,
					dolorem fuga mollitia necessitatibus iure aspernatur fugit odio.
					Soluta alias animi cumque, neque veniam odio ipsum earum culpa
					adipisci sit.
				</p>
			</div>
			<div className="bg-accent overflow-hidden shadow sm:rounded-lg p-4 text-muted-foreground">
				<h2 className="text-lg text-foreground font-bold mb-4">Regras</h2>
				<p className="flex">
					<Dot />
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos beatae,
					dolorem fuga mollitia necessitatibus iure aspernatur fugit odio.
					Soluta alias animi cumque, neque veniam odio ipsum earum culpa
					adipisci sit.
				</p>
				<br />
				<p className="flex">
					<Dot />
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos beatae,
					dolorem fuga mollitia necessitatibus iure aspernatur fugit odio.
					Soluta alias animi cumque, neque veniam odio ipsum earum culpa
					adipisci sit.
				</p>
				<br />
				<p className="flex">
					<Dot />
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos beatae,
					dolorem fuga mollitia necessitatibus iure aspernatur fugit odio.
					Soluta alias animi cumque, neque veniam odio ipsum earum culpa
					adipisci sit.
				</p>
			</div>
		</main>
	);
};

export default Page;
