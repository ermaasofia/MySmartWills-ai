import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentPage: string;
}

export function Breadcrumb({ currentPage }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <span className="text-foreground font-medium">{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
}

export function breadcrumbJsonLd(pageName: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://smartwills.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: `https://smartwills.ai${pageUrl}`,
      },
    ],
  };
}
