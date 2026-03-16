"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2, Copy, ExternalLink, Sparkles, Check } from "lucide-react";
import { generateReview } from "@/ai/flows/generate-review-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ReviewGenerator() {
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
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-foreground">Share Your Love on Google!</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              How was your Meow Momo experience? Select a star rating and our AI will help you write a professional Google review in seconds.
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-10">
              <div className="space-y-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Select a Rating to Start</p>
                <div className="flex justify-center gap-2 md:gap-4">
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
                            "w-12 h-12 md:w-16 md:h-16 transition-all duration-300",
                            isSelected
                              ? "fill-accent text-accent drop-shadow-[0_0_8px_rgba(255,191,0,0.4)]"
                              : isHovered
                                ? "text-accent fill-none"
                                : "text-muted-foreground/20 fill-none"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-dashed">
                {loading && (
                  <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-black text-primary uppercase tracking-widest text-xs">AI is writing your review...</p>
                  </div>
                )}

                {generatedReview && !loading && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-8 bg-muted/20 rounded-[1.5rem] border-2 border-dashed border-primary/10 relative group">
                      <p className="text-xl italic text-foreground/80 leading-relaxed font-medium">
                        "{generatedReview}"
                      </p>
                    </div>

                    <Button
                      onClick={handleCopyAndGo}
                      size="lg"
                      className={cn(
                        "w-full h-16 text-xl font-black rounded-2xl transition-all shadow-xl shadow-black/10",
                        copied ? "bg-green-600 hover:bg-green-700" : "bg-foreground hover:bg-foreground/90"
                      )}
                    >
                      {copied ? (
                        <><Check className="mr-2 h-6 w-6" /> Copied! Opening Google Reviews...</>
                      ) : (
                        <><Copy className="mr-2 h-6 w-6" /> Copy & Open Google Review Link</>
                      )}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium bg-white/50 py-2 rounded-full">
                      <ExternalLink className="w-4 h-4" /> 
                      Paste the text on the page that opens!
                    </div>
                  </div>
                )}
                
                {!generatedReview && !loading && rating === 0 && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground/40 font-black uppercase text-[10px] tracking-widest">
                    <Sparkles className="w-4 h-4" /> Click stars to generate
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">
            Pure Veg . Jain Specialist . Malad East
          </p>
        </div>
      </div>
    </section>
  );
}
