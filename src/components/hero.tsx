
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            Next-Gen Infrastructure for Enterprise
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold font-headline tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
            Powering the Future of <span className="text-primary italic">Enterprise Computing</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Aether Cloud provides hyper-scalable infrastructure, multi-layered security, and global edge presence to accelerate your digital transformation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              Request a Consultation <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 text-base border-primary/20 hover:bg-secondary">
              Explore Products
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            {[
              { icon: ShieldCheck, title: "Zero Trust Security", desc: "Enterprise-grade protection for all workloads." },
              { icon: Zap, title: "Ultra-Low Latency", desc: "Global edge network ensuring millisecond response times." },
              { icon: Globe, title: "Global Compliance", desc: "Fully compliant with SOC2, GDPR, and HIPAA standards." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-white/50 backdrop-blur-sm border hover:border-primary/50 hover:shadow-xl transition-all group">
                <feature.icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-20 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--secondary)_0%,_transparent_70%)] opacity-30"></div>
    </section>
  );
}
