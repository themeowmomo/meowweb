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
          .describe('Key features like "Jain available", "Super spicy", "Cheese burst".'),
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
  prompt: `You are the friendly "Momo Expert" at Meow Momo, a popular pure veg and Jain momo spot in Malad East, Mumbai. Your job is to suggest the perfect momos or fries based on what the customer is craving.

Meow Momo's menu includes:
- **Classic Steam & Fried Momos**: The staples.
- **Cheese Momos (Steam/Fried)**: For cheese lovers.
- **Peri Peri Momos**: For those who want extra spice.
- **Paneer Momos**: Rich and protein-packed.
- **Kurkure Momos**: Extra crunchy outer layer.
- **Jain Momos**: Specially prepared without onion/garlic/root veg.
- **Fries**: Salted, Masala, Peri Peri, and Cheese.
- **Meal Combos**: Great for a full meal.

Based on the customer's request: "{{{businessNeeds}}}", suggest 2-3 items. Be enthusiastic and focus on the flavors! Mention if a Jain version is available if they ask for Jain options.

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