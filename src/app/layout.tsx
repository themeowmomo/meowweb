import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meow Momo | Best Pure Veg & Jain Momos in Malad East',
  description: 'Freshly prepared steam, fried, cheese, and kurkure momos at affordable prices in Malad East, Mumbai.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}