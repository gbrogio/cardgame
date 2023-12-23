"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Signout = () => {
	const router = useRouter();
	const supabase = createClientComponentClient();
	const [isAdmin, setIsAdmin] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reason
	useEffect(() => {
		supabase.auth.getUser().then((res) => {
			setIsAdmin(res.data.user?.user_metadata.role === "admin");
		});
	}, []);

	return (
		<div className="space-x-8">
			{isAdmin && (
				<Link href="/auth/dash" className="hover:underline">
					Dashboard
				</Link>
			)}
			<Button
				onClick={() => {
					supabase.auth.signOut();
					router.push("/");
				}}
			>
				Sair <LogOut className="w-4 h-4 ml-4" />
			</Button>
		</div>
	);
};
