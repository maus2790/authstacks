import fs from "fs";
import path from "path";
import { cache } from "react";
import { Stack, StackMetadata, StepMetadata } from "@/types";
import { stepComponents } from "@/lib/step-components";

const STACKS_DIR = path.join(process.cwd(), "content", "stacks");

export const getAllStacks = cache((): Stack[] => {
  if (!fs.existsSync(STACKS_DIR)) return [];

  const stackNames = fs.readdirSync(STACKS_DIR).filter((item) => {
    const stats = fs.statSync(path.join(STACKS_DIR, item));
    return stats.isDirectory();
  });

  const stacks: Stack[] = [];

  for (const name of stackNames) {
    const stackPath = path.join(STACKS_DIR, name);

    const metadataPath = path.join(stackPath, "metadata.json");
    if (!fs.existsSync(metadataPath)) continue;
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as StackMetadata;

    let steps: StepMetadata[] = [];
    const stepsJsonPath = path.join(stackPath, "steps.json");
    if (fs.existsSync(stepsJsonPath)) {
      steps = JSON.parse(fs.readFileSync(stepsJsonPath, "utf-8"));
    } else {
      // Fallback: leer archivos .tsx y extraer orden por nombre
      const files = fs
        .readdirSync(stackPath)
        .filter((f) => f.endsWith(".tsx") && f !== "metadata.json" && f !== "steps.json");
      steps = files.map((file) => {
        const slug = file.replace(/\.tsx$/, "");
        const parts = slug.split("-");
        const order = parseInt(parts[0], 10);
        const title = parts
          .slice(1)
          .join(" ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return { slug, title, order };
      });
      steps.sort((a, b) => a.order - b.order);
    }

    stacks.push({ metadata, steps });
  }

  return stacks;
});

export function getStackBySlug(slug: string): Stack | null {
  const all = getAllStacks();
  return all.find((s) => s.metadata.slug === slug) || null;
}

export async function getStepComponent(stackSlug: string, stepSlug: string) {
  const loader = stepComponents[stackSlug]?.[stepSlug];
  if (!loader) {
    throw new Error(`Step ${stepSlug} not found in stack ${stackSlug}`);
  }
  const module = await loader();
  return module.default;
}
