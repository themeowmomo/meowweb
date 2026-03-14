'use server';
/**
 * @fileOverview An AI agent that generates a natural-sounding customer review 
 * for Meow Momo based on a star rating.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReviewInputSchema = z.object({
  rating: z.number().min(1).max(5).describe('The star rating from 1 to 5.'),
});
export type GenerateReviewInput = z.infer<typeof GenerateReviewInputSchema>;

const GenerateReviewOutputSchema = z.object({
  reviewText: z.string().describe('A natural, human-sounding review text.'),
});
export type GenerateReviewOutput = z.infer<typeof GenerateReviewOutputSchema>;

export async function generateReview(input: GenerateReviewInput): Promise<GenerateReviewOutput> {
  return generateReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReviewPrompt',
  input: {schema: GenerateReviewInputSchema},
  output: {schema: GenerateReviewOutputSchema},
  prompt: `You are a happy customer of "Meow Momo" in Malad East, Mumbai. 
Generate a short, natural, and human-sounding review for Google Maps based on a star rating of {{{rating}}} out of 5.

Context about Meow Momo:
- Pure Veg and Jain specialty.
- Known for Steam, Fried, Cheese, Paneer, and Kurkure momos.
- Also serves spicy Peri Peri momos and Fries.
- Located in Kurar Village, Malad East.

Tone Guidelines:
- 5 Stars: Enthusiastic, highly recommended, mention specific items like "Cheese Fried" or "Jain Steam".
- 4 Stars: Very good, friendly service, maybe mention one small thing like "waiting time" but still positive.
- 1-3 Stars: Constructive feedback, polite but honest about what could be better.

Keep the review between 15-40 words. Use a friendly Mumbai local vibe.`,
});

const generateReviewFlow = ai.defineFlow(
  {
    name: 'generateReviewFlow',
    inputSchema: GenerateReviewInputSchema,
    outputSchema: GenerateReviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
