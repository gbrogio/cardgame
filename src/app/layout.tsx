import { type Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toast } from "./toast";

import "styles/globals.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Script from "next/script";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = "force-dynamic";

const roboto = Roboto({
	weight: ["400", "700", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "",
	description: "",
};

const RootLayout = ({ children }: BTypes.FCChildren) => {
	return (
		<html lang="pt-BR" className={roboto.className}>
			<body className="min-h-screen flex flex-col overflow-x-hidden">
				<Toast />
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
