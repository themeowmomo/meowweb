"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rohan Jadhav",
    role: "Local Guide",
    quote: "Good momos, good service 👍. The chutney is just the right level of spicy!",
    avatar: PlaceHolderImages.find(img => img.id === "user-1")!
  },
  {
    name: "Akash Gupta",
    role: "Frequent Customer",
    quote: "Best place for pure vegetarian momos in Malad. Their cheese steam momos are out of this world.",
    avatar: PlaceHolderImages.find(img => img.id === "user-2")!
  },
  {
    name: "Sandeep Sahu",
    role: "Food Blogger",
    quote: "Best momos for vegetarian people. Hygienic, fresh, and very affordable pricing for the quality they provide.",
    avatar: PlaceHolderImages.find(img => img.id === "user-1")!
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4">Loved by Momo Lovers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meow Momo is highly rated with a 4.9/5 on Google Maps. Here is what our community says.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-shadow relative">
              <Quote className="absolute top-6 right-8 w-10 h-10 text-secondary" />
              <p className="text-lg italic mb-8 relative z-10 text-foreground/80">"{t.quote}"</p>
              <div className="flex items-center gap-4 border-t pt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10">
                  <Image src={t.avatar.imageUrl} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}