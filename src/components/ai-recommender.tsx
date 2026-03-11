
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { aiProductRecommendation, type AiProductRecommendationOutput } from "@/ai/flows/ai-product-recommendation-flow";
import { Sparkles, Loader2, CheckCircle2, Server, Database, Shield } from "lucide-react";

export function AiRecommender() {
  const [businessNeeds, setBusinessNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiProductRecommendationOutput | null>(null);

  const handleRecommend = async () => {
    if (!businessNeeds.trim()) return;
    setLoading(true);
    try {
      const result = await aiProductRecommendation({ businessNeeds });
      setRecommendations(result);
    } catch (error) {
      console.error("Failed to get recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-tool" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/10 shadow-2xl overflow-hidden">
            <div className="bg-primary px-8 py-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-accent-foreground font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> AI Powered Tool
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold font-headline">Find Your Perfect Solution</h2>
                <p className="text-primary-foreground/80 max-w-xl">
                  Tell us about your business requirements, and our AI solutions architect will recommend the ideal Aether Cloud stack for you.
                </p>
              </div>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Describe your business needs</label>
                <Textarea 
                  placeholder="e.g., We are a mid-sized e-commerce business looking to scale our mobile app globally with high security and real-time inventory management..." 
                  className="min-h-[150px] text-lg p-6 bg-muted/30 focus-visible:ring-primary border-none"
                  value={businessNeeds}
                  onChange={(e) => setBusinessNeeds(e.target.value)}
                />
                <Button 
                  onClick={handleRecommend} 
                  disabled={loading || !businessNeeds.trim()} 
                  className="w-full h-14 text-lg bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Requirements...
                    </>
                  ) : (
                    "Generate Recommendations"
                  )}
                </Button>
              </div>

              {recommendations && (
                <div className="pt-8 border-t animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-accent w-6 h-6" /> 
                    Tailored for Your Business
                  </h3>
                  <div className="grid gap-6">
                    {recommendations.recommendations.map((rec, idx) => (
                      <div key={idx} className="group p-6 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all">
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          <div className="bg-white p-3 rounded-lg shadow-sm self-start group-hover:scale-110 transition-transform">
                            {rec.serviceName.toLowerCase().includes('compute') && <Server className="w-6 h-6 text-primary" />}
                            {rec.serviceName.toLowerCase().includes('database') || rec.serviceName.toLowerCase().includes('sql') && <Database className="w-6 h-6 text-primary" />}
                            {rec.serviceName.toLowerCase().includes('security') && <Shield className="w-6 h-6 text-primary" />}
                            {!rec.serviceName.toLowerCase().includes('compute') && !rec.serviceName.toLowerCase().includes('database') && !rec.serviceName.toLowerCase().includes('sql') && !rec.serviceName.toLowerCase().includes('security') && <Sparkles className="w-6 h-6 text-primary" />}
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xl font-bold text-primary">{rec.serviceName}</h4>
                            <p className="text-muted-foreground leading-relaxed">{rec.explanation}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {rec.benefits.map((benefit, bIdx) => (
                                <span key={bIdx} className="inline-flex items-center gap-1 text-xs font-semibold bg-white px-3 py-1.5 rounded-full border shadow-sm">
                                  <CheckCircle2 className="w-3 h-3 text-accent" /> {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
