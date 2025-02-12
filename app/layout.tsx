import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Send LoveLetter",
  description: "Send love to loved ones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <div className="relative max-w-screen-sm mx-auto min-h-screen !p-2">
          {children}
        </div>
      </body>
    </html>
  );
}
