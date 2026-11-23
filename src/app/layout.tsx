import type { Metadata } from "next";
import '../assets/css/global.scss'
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Context } from "@/providers/Context";
import ModalWrapper from "@/components/ModalWrapper/ModalWrapper";
import Homer from "@/components/Homer/Homer";

export const metadata: Metadata = {
	title: {
		default: 'CarPal',
		template: '%s | CarPal'
	},
	
	description: "CarPal",
	keywords: ['CarPal', 'commercial', 'risk', 'management', 'insurance'],
	authors: [{ name: 'Stanislav', url: '' }],
	creator: 'Stanislav | ',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
				<link rel="icon" type="image/png" href="/favicon-96x96.png?v=2" sizes="96x96" />
				<link rel="shortcut icon" href="/favicon.ico?v=2" />

				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

				<meta name="apple-mobile-web-app-title" content="CarPal" />

				<link rel="manifest" href="/site.webmanifest" />

				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0866ff" />

				<meta name="theme-color" content="#0866ff" />
				{/* <link rel="preload" href="..assets/fonts/Inter-Regular.woff2" as="font" type="font/woff2" />
				<link rel="preload" href="./assets/fonts/Inter-SemiBold.woff2" as="font" type="font/woff2" />
				<link rel="preload" href="./assets/fonts/Inter-Bold.woff2" as="font" type="font/woff2" /> */}
			</head>
			<body>
				<Context> 
					<main>
						{children}
					</main>
				</Context>
			</body>
			{/* <body className="flex flex-col min-h-dvh">
				<div id="skiper"><a href="#maincontent" role='button'>Skip to main content</a></div>
				<Context> 
					<Homer />
					<ModalWrapper />
					<Header />
					<main id='#maincontent'>
						{children}
					</main>
					<Footer />
				</Context>
			</body> */}
		</html>
	);
}
