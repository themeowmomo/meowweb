
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechFlow Inc.",
    quote: "Switching to Aether Cloud was the best infrastructure decision we made this year. Their global edge network cut our latencies by 40% overnight.",
    avatar: PlaceHolderImages.find(img => img.id === "testimonial-user-1")!
  },
  {
    name: "James Wilson",
    role: "VP of Engineering, DataScale",
    quote: "The reliability of Aether Compute is unmatched. We haven't had a single second of unplanned downtime in over 12 months.",
    avatar: PlaceHolderImages.find(img => img.id === "testimonial-user-1")!
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Infrastructure, GlobalRetail",
    quote: "The AI recommendation tool actually saved us thousands. It pinpointed exactly where we were over-provisioned and helped us optimize costs.",
    avatar: PlaceHolderImages.find(img => img.id === "testimonial-user-1")!
  }
];

const logos = [
  PlaceHolderImages.find(img => img.id === "logo-tech-1")!,
  PlaceHolderImages.find(img => img.id === "logo-tech-2")!,
  PlaceHolderImages.find(img => img.id === "logo-tech-3")!,
  PlaceHolderImages.find(img => img.id === "logo-tech-1")!,
  PlaceHolderImages.find(img => img.id === "logo-tech-2")!
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4">Trusted by the World's Best</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From startups to Fortune 500s, enterprises rely on Aether Cloud for their mission-critical operations.
          </p>
        </div>

        {/* Logo cloud */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all mb-20">
          {logos.map((logo, idx) => (
            <div key={idx} className="relative w-32 h-16">
              <Image 
                src={logo.imageUrl} 
                alt={logo.description} 
                fill 
                className="object-contain"
                data-ai-hint={logo.imageHint}
              />
            </div>
          ))}
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
