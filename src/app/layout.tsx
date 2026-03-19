import type {Metadata} from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  metadataBase: new URL('https://meowmomo.netlify.app'),
  title: 'Meow Momo | Best Pure Veg & Jain Momos in Malad East, Mumbai',
  description: 'Experience the most hygienic and delicious Pure Veg and Jain Momos in Malad East. From Cheese Fried to Kurkure Momos, we offer tech-powered street food quality.',
  keywords: [
    'Meow Momo', 
    'Momos Malad East', 
    'Jain Momos Mumbai', 
    'Veg Momos Mumbai', 
    'Kurkure Momos', 
    'Street Food Malad', 
    'Best Momos Mumbai', 
    'Amit Jaiswal', 
    'Karan Sawant',
    'Hygienic Momos Mumbai'
  ],
  authors: [{ name: 'Amit Jaiswal' }, { name: 'Karan Sawant' }],
  creator: 'Meow Momo Team',
  publisher: 'Meow Momo',
  openGraph: {
    title: 'Meow Momo | Best Pure Veg & Jain Momos in Mumbai',
    description: 'Serving the freshest Steam, Fried, and Kurkure Momos in Malad East. 100% Pure Veg and Jain specialist.',
    url: 'https://meowmomo.netlify.app',
    siteName: 'Meow Momo',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meow Momo | Pure Veg & Jain Specialist',
    description: 'Delicious and hygienic momos in Malad East, Mumbai. Order now on WhatsApp!',
  },
  alternates: {
    canonical: 'https://meowmomo.netlify.app',
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
