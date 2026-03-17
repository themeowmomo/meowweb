
"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2, Copy, ExternalLink, Sparkles, Check, MessageSquare } from "lucide-react";
import { generateReview } from "@/ai/flows/generate-review-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const reviewUrl = "https://g.page/r/CUiIdrmfjbsKEBM/review";

  const handleSelectRating = async (selectedRating: number) => {
    setRating(selectedRating);
    setLoading(true);
    setGeneratedReview("");
    setCopied(false);
    
    try {
      const result = await generateReview({ rating: selectedRating });
      setGeneratedReview(result.reviewText);
    } catch (error) {
      console.error("Failed to generate review", error);
      toast({
        title: "Error",
        description: "Could not generate review text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAndGo = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedReview);
      setCopied(true);
      toast({
        title: "Review Copied!",
        description: "Opening Google Reviews... Just paste the text there!",
      });
      
      setTimeout(() => {
        window.open(reviewUrl, "_blank");
      }, 1500);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-accent/20">
            <Sparkles className="w-3 h-3" /> Community Feedback
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-4">Loved by Malad East</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
            See what our customers are saying and use our <span className="text-primary font-bold">AI Review Assistant</span> to share your own experience in seconds.
          </p>
        </div>

        <div className="flex flex-col gap-12 max-w-4xl mx-auto">
          {/* Top: Google Reviews Widget */}
          <div className="space-y-6 w-full">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black tracking-tight">Verified Reviews</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live from Google Maps</p>
              </div>
            </div>
            
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-muted/50 min-h-[450px]">
              <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
              <div 
                className="elfsight-app-d527aaa3-322e-4e48-a283-f2618425bf9c" 
                data-elfsight-app-lazy 
              />
            </div>
          </div>

          {/* Bottom: AI Review Assistant */}
          <div className="w-full">
            <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-primary/10">
              <div className="bg-primary/5 p-12 text-foreground relative overflow-hidden border-b border-primary/10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Powered by GenAI
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-foreground">AI Review Assistant</h3>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Generate professional feedback in seconds</p>
                </div>
              </div>
              
              <CardContent className="p-12 space-y-10">
                <div className="text-center space-y-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">How was your Meow Momo experience?</p>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isSelected = rating >= star;
                      const isHovered = hoveredRating >= star;
                      
                      return (
                        <button
                          key={star}
                          disabled={loading}
                          onMouseEnter={() => !loading && setHoveredRating(star)}
                          onMouseLeave={() => !loading && setHoveredRating(0)}
                          onClick={() => handleSelectRating(star)}
                          className={cn(
                            "transition-all transform hover:scale-110 active:scale-95 outline-none",
                            loading && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Star
                            className={cn(
                              "w-12 h-12 transition-all duration-300",
                              isSelected
                                ? "fill-accent text-accent drop-shadow-[0_0_12px_rgba(255,191,0,0.5)]"
                                : isHovered
                                  ? "text-accent/60 fill-none"
                                  : "text-muted-foreground/20 fill-none"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-dashed border-muted">
                  {loading && (
                    <div className="flex flex-col items-center gap-6 animate-in fade-in py-8">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="font-black text-primary uppercase tracking-widest text-xs">AI is writing your review...</p>
                    </div>
                  )}

                  {generatedReview && !loading && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                      <div className="p-8 bg-muted/30 rounded-[2rem] border-2 border-dashed border-primary/20 shadow-inner">
                        <p className="text-lg italic text-foreground/80 leading-relaxed font-medium text-center">
                          "{generatedReview}"
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Button
                          onClick={handleCopyAndGo}
                          size="lg"
                          className={cn(
                            "w-full h-16 text-lg font-black rounded-2xl transition-all shadow-xl",
                            copied ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
                          )}
                        >
                          {copied ? (
                            <><Check className="mr-2 h-6 w-6" /> Copied! Opening Google Reviews...</>
                          ) : (
                            <><Copy className="mr-2 h-5 w-5" /> Copy & Post on Google</>
                          )}
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest">
                          Paste the text on the Google Review page that opens!
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!generatedReview && !loading && rating === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground/30 font-black uppercase text-[10px] tracking-widest py-12">
                      <Sparkles className="w-6 h-6 mb-2 opacity-20" />
                      <span>Select stars above to start generating</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
