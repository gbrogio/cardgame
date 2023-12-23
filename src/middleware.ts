import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	const session = await supabase.auth.getSession();

	if (req.nextUrl.pathname.startsWith("/auth/dash")) {
		if (
			session.error === null &&
			session.data.session?.user.user_metadata.role === "admin"
		)
			return res;
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}
	if (req.nextUrl.pathname.startsWith("/auth")) {
		if (session.error || !session.data.session) return res;
		return NextResponse.redirect(new URL("/games", req.url));
	}
	if (req.nextUrl.pathname === "/games") {
		if (session.data.session !== null && session.error === null) return res;
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}
	return res;
}
