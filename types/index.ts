export type StackCategory =
  | "idaas" // 🔐 IDaaS (Identity as a Service) — solo identidad, gestionada
  | "baas" // ☁️ BaaS (Backend as a Service) — backend completo gestionado
  | "dbaas" // 🗄️ DBaaS (Database as a Service) — solo base de datos gestionada
  | "librerias" // 🧩 Librerías (self-hosted) — corre en tu servidor
  | "deploy"; // 🚀 Despliegue automático

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
