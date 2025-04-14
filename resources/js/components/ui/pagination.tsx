import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  onPageChange: (url: string) => void;
  className?: string;
}

export function Pagination({ links, onPageChange, className }: PaginationProps) {
  if (links.length <= 1) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {links.map((link, idx) => {
        if (idx === 0) {
          return (
            <button
              key={idx}
              disabled={!link.url}
              className={cn(
                'p-2 rounded-lg border border-neutral-200 bg-white text-neutral-700',
                'hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition',
                'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
              onClick={() => link.url && onPageChange(link.url)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          );
        }

        if (idx === links.length - 1) {
          return (
            <button
              key={idx}
              disabled={!link.url}
              className={cn(
                'p-2 rounded-lg border border-neutral-200 bg-white text-neutral-700',
                'hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition',
                'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
              onClick={() => link.url && onPageChange(link.url)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          );
        }

        return (
          <button
            key={idx}
            disabled={!link.url}
            className={cn(
              'px-4 py-2 rounded-lg border text-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed transition',
              link.active
                ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            )}
            onClick={() => link.url && onPageChange(link.url)}
            dangerouslySetInnerHTML={{ __html: link.label }}
            aria-label={`Page ${link.label}`}
          />
        );
      })}
    </div>
  );
}