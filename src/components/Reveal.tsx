import { useRef, useEffect } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: any;
  delay?: number;
  y?: number;
  class?: string;
}

export function Reveal({ children, delay = 0, y = 24, class: className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current!, {
        y,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 88%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} class={className}>
      {children}
    </div>
  );
}
