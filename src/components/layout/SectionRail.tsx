import { useState, useEffect, useRef } from 'react';
import '../../styles/components/section-rail.css';

export interface SectionEntry {
  id: string;
  label: string;
}

interface SectionRailProps {
  sections: SectionEntry[];
  /** When this section id scrolls out of view below, hide the rail */
  hideAfterId?: string;
}

export default function SectionRail({ sections, hideAfterId }: SectionRailProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [hidden, setHidden] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* Track active section via IntersectionObserver */
  useEffect(() => {
    if (sections.length === 0) return;

    // Map of section id → intersection ratio for determining most-visible
    const ratioMap = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Pick the section with the highest visible ratio
        let bestId = '';
        let bestRatio = 0;
        ratioMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) setActiveId(bestId);
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    const observer = observerRef.current;

    // Small delay so DOM is ready
    const t = setTimeout(() => {
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 300);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [sections]);

  /* Hide rail once the hideAfterId section scrolls past */
  useEffect(() => {
    if (!hideAfterId) return;

    const hideObserver = new IntersectionObserver(
      ([entry]) => {
        // Hide when the target section is no longer intersecting (scrolled past)
        // We hide after it has been visible and then exits at the bottom
        setHidden(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    const t = setTimeout(() => {
      const el = document.getElementById(hideAfterId);
      if (el) hideObserver.observe(el);
    }, 300);

    return () => {
      clearTimeout(t);
      hideObserver.disconnect();
    };
  }, [hideAfterId]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`section-rail${hidden ? ' section-rail--hidden' : ''}`}
      aria-label="Navegación de secciones"
    >
      {sections.map(({ id, label }) => (
        <div key={id} className="section-rail__item">
          <button
            className={`section-rail__dot${activeId === id ? ' section-rail__dot--active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={`Ir a ${label}`}
            aria-current={activeId === id ? 'true' : undefined}
          />
          <span className="section-rail__tooltip" aria-hidden="true">
            {label}
          </span>
        </div>
      ))}
    </nav>
  );
}
