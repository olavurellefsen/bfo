import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tórshavn Marathon 2025 - Live Stream",
  description: "Live streaming coverage of the Tórshavn Marathon 2025 in the Faroe Islands. Watch the race live on June 1, 2025.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
