
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

Meow Momo's Detailed Menu & Pricing:
- **Classic Veg**: Steam (₹50/100), Fried (₹60/120), Cheese (₹70/140), Peri Peri (₹70/140).
- **Paneer Specialty**: Paneer Steam (₹60/120), Paneer Fried (₹70/140), Paneer Cheese (₹80/160), Paneer Peri Peri (₹90/180).
- **Kurkure Crunch (Ultra Crispy)**: Kurkure Veg (₹70/140), Kurkure Paneer (₹99/199), Kurkure Paneer Cheese (₹110/200).
- **Jain Specialized (No onion/garlic)**: Jain Steam (₹80/150), Jain Fried (₹90/170), Jain Cheese (₹90/180), Jain Peri Peri (₹99/190).
- **Fries**: Salted (₹40/70), Cheese (₹60/110), Peri Peri (₹50/90), Masala (₹50/90).
- **Meal Combos (Highly Recommended for Hunger)**:
    - Classic Steam Meal (₹110): 5pcs Steam + Half Masala Fries + Drink.
    - Classic Fried Meal (₹120): 5pcs Fried + Half Masala Fries + Drink.
    - Cheese Meal (₹140): 5pcs Cheese Fried + Half Cheese Fries + Drink.
    - Peri Peri Meal (₹140): 5pcs Peri Peri Fried + Half Peri Peri Fries + Drink.
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
