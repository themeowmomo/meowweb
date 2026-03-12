"use client";

import { UtensilsCrossed, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const shopNumber = "918850859140";
  
  return (
    <footer id="footer" className="bg-foreground text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <span className="font-headline font-bold text-2xl tracking-tight">Meow Momo</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Serving the freshest Pure Veg and Jain Momos in Malad East. Affordable prices, hygienic preparation, and great taste.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Jain Mandir Rd, Tanji Nagar, Kurar Village, Malad East, Mumbai, 400097</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+91 8850859140 / 9867977942</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>4:00 PM – 10:30 PM (Daily)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Menu Categories</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Classic Steam & Fried</li>
              <li>Cheese & Paneer Momos</li>
              <li>Peri Peri Spicy Momos</li>
              <li>Kurkure Crunch Momos</li>
              <li>Jain Specialized Momos</li>
              <li>Salted & Masala Fries</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Actions</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href={`https://wa.me/${shopNumber}`} className="hover:text-primary transition-colors">Order via WhatsApp</a></li>
              <li><a href="https://maps.app.goo.gl/8JYg6egUJ4N3vFj19" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Get Directions</a></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">View Menu</Link></li>
              <li><Link href="#ai-tool" className="hover:text-primary transition-colors">Momo Recommendation Tool</Link></li>
            </ul>
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Payment Methods</p>
              <p className="text-sm">UPI, Cash on Delivery</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground text-center md:text-left">
          <p>© {new Date().getFullYear()} Meow Momo Malad. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Pure Veg Only</Link>
            <Link href="#" className="hover:text-primary transition-colors">Jain Options Available</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}