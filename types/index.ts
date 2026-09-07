export type StackCategory =
  | "baas" // 📦 Soluciones Todo-en-Uno (BaaS)
  | "librerias" // 🧩 Librerías flexibles
  | "manual" // 🛠️ Control total (implementación manual)
  | "deploy"; // 🚀 Stacks con despliegue automático

export interface StackMetadata {
  name: string;
  slug: string;
  category: StackCategory;
  description: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  icon: string;
  tags: string[];
  summary: string;
  pros: string[];
  cons: string[];
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
