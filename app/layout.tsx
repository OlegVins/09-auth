import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Manage your notes easily with NoteHub",
  openGraph: {
    title: "NoteHub",
    description: "Manage your notes easily with NoteHub",
    url: 'https://notehub.app',
    images: [
      'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
