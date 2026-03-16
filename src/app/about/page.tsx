
'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShieldCheck, Leaf, Brain, Code, BarChart3, Users } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;
  const amitImg = PlaceHolderImages.find(img => img.id === "founder-amit")!;
  const karanImg = PlaceHolderImages.find(img => img.id === "founder-karan")!;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-6 py-2 font-black tracking-widest text-xs rounded-full">
            OUR STORY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-6">
            Where Data Meets <span className="text-primary">Delicious</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Founded by two Data Scientists in 2025, Meow Momo is a tech-driven startup redefining street food hygiene and efficiency in Malad East.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={heroImage.imageUrl} 
                alt="Meow Momo Vision" 
                fill 
                className="object-cover"
                data-ai-hint="cooking momos"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-4xl font-black italic">Hygienic. Fresh. Optimized.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">The Tech-Momo Revolution</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Meow Momo started when <span className="text-foreground font-bold">Amit Jaiswal</span> and <span className="text-foreground font-bold">Karan Sawant</span>, two B.Sc. Data Science graduates from the University of Mumbai, decided to apply their analytical skills to the food industry.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  They realized that the biggest challenge in street food wasn't just taste—it was consistency, supply chain efficiency, and hygiene. By building custom internal software to track inventory, ingredient usage, and customer demand patterns, they've ensured that every momo served is perfectly fresh.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-2xl space-y-3">
                  <Brain className="w-8 h-8 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-tight">Data-Driven Menu</h3>
                  <p className="text-sm text-muted-foreground">Pricing and variants optimized through customer demand analysis.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-2xl space-y-3">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-tight">Lean Operations</h3>
                  <p className="text-sm text-muted-foreground">Real-time inventory tracking to reduce waste and ensure freshness.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Meet the Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Amit */}
            <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden bg-white group">
              <div className="relative aspect-square">
                <Image src={amitImg.imageUrl} alt="Amit Jaiswal" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-black">Amit Jaiswal</h3>
                  <p className="font-bold opacity-80 flex items-center gap-2"><Code className="w-4 h-4" /> Founder & Technology Lead</p>
                </div>
              </div>
              <CardContent className="p-10 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  A B.Sc. Data Scientist and Software Developer with expertise in AI and automation. Amit engineered Meow Momo's digital infrastructure, from the order management systems to the analytical dashboards that drive our operational efficiency.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-bold">Next.js</Badge>
                  <Badge variant="outline" className="font-bold">Python</Badge>
                  <Badge variant="outline" className="font-bold">AI/ML</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Karan */}
            <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden bg-white group">
              <div className="relative aspect-square">
                <Image src={karanImg.imageUrl} alt="Karan Sawant" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-black">Karan Sawant</h3>
                  <p className="font-bold opacity-80 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Founder & Data Analyst</p>
                </div>
              </div>
              <CardContent className="p-10 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  With 3+ years of experience in data analytics and trade intelligence, Karan manages our supply chain and vendor sourcing. His focus on HSN codes and international compliance ensures we source only the best raw materials for our specialized Jain menu.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-bold">SQL</Badge>
                  <Badge variant="outline" className="font-bold">Supply Chain</Badge>
                  <Badge variant="outline" className="font-bold">Power BI</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Leaf className="w-12 h-12 text-primary mx-auto" />
              <h4 className="font-black uppercase tracking-tight">100% Pure Veg</h4>
              <p className="text-sm text-muted-foreground">Strictly vegetarian kitchen with specialized Jain options.</p>
            </div>
            <div className="space-y-4">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
              <h4 className="font-black uppercase tracking-tight">Hygienic Prep</h4>
              <p className="text-sm text-muted-foreground">Tech-tracked ingredient rotation for maximum freshness.</p>
            </div>
            <div className="space-y-4">
              <Users className="w-12 h-12 text-primary mx-auto" />
              <h4 className="font-black uppercase tracking-tight">Community First</h4>
              <p className="text-sm text-muted-foreground">Serving the best of Malad East with integrity and pride.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
