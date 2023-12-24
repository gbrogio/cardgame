"use client";

import * as React from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "utils/cn";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
	const router = useRouter();
	const supabase = createClientComponentClient();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		const email = (event.target as unknown as { email: { value: string } })
			.email.value;
		const password = (
			event.target as unknown as { password: { value: string } }
		).password.value;

		await supabase.auth
			.signInWithPassword({
				email,
				password,
			})
			.then((res) => {
        if (res.error) throw 'err'
				router.push("/games");
			})
			.catch(() => {
				toast.error(
					"Ocorreu um erro ao entrar na sua conta! Verifique se as credenciais estão corretas.",
				);
			});
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
							name="email"
							type="email"
							id="email"
							placeholder="Seu E-mail"
							disabled={isLoading}
							required
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
							Senha
						</Label>
						<Input
							name="password"
							type="password"
							id="password"
							placeholder="Sua Senha"
							disabled={isLoading}
							required
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
			{/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou</span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} asChild>
        <Link href="/signin">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PencilRuler className="mr-2 h-4 w-4" />
          )}{' '}
          Criar própria sala
        </Link>
      </Button> */}
		</div>
	);
};
