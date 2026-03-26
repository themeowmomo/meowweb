"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Loader2, Copy, ExternalLink, Sparkles, Check, MessageSquare } from "lucide-react";
import { generateReview } from "@/ai/flows/generate-review-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { placeholderImages as PlaceHolderImages } from "@/app/lib/placeholder-images.json";

const STATIC_REVIEWS = [
  {
    name: "Rohan Sawant",
    role: "Local Guide",
    content: "The best momos in Malad East! Their Cheese Fried Momos are addictive. Highly recommend the Jain options too.",
    rating: 5,
    avatar: "user-1"
  },
  {
    name: "Akash Gupta",
    role: "Food Blogger",
    content: "Clean, hygienic, and extremely tasty. The Kurkure Momos have a perfect crunch. A hidden gem in Kurar Village.",
    rating: 5,
    avatar: "user-2"
  },
  {
    name: "Sneha Mehta",
    role: "Verified Customer",
    content: "Finally found a place that serves authentic Jain Momos. The staff is friendly and the service is quick!",
    rating: 5,
    avatar: "testimonial-user-1"
  }
];

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
    <section id="testimonials" className="py-16 bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-accent/20">
            <Sparkles className="w-3 h-3" /> Community Favorites
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter mb-4">Customer Appreciation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
            Join hundreds of happy customers in Malad East. Use our <span className="text-primary font-bold">AI Assistant</span> to write your own review!
          </p>
        </div>

        <div className="flex flex-col gap-12 max-w-5xl mx-auto">
          {/* Top: Static Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATIC_REVIEWS.map((review, idx) => (
              <Card key={idx} className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic text-sm leading-relaxed">
                    "{review.content}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-dashed">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={PlaceHolderImages.find(img => img.id === review.avatar)?.imageUrl} alt={review.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-foreground">{review.name}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{review.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom: AI Review Assistant */}
          <div className="w-full max-w-3xl mx-auto">
            <Card className="border-none shadow-xl bg-white rounded-[3rem] overflow-hidden border border-primary/10">
              <CardContent className="p-8 md:p-12 space-y-8 text-center">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Select a star rating to generate a professional review</p>
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
                      <p className="font-black text-primary uppercase tracking-widest text-[10px]">AI is crafting your feedback...</p>
                    </div>
                  )}

                  {generatedReview && !loading && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                      <div className="p-6 bg-muted/30 rounded-[2rem] border-2 border-dashed border-primary/20 shadow-inner">
                        <p className="text-lg italic text-foreground/80 leading-relaxed font-medium">
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
                            <><Check className="mr-2 h-6 w-6" /> Copied. Opening Google...</>
                          ) : (
                            <><Copy className="mr-2 h-5 w-5" /> Copy & Post to Google Maps</>
                          )}
                        </Button>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          Just paste the text on the Google page that opens!
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!generatedReview && !loading && rating === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground/30 font-black uppercase text-[10px] tracking-widest py-8">
                      <MessageSquare className="w-6 h-6 mb-1 opacity-20" />
                      <span>Click the stars above to try it</span>
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
