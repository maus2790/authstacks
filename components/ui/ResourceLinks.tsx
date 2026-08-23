import { ExternalLink, FileText, Code, Video } from 'lucide-react';

interface Resource {
  type: 'docs' | 'github' | 'video' | 'article';
  title: string;
  url: string;
}

interface ResourceLinksProps {
  resources: Resource[];
}

const icons = {
  docs: FileText,
  github: Code,
  video: Video,
  article: ExternalLink,
};

export function ResourceLinks({ resources }: ResourceLinksProps) {
  return (
    <div className="my-6 rounded-lg border border-border bg-card p-4">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Recursos adicionales
      </h4>
      <ul className="space-y-2">
        {resources.map((resource, index) => {
          const Icon = icons[resource.type];
          return (
            <li key={index}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
              >
                <Icon size={16} />
                <span>{resource.title}</span>
                <ExternalLink size={12} className="opacity-50" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
