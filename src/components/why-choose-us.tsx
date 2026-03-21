"use client";

import { CheckCircle2, Leaf, ShieldCheck, Brain, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WhyChooseUs() {
  const highlights = [
    {
      icon: Leaf,
      title: "100% Pure Veg & Jain Specialist",
      description: "We maintain a strictly vegetarian kitchen. Our specialized Jain menu is prepared with extreme care, ensuring no onion, garlic, or root vegetables are used in these variants. We are the go-to destination for authentic Jain momos in Malad East."
    },
    {
      icon: Brain,
      title: "Data-Driven Freshness",
      description: "Founded by Data Scientists, we use analytical models to predict demand. This means our ingredients are sourced exactly when needed, ensuring the momos on your plate were prepared just hours ago, not days."
    },
    {
      icon: ShieldCheck,
      title: "Unmatched Street Food Hygiene",
      description: "We are redefining street food quality in Mumbai. Our preparation area follows strict sanitization protocols, and our tech-tracked inventory ensures every batch meets the highest safety standards."
    },
    {
      icon: Star,
      title: "Signature Spicy Chutney",
      description: "Our momos are served with a signature spicy chutney made from premium dried chilies and secret spices. It's the perfect companion to our Steam, Fried, and Kurkure variants."
    },
    {
      icon: Clock,
      title: "Perfect Evening Snack",
      description: "Located conveniently in Kurar Village, we are open from 4:00 PM to 10:30 PM. Whether it's a quick bite after work or a family treat, Meow Momo is the neighborhood's favorite evening spot."
    },
    {
      icon: CheckCircle2,
      title: "Community Approved",
      description: "With a 4.9+ rating from the Malad East community, our growth is driven by the love and trust of our regulars. We take pride in being a local business that serves with integrity."
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Meow Momo Difference</h2>
          <h3 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">Why Foodies Love Us</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We combine traditional taste with modern technology to serve the most hygienic and delicious momos in Mumbai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, idx) => (
            <Card key={idx} className="rounded-[2.5rem] border-none shadow-sm bg-muted/20 hover:bg-white hover:shadow-xl transition-all duration-500 group">
              <CardContent className="p-10 space-y-6">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-black tracking-tight uppercase text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
