"use client";

import { UtensilsCrossed, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const mapUrl = "https://maps.app.goo.gl/f2t4bVi6X3GNizrc8";
  
  return (
    <footer id="footer" className="bg-foreground text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <p className="font-headline font-bold text-2xl tracking-tight">Meow Momo</p>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Serving the freshest Pure Veg and Jain Momos in Malad East. Affordable prices, hygienic preparation, and great taste since day one.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Jain Mandir Rd, Tanji Nagar, Kurar Village, Malad East, Mumbai, 400097</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+91 88508 59140 / 98679 77942</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>4:00 PM – 10:30 PM (Daily)</span>
              </div>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Menu Categories</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#menu" className="hover:text-primary transition-colors">Classic Steam & Fried</Link></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">Cheese & Paneer Momos</Link></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">Peri Peri Spicy Momos</Link></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">Kurkure Crunch Momos</Link></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">Jain Specialized Momos</Link></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">Salted & Masala Fries</Link></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href={mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">Get Directions <ExternalLink className="w-3 h-3" /></a></li>
              <li><Link href="#menu" className="hover:text-primary transition-colors">View Digital Menu</Link></li>
              <li><Link href="#ai-tool" className="hover:text-primary transition-colors">Momo Recommendation Tool</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Meal Combos</Link></li>
            </ul>
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Payment Methods</p>
              <p className="text-sm">UPI, Cash on Delivery</p>
            </div>
          </div>

          {/* Map Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">Find Us</h3>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg grayscale-[20%] hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2254.920425690767!2d72.86143584026658!3d19.18859827663609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b732d1a79a63%3A0xabb8d9fb9768848!2sMeow%20Momo!5e0!3m2!1sen!2sin!4v1773482484300!5m2!1sen!2sin" 
                width="100%" 
                height="200" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Meow Momo Google Maps Location"
              />
            </div>
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              Open in Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground text-center md:text-left">
          <p>© {new Date().getFullYear()} Meow Momo Malad. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="text-accent font-bold">Pure Veg Only</span>
            <span className="text-accent font-bold">Jain Options Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
