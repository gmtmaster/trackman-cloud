import "./globals.css";
import { Oswald, Lato } from "next/font/google";

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-oswald",
});

const lato = Lato({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-lato",
});

export const metadata = {
    title: "Trackman Cloud",
    description: "Login to your account",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${oswald.variable} ${lato.variable}`}>
        <body className="font-sans bg-zinc-900">{children}</body>
        </html>
    );
}
