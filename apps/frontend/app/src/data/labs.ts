export interface LabMeta {
  id: number;
  title: string;
  summary: string;
  hasContent: boolean;
  needsApiKey?: boolean;
}

export const LABS: LabMeta[] = [
  {
    id: 1,
    title: "Probability",
    summary: "Turn raw word counts into a probability distribution - the same idea behind an LLM's output layer.",
    hasContent: true,
  },
  {
    id: 2,
    title: "Probability: Simple Prediction",
    summary: "Contrast a frequency-based guess with a linear regression fit on real data.",
    hasContent: true,
  },
  {
    id: 3,
    title: "Conditional Probability",
    summary: "Build a bigram language model: P(next word | previous word) from real text.",
    hasContent: true,
  },
  {
    id: 4,
    title: "The Perceptron",
    summary: "Write the simplest possible neuron as a Python class.",
    hasContent: true,
  },
  {
    id: 5,
    title: "Training a Simple Perceptron",
    summary: "Implement the perceptron learning rule and train a real sentiment classifier.",
    hasContent: true,
  },
  {
    id: 6,
    title: "LLM Architecture Anatomy",
    summary: "Count a transformer's parameters component by component, then check real GPT-2 configs.",
    hasContent: true,
  },
  {
    id: 7,
    title: "The Transformer and Attention Mechanisms",
    summary: "Implement scaled dot-product attention from scratch and visualize it on real sentences.",
    hasContent: true,
  },
  {
    id: 8,
    title: "Prompting Techniques",
    summary: "Build a reusable PromptTemplate class - the foundation for labs 9-12.",
    hasContent: true,
  },
  {
    id: 9,
    title: "Zero-Shot Prompting",
    summary: "Make your first real call to Groq's API: classify real reviews with no examples given.",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 10,
    title: "Few-Shot Structured Output",
    summary: "Use worked examples to get reliable JSON back from the model.",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 11,
    title: "Chain-of-Thought",
    summary: "Compare direct answers vs. step-by-step reasoning on small logic questions.",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 12,
    title: "System Instruction Build",
    summary: "Give the model a persistent persona that holds across different questions.",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 13,
    title: "Free APIs and Integration: The Complete Digital Twin",
    summary: "Combine everything into a real, multi-turn chatbot built from your own bio.",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 14,
    title: "The 5 Universal API Components",
    summary: "Name what you've been doing: endpoint, method, headers, body, response - as a reusable client class.",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 15,
    title: "The Messages List In Depth / GroqClient Wrapper Class",
    summary: "Build the final GroqClient class and rebuild the digital twin on top of it.",
    hasContent: true,
    needsApiKey: true,
  },
];
