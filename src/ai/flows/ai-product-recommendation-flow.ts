'use server';
/**
 * @fileOverview An AI agent that recommends suitable momos from Meow Momo
 * based on user preferences and dietary requirements.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductRecommendationInputSchema = z.object({
  businessNeeds: z
    .string()
    .describe(
      "User's taste preferences, hunger level, spice tolerance, and dietary requirements (e.g., 'I want something spicy and Jain', 'I love cheese and want a heavy snack')."
    ),
});
export type AiProductRecommendationInput = z.infer<
  typeof AiProductRecommendationInputSchema
>;

const AiProductRecommendationOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        serviceName: z
          .string()
          .describe('The name of the recommended momo or dish.'),
        explanation: z
          .string()
          .describe('Why this particular dish fits their description.'),
        benefits: z
          .array(z.string())
          .describe('Key features like "Jain available", "Super spicy", "Value for money", "Best for hunger".'),
      })
    )
    .describe('A list of recommended momos from Meow Momo.'),
});
export type AiProductRecommendationOutput = z.infer<
  typeof AiProductRecommendationOutputSchema
>;

export async function aiProductRecommendation(
  input: AiProductRecommendationInput
): Promise<AiProductRecommendationOutput> {
  return aiProductRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProductRecommendationPrompt',
  input: {schema: AiProductRecommendationInputSchema},
  output: {schema: AiProductRecommendationOutputSchema},
  prompt: `You are the friendly "Momo Expert" at Meow Momo in Malad East, Mumbai. Your job is to suggest the perfect momos or meal combos.

Meow Momo's Menu & Pricing (Summary):
- **Classic (Veg)**: Steam (₹50/100), Fried (₹60/120), Cheese (₹65/140), Peri Peri (₹70/140). Prices for 5-PCS | 11-PCS.
- **Paneer Specialty**: Paneer Steam (₹60/120), Paneer Cheese (₹80/160), Paneer Peri Peri (₹90/180).
- **Kurkure Crunch**: Crunchy fried momos. Kurkure Veg (₹70/140), Kurkure Paneer (₹90/180).
- **Jain Specialized**: No onion/garlic/root veg. Jain Steam (₹80/150), Jain Fried (₹90/170), Jain Peri Peri (₹90/180).
- **Fries**: Salted (₹35/70), Cheese (₹50/99), Peri Peri (₹45/90), Masala (₹40/80).
- **Meal Combos**:
    - Classic Steam Meal (₹90): 5pcs Classic Steam + Half Masala Fries + Drink.
    - Classic Fried Meal (₹99): 5pcs Classic Fried + Half Masala Fries + Drink.
    - Paneer Steam Meal (₹110): 5pcs Paneer Steam + Half Masala Fries + Drink.
    - Cheese Meal (₹130): 5pcs Cheese Fried + Half Cheese Fries + Drink.
- **Loyalty Program**: Buy 10 plates, get 1 plate free!

Based on: "{{{businessNeeds}}}", suggest 2-3 specific items. 
- If they are very hungry, suggest a "Meal Combo".
- If they want spice, suggest "Peri Peri" or "Masala Fries".
- If they want something crunchy, suggest "Kurkure Momos".
- ALWAYS prioritize Jain items if they mention Jain or dietary restrictions.

Customer's Request: {{{businessNeeds}}}`,
});

const aiProductRecommendationFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationFlow',
    inputSchema: AiProductRecommendationInputSchema,
    outputSchema: AiProductRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
