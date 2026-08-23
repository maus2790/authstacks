export interface StackMetadata {
  name: string;
  slug: string;
  description: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  icon: string;
  tags: string[];
}

export interface StepMetadata {
  slug: string;
  title: string;
  order: number;
}

export interface Stack {
  metadata: StackMetadata;
  steps: StepMetadata[];
}