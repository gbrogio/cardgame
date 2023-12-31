"use client";

import * as React from "react";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Loader2, PencilRuler } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "utils/cn";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
	const router = useRouter();
	const [code, setCode] = React.useState("");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);

		router.push(`/games/${code}`);
		setIsLoading(false);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
							Email
						</Label>
						<Input
							name="code"
							id="code"
							placeholder="CODIGO"
							disabled={isLoading}
							required
							value={code}
							onChange={({ target: { value } }) =>
								setCode(value.substring(0, 7).toUpperCase())
							}
						/>
					</div>
					<Button disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							"Entrar no Game"
						)}
					</Button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Ou</span>
				</div>
			</div>
			<Button variant="outline" type="button" disabled={isLoading} asChild>
				<Link href="/auth/login">
					{isLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<PencilRuler className="mr-2 h-4 w-4" />
					)}{" "}
					Criar própria sala
				</Link>
			</Button>
		</div>
	);
};
