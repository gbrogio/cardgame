import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "./user-auth-form";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication forms built using the components.",
};

const AuthenticationPage = () => {
	return (
		<>
			<div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
					<div className="absolute inset-0 bg-zinc-900" />
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
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">
								&ldquo;Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Numquam quo quidem odio quae delectus, quia fugiat! Dolores sunt
								numquam commodi facilis, aliquid et magnam vero totam vel dicta.
								Corporis, minima..&rdquo;
							</p>
							<footer className="text-sm">Guillherme Brogio</footer>
						</blockquote>
					</div>
				</div>
				<div className="lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-96">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">
								Criar conta
							</h1>
							<p className="text-sm text-muted-foreground italic">
								Já possui uma conta?{" "}
								<Link
									href="/auth/login"
									className="hover:underline text-primary"
								>
									Entrar agora
								</Link>
							</p>
						</div>
						<UserAuthForm />
					</div>
				</div>
			</div>
		</>
	);
};

export default AuthenticationPage;
