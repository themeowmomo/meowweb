import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://meowmomo.com'),
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
    'Hygienic Momos Mumbai'
  ],
  authors: [{ name: 'Amit Jaiswal' }, { name: 'Karan Sawant' }],
  creator: 'Meow Momo Team',
  publisher: 'Meow Momo',
  icons: {
    icon: 'https://res.cloudinary.com/di4onfrel/image/upload/v1774028552/momomeow_logo.pdf_pnbic1.png',
    apple: 'https://res.cloudinary.com/di4onfrel/image/upload/v1774028552/momomeow_logo.pdf_pnbic1.png',
  },
  openGraph: {
    title: 'Meow Momo | Best Pure Veg & Jain Momos in Mumbai',
    description: 'Serving the freshest Steam, Fried, and Kurkure Momos in Malad East. 100% Pure Veg and Jain specialist.',
    url: 'https://meowmomo.com',
    siteName: 'Meow Momo',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/di4onfrel/image/upload/v1774028552/momomeow_logo.pdf_pnbic1.png',
        width: 800,
        height: 600,
        alt: 'Meow Momo Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meow Momo | Pure Veg & Jain Specialist',
    description: 'Delicious and hygienic momos in Malad East, Mumbai. Order now on WhatsApp!',
    images: ['https://res.cloudinary.com/di4onfrel/image/upload/v1774028552/momomeow_logo.pdf_pnbic1.png'],
  },
  alternates: {
    canonical: 'https://meowmomo.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
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
