import type {Metadata} from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  metadataBase: new URL('https://meowmomo.netlify.app'),
  title: 'Meow Momo | Best Pure Veg & Jain Momos in Malad East',
  description: 'Freshly prepared steam, fried, cheese, and kurkure momos at affordable prices in Malad East, Mumbai.',
  keywords: ['Meow Momo', 'Momos Malad East', 'Jain Momos Mumbai', 'Veg Momos Mumbai', 'Kurkure Momos', 'Street Food Malad'],
  openGraph: {
    title: 'Meow Momo | Pure Veg & Jain Specialist',
    description: 'The best momos in Malad East. 100% Pure Veg and Jain options available.',
    url: 'https://meowmomo.netlify.app',
    siteName: 'Meow Momo',
    locale: 'en_IN',
    type: 'website',
  },
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
        <FirebaseClientProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
