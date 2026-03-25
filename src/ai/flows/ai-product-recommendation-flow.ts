
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

Meow Momo's Simplified Menu (All plates are 5 PCS):
- Classic Veg Steam (₹50)
- Classic Veg Fried (₹60)
- Cheese Veg Steam (₹70)
- Cheese Veg Fried (₹80)
- Paneer Steam (₹60)
- Paneer Fried (₹70)
- Kurkure Veg Fried (₹70)
- Kurkure Paneer Fried (₹99)
- Jain Veg Steam (₹80) - No onion/garlic
- Jain Veg Fried (₹90) - No onion/garlic
- Fries: Salted (₹40), Cheese (₹60), Peri Peri (₹50), Masala (₹50)
- Meal Combos (Best Value):
    - Classic Steam Meal (₹110): 5pcs Steam + Half Masala Fries + Drink.
    - Classic Fried Meal (₹120): 5pcs Fried + Half Masala Fries + Drink.
    - Cheese Meal (₹140): 5pcs Cheese Fried + Half Cheese Fries + Drink.
    - Paneer Fried Meal (₹130): 5pcs Paneer Fried + Half Masala Fries + Drink.

Based on: "{{{businessNeeds}}}", suggest 2-3 specific items. 
- If they are very hungry, ALWAYS suggest a "Meal Combo".
- If they want spice, suggest "Peri Peri" or "Masala Fries".
- If they want something crunchy, suggest "Kurkure Momos".
- If they mention Jain, prioritize "Jain" items exclusively.

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
