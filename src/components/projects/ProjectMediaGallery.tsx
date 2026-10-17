/** ProjectMediaGallery - large screenshots and clips for a project case study */

import Image from 'next/image';
import type { ProjectMedia } from '@/lib/content';

/**
 * Renders desktop captures full width and phone captures side by side,
 * each with an optional caption.
 *
 * @param media - items from Project.media
 * @returns the gallery, or null when there is nothing to show
 */
export default function ProjectMediaGallery({ media }: { media: ProjectMedia[] }) {
  if (media.length === 0) return null;

  // Why: phone screenshots at full column width would be taller than the
  // viewport, so they're grouped into a narrower row of their own.
  const wide = media.filter((m) => m.device !== 'mobile');
  const phone = media.filter((m) => m.device === 'mobile');

  return (
    <div className="space-y-8">
      {wide.map((m) => (
        <MediaItem key={m.src} item={m} sizes="(min-width: 1024px) 960px, 100vw" />
      ))}
      {phone.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
          {phone.map((m) => (
            <MediaItem key={m.src} item={m} sizes="(min-width: 640px) 280px, 50vw" />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaItem({ item, sizes }: { item: ProjectMedia; sizes: string }) {
  return (
    <figure>
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: '1px solid var(--stroke)', background: 'var(--bg-surface)' }}
      >
        {item.kind === 'video' ? (
          <video
            src={item.src}
            width={item.width}
            height={item.height}
            className="w-full h-auto block"
            controls
            muted
            playsInline
            preload="metadata"
            aria-label={item.alt}
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes={sizes}
            className="w-full h-auto block"
          />
        )}
      </div>
      {item.caption && (
        <figcaption className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}
