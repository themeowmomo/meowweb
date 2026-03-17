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
    <section id="testimonials" className="py-8 bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 border border-accent/20">
            <Sparkles className="w-3 h-3" /> Excellence Recognized by the Community
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter mb-3">Customer Appreciation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
            Discover verified experiences from our community and utilize our <span className="text-primary font-bold">AI-Powered Feedback Assistant</span> to compose your own review with professional precision.
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Top: Google Reviews Widget */}
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-black tracking-tight">Verified Testimonials</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Integration via Google Maps</p>
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
            <Card className="border-none shadow-xl bg-white rounded-[3rem] overflow-hidden border border-primary/10">
              <CardContent className="p-8 md:p-12 space-y-8">
                <div className="text-center space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Provide a Rating to Initiate Assistance</p>
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
                              "w-10 h-10 transition-all duration-300",
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

                <div className="space-y-6 pt-8 border-t border-dashed border-muted">
                  {loading && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in py-6">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="font-black text-primary uppercase tracking-widest text-[10px]">Processing Professional Feedback...</p>
                    </div>
                  )}

                  {generatedReview && !loading && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                      <div className="p-6 bg-muted/30 rounded-[2rem] border-2 border-dashed border-primary/20 shadow-inner">
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
                            <><Check className="mr-2 h-6 w-6" /> Copied. Redirecting to Google...</>
                          ) : (
                            <><Copy className="mr-2 h-5 w-5" /> Copy Content & Post to Google</>
                          )}
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest">
                          Please paste the copied content into the review field on the following page.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!generatedReview && !loading && rating === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground/30 font-black uppercase text-[10px] tracking-widest py-8">
                      <Sparkles className="w-6 h-6 mb-1 opacity-20" />
                      <span>Select a star rating to begin generating content</span>
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