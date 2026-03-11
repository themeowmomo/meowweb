'use server';
/**
 * @fileOverview An AI agent that recommends suitable cloud services from Aether Cloud
 * based on provided business needs.
 *
 * - aiProductRecommendation - A function that handles the cloud service recommendation process.
 * - AiProductRecommendationInput - The input type for the aiProductRecommendation function.
 * - AiProductRecommendationOutput - The return type for the aiProductRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductRecommendationInputSchema = z.object({
  businessNeeds: z
    .string()
    .describe(
      'A detailed description of the enterprise business needs and requirements, including scale, data types, security concerns, and performance expectations.'
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
          .describe(
            'The name of the recommended Aether Cloud service (e.g., "Aether Compute Engine", "Aether Object Storage", "Aether SQL Database").'
          ),
        explanation: z
          .string()
          .describe(
            'A brief explanation of why this service is suitable for the given business needs.'
          ),
        benefits: z
          .array(z.string())
          .describe('Key benefits of this service for the business.'),
      })
    )
    .describe('A list of recommended cloud services from Aether Cloud.'),
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
  prompt: `You are an expert cloud solutions architect for Aether Cloud, a leading cloud provider for enterprise businesses. Your task is to recommend the most suitable cloud services based on the user's provided business needs.

Aether Cloud offers a comprehensive suite of cloud services designed for enterprise-grade performance, security, and scalability. These include, but are not limited to:
-   **Compute Services**: Virtual Machines, Containers, Serverless Functions, Kubernetes Engine.
-   **Storage Services**: Object Storage, Block Storage, File Storage, Archival Storage.
-   **Database Services**: Relational Databases (SQL), NoSQL Databases, Data Warehousing, In-memory Databases.
-   **Networking Services**: Virtual Private Cloud (VPC), Load Balancing, Content Delivery Network (CDN), VPN, Dedicated Interconnect.
-   **Security Services**: Identity and Access Management (IAM), DDoS Protection, Key Management, Web Application Firewall (WAF), Security Information and Event Management (SIEM).
-   **Data Analytics Services**: Big Data Processing, Machine Learning Platforms, Business Intelligence Tools, Data Lakes.
-   **Developer Tools**: CI/CD Pipelines, Monitoring, Logging, API Management, SDKs.
-   **Managed Services**: Fully managed versions of all core services, reducing operational overhead.

Based on the following business needs, recommend specific Aether Cloud services from the categories listed above. For each recommendation, provide a concise explanation of why it is suitable and list 2-3 key benefits for the business. Focus on services that directly address the pain points and requirements described.

Business Needs: {{{businessNeeds}}}`,
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
