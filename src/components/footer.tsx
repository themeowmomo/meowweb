"use client";

import { Phone, MapPin, Clock, Instagram, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const mapUrl = "https://maps.app.goo.gl/f2t4bVi6X3GNizrc8";
  const BRAND_LOGO_URL = 'https://res.cloudinary.com/di4onfrel/image/upload/v1774167784/Untitled_design_2_xsocq3.svg?v=2';
  const INSTAGRAM_URL = "https://www.instagram.com/meowmomo43/";
  
  return (
    <footer id="footer" className="bg-foreground text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-1 group-hover:bg-accent transition-all duration-300">
                <Image 
                  src={BRAND_LOGO_URL} 
                  alt="Meow Momo Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <p className="font-headline font-black text-2xl tracking-tight group-hover:text-primary transition-colors">Meow Momo</p>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Serving the freshest Pure Veg and Jain Momos in Malad East. Tech-powered street food experience founded by Amit Jaiswal & Karan Sawant.
            </p>
            <div className="flex gap-4 pt-2">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-primary transition-all duration-300">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="tel:+918850859140" className="bg-white/10 p-3 rounded-full hover:bg-primary transition-all duration-300">
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white uppercase tracking-tighter">Menu</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/menu" className="hover:text-primary transition-colors">Classic Steam & Fried</Link></li>
              <li><Link href="/menu" className="hover:text-primary transition-colors">Cheese & Paneer Momos</Link></li>
              <li><Link href="/menu" className="hover:text-primary transition-colors">Peri Peri Spicy Momos</Link></li>
              <li><Link href="/menu" className="hover:text-primary transition-colors">Kurkure Crunch Momos</Link></li>
              <li><Link href="/menu" className="hover:text-primary transition-colors">Jain Specialized Momos</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white uppercase tracking-tighter">Locate Us</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3 text-sm text-muted-foreground group">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="group-hover:text-white transition-colors">Jain Mandir Rd, Tanji Nagar, Kurar Village, Malad East, Mumbai, 400097</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="group-hover:text-white transition-colors">+91 88508 59140</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="group-hover:text-white transition-colors">4:00 PM – 10:30 PM (Daily)</span>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white uppercase tracking-tighter">Find Us</h3>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg grayscale-[20%] hover:grayscale-0 transition-all duration-500 h-[180px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2254.920425690767!2d72.86143584026658!3d19.18859827663609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b732d1a79a63%3A0xabb8d9fb9768848!2sMeow%20Momo!5e0!3m2!1sen!2sin!4v1773482484300!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Meow Momo Google Maps Location"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground text-center md:text-left">
          <p>© {new Date().getFullYear()} Meow Momo Malad. Powered by Data Science.</p>
          <div className="flex gap-8">
            <span className="text-accent font-black uppercase tracking-widest">Pure Veg Only</span>
            <span className="text-accent font-black uppercase tracking-widest">Jain Specialist</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
