import { Signout } from "components/signout";
import { GameProvider } from "context/game";

const Layout = ({ children }: BTypes.FCChildren) => {
	return (
		<>
			<header className="w-full border-b border-border">
				<div className="max-w-7xl mx-auto flex items-center p-4 justify-between">
					<div className="relative z-20 flex items-center text-lg font-medium">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-2 h-6 w-6"
						>
							<title>Logo Vetorizada</title>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
						</svg>
						CardGame
					</div>
					<Signout />
				</div>
			</header>
			{children}
		</>
	);
};

export default Layout;
