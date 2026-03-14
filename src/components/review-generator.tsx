"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2, Copy, ExternalLink, Sparkles, Check } from "lucide-react";
import { generateReview } from "@/ai/flows/generate-review-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ReviewGenerator() {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const reviewUrl = "https://g.page/r/CUiIdrmfjbsKEBM/review";

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const result = await generateReview({ rating });
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
    navigator.clipboard.writeText(generatedReview);
    setCopied(true);
    toast({
      title: "Review Copied!",
      description: "Opening Google Reviews... Just paste the text there!",
    });
    
    setTimeout(() => {
      window.open(reviewUrl, "_blank");
    }, 1500);
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black font-headline tracking-tight">Enjoyed your Momos?</h2>
            <p className="text-muted-foreground text-lg">
              Help us grow by leaving a review. Our AI can help you write the perfect one!
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-primary">Select your rating</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={cn(
                          "w-10 h-10 md:w-14 md:h-14 transition-colors",
                          (hoveredRating || rating) >= star
                            ? "fill-accent text-accent"
                            : "text-muted border-none"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl rounded-2xl"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Writing...</>
                  ) : (
                    <><Sparkles className="mr-2 h-6 w-6" /> Generate Review Text</>
                  )}
                </Button>

                {generatedReview && (
                  <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-6 bg-muted/30 rounded-2xl border-2 border-dashed border-primary/20 relative">
                      <p className="text-lg italic text-foreground/80 leading-relaxed">
                        "{generatedReview}"
                      </p>
                    </div>

                    <Button
                      onClick={handleCopyAndGo}
                      className={cn(
                        "w-full h-16 text-xl font-black rounded-2xl transition-all",
                        copied ? "bg-green-600 hover:bg-green-700" : "bg-foreground hover:bg-foreground/90"
                      )}
                    >
                      {copied ? (
                        <><Check className="mr-2 h-6 w-6" /> Copied! Opening Google...</>
                      ) : (
                        <><Copy className="mr-2 h-6 w-6" /> Copy & Open Google Reviews</>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground font-medium">
                      Note: You will need to manually paste the text into the Google Review box.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
