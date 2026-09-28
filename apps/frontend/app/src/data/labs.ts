export interface LabMeta {
  id: number;
  title: string;
  summary: string;
  coursePath: string;
  hasContent: boolean;
  needsApiKey?: boolean;
}

export const LABS: LabMeta[] = [
  {
    id: 1,
    title: "Probability",
    summary: "Turn raw word counts into a probability distribution - the same idea behind an LLM's output layer.",
    coursePath: "course/notebooks/lab_01_probability.ipynb",
    hasContent: true,
  },
  {
    id: 2,
    title: "Probability: Simple Prediction",
    summary: "Contrast a frequency-based guess with a linear regression fit on real data.",
    coursePath: "course/notebooks/lab_02_prediction.ipynb",
    hasContent: true,
  },
  {
    id: 3,
    title: "Conditional Probability",
    summary: "Build a bigram language model: P(next word | previous word) from real text.",
    coursePath: "course/notebooks/lab_03_conditional_probability.ipynb",
    hasContent: true,
  },
  {
    id: 4,
    title: "The Perceptron",
    summary: "Write the simplest possible neuron as a Python class.",
    coursePath: "course/notebooks/lab_04_perceptron.ipynb",
    hasContent: true,
  },
  {
    id: 5,
    title: "Training a Simple Perceptron",
    summary: "Implement the perceptron learning rule and train a real sentiment classifier.",
    coursePath: "course/notebooks/lab_05_training_perceptron.ipynb",
    hasContent: true,
  },
  {
    id: 6,
    title: "LLM Architecture Anatomy",
    summary: "Count a transformer's parameters component by component, then check real GPT-2 configs.",
    coursePath: "course/notebooks/lab_06_llm_architecture.ipynb",
    hasContent: true,
  },
  {
    id: 7,
    title: "The Transformer and Attention Mechanisms",
    summary: "Implement scaled dot-product attention from scratch and visualize it on real sentences.",
    coursePath: "course/notebooks/lab_07_attention.ipynb",
    hasContent: true,
  },
  {
    id: 8,
    title: "Prompting Techniques",
    summary: "Build a reusable PromptTemplate class - the foundation for labs 9-12.",
    coursePath: "course/notebooks/lab_08_prompting_techniques.ipynb",
    hasContent: true,
  },
  {
    id: 9,
    title: "Zero-Shot Prompting",
    summary: "Make your first real call to Groq's API: classify real reviews with no examples given.",
    coursePath: "course/notebooks/lab_09_zero_shot.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 10,
    title: "Few-Shot Structured Output",
    summary: "Use worked examples to get reliable JSON back from the model.",
    coursePath: "course/notebooks/lab_10_few_shot_structured.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 11,
    title: "Chain-of-Thought",
    summary: "Compare direct answers vs. step-by-step reasoning on small logic questions.",
    coursePath: "course/notebooks/lab_11_chain_of_thought.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 12,
    title: "System Instruction Build",
    summary: "Give the model a persistent persona that holds across different questions.",
    coursePath: "course/notebooks/lab_12_system_instructions.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 13,
    title: "Free APIs and Integration: The Complete Digital Twin",
    summary: "Combine everything into a real, multi-turn chatbot built from your own bio.",
    coursePath: "course/notebooks/lab_13_digital_twin.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 14,
    title: "The 5 Universal API Components",
    summary: "Name what you've been doing: endpoint, method, headers, body, response - as a reusable client class.",
    coursePath: "course/notebooks/lab_14_universal_api_components.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
  {
    id: 15,
    title: "The Messages List In Depth / GroqClient Wrapper Class",
    summary: "Build the final GroqClient class and rebuild the digital twin on top of it.",
    coursePath: "course/notebooks/lab_15_groq_client.ipynb",
    hasContent: true,
    needsApiKey: true,
  },
];
