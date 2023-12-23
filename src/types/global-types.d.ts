declare namespace BTypes {
	type FCChildren<T = React.ReactNode> = { children?: T };

	type NPage<T = Record<string, any>, U extends boolean = false> = (
		props: T,
	) => U extends true ? Promise<JSX.Element> : JSX.Element;

	type NLPage<T = Record<string, any>, U extends boolean = false> = NPage<T & FCChildren, U>;

	type FCProps<
		T = Record<string, any>,
		U = Record<string, any>,
		V extends boolean = true,
		W extends boolean = true,
		X = React.ReactNode,
	> = (W extends true ? FCChildren<X> : Record<string, any>) &
		(V extends true
			? Omit<React.HTMLAttributes<U>, "children">
			: Omit<U, "children">) &
		T;

	type FC<
		T = Record<string, any>,
		U = Record<string, any>,
		V extends boolean = true,
		W extends boolean = true,
		X = React.ReactNode,
	> = (props: FCProps<T, U, V, W, X>) => JSX.Element;

	type FCIcon<T = Record<string, any>> = (
		props: React.SVGProps<SVGSVGElement> & T,
	) => JSX.Element;

	type Full<T> = {
		[P in keyof T]-?: T[P];
	};
}
