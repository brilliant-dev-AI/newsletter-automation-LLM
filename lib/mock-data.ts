export interface Link {
  id: string;
  emailId: string;
  url: string;
  text: string;
  context: string;
  category: string;
  relevance: number;
  extractionMethod: string;
  extractedAt: string;
  processed: boolean;
}

export const MOCK_LINKS: Link[] = [
  {
    id: "mock-1",
    emailId: "email-1",
    url: "https://builtin.com/jobs/senior-full-stack-engineer/123456",
    text: "Senior Full Stack Engineer at Akkio",
    context:
      "Remote position in New York, NY with salary range $160,000-$240,000",
    category: "job",
    relevance: 8,
    extractionMethod: "html_parser",
    extractedAt: new Date().toISOString(),
    processed: false,
  },
  {
    id: "mock-2",
    emailId: "email-1",
    url: "https://stackoverflow.blog/2024/10/05/engineering-culture",
    text: "Building a Strong Engineering Culture",
    context:
      "Latest insights from Stack Overflow on fostering great engineering teams",
    category: "article",
    relevance: 7,
    extractionMethod: "llm",
    extractedAt: new Date(Date.now() - 3600000).toISOString(),
    processed: true,
  },
  {
    id: "mock-3",
    emailId: "email-2",
    url: "https://github.com/features/ai",
    text: "GitHub Copilot Workspace",
    context: "New AI-powered development environment for faster coding",
    category: "tool",
    relevance: 9,
    extractionMethod: "html_parser",
    extractedAt: new Date(Date.now() - 7200000).toISOString(),
    processed: false,
  },
  {
    id: "mock-4",
    emailId: "email-2",
    url: "https://cb4sdw3d.r.us-west-2.awstrack.me/L0/https:%2F%2Fbuiltin.com%2Fjob%2Fsoftware-engineer-web-experience-remote%2F7267329%3Fi=91c9b2f1-baab-4a70-ad81-ab1613d1268f%26utm_campaign=job_preference_email_weekly%26utm_medium=email%26utm_source=ses%26preference_id=16eec3d0-5c10-47c9-95dd-0d9594b7f417/1/01010199b037ed9a-f47bd7e9-830e-4fb8-b403-ab7d4c942623-000000/9v1w9RAujSf4ksJBjHqWTXxdwqM=447",
    text: "Software Engineer, Web Experience (Remote)",
    context: "Drata - Remote position in United States $95,000-$146,600",
    category: "job",
    relevance: 6,
    extractionMethod: "html_parser",
    extractedAt: new Date(Date.now() - 10800000).toISOString(),
    processed: false,
  },
  {
    id: "mock-5",
    emailId: "email-3",
    url: "https://openai.com/blog/gpt-4-turbo",
    text: "GPT-4 Turbo: Faster and More Capable",
    context:
      "OpenAI announces improved GPT-4 with better performance and lower costs",
    category: "product",
    relevance: 8,
    extractionMethod: "llm",
    extractedAt: new Date(Date.now() - 14400000).toISOString(),
    processed: false,
  },
  {
    id: "mock-6",
    emailId: "email-3",
    url: "https://vercel.com/blog/next-js-15",
    text: "Next.js 15: The React Framework for Production",
    context:
      "Latest updates to Next.js including improved performance and new features",
    category: "tool",
    relevance: 9,
    extractionMethod: "html_parser",
    extractedAt: new Date(Date.now() - 18000000).toISOString(),
    processed: true,
  },
  {
    id: "mock-7",
    emailId: "email-4",
    url: "https://techcrunch.com/2024/10/05/ai-startup-funding",
    text: "AI Startups Raise $2.3B in Q3 2024",
    context:
      "TechCrunch reports on the latest AI funding trends and market insights",
    category: "news",
    relevance: 7,
    extractionMethod: "html_parser",
    extractedAt: new Date(Date.now() - 21600000).toISOString(),
    processed: false,
  },
];
