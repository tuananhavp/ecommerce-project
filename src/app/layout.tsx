import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
export const metadata = {
  title: "Jin Store",
  description: "Jin Store - E-commerce Website",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
