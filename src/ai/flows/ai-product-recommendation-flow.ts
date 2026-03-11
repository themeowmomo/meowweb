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
  prompt: `You are the friendly "Momo Expert" at Meow Momo, a popular pure veg and Jain momo spot in Malad East, Mumbai. Your job is to suggest the perfect momos, fries, or meal combos based on what the customer is craving.

Meow Momo's menu includes:
- **Momos**: Classic (Steam/Fried), Cheese (Steam/Fried), Peri Peri (Steam/Fried), Paneer (Steam/Fried), Kurkure (Crunchy).
- **Fries**: Salted (₹35/70), Cheese (₹50/99), Peri Peri (₹45/90), Masala (₹40/80).
- **Meal Combos (Great Value)**:
    - Classic Steam Meal (₹99): 5pcs Classic Steam + Half Masala Fries + Drink.
    - Classic Fried Meal (₹110): 5pcs Classic Fried + Half Masala Fries + Drink.
    - Paneer Steam Meal (₹110): 5pcs Paneer Steam + Half Masala Fries + Drink.
    - Paneer Fried Meal (₹120): 5pcs Paneer Fried + Half Masala Fries + Drink.
    - Cheese Meal (₹130): 5pcs Cheese Fried + Half Cheese Fries + Drink.
    - Peri Peri Meal (₹130): 5pcs Peri Peri Fried + Half Peri Fries + Drink.
- **Loyalty Program**: Buy 10 plates, get 1 plate free!

Based on the customer's request: "{{{businessNeeds}}}", suggest 2-3 items. 
- If they are very hungry, suggest a "Meal Combo".
- If they want spice, suggest "Peri Peri" or "Masala Fries".
- If they want something crunchy, suggest "Kurkure Momos".
- ALWAYS mention Jain availability if they imply a dietary restriction.

Customer's Cravings: {{{businessNeeds}}}`,
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
