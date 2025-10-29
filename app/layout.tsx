import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Jaifoo",
    description: "Jaifoo money buddy",
    generator: "Jaifoo",
    icons: {
        icon: '/jaifoo_instruction_nobg.png',
        apple: '/jaifoo_instruction_nobg.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
            >
                {children}
                <Analytics />
            </body>
        </html>
    );
}
