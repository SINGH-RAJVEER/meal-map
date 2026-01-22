import { useEffect, useRef, useState } from "react";
import {
  Apple,
  Banana,
  Beer,
  Cake,
  Candy,
  Carrot,
  Cherry,
  Citrus,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Drumstick,
  Egg,
  EggFried,
  Fish,
  Grape,
  Ham,
  IceCream,
  Lollipop,
  Martini,
  Milk,
  Nut,
  Pizza,
  Popcorn,
  Popsicle,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Vegan,
  Wheat,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Filter out any undefined imports if they don't exist in the installed version,
// but for now we list what are likely available.
// To be safe, we will just use a robust list.

const availableIcons = [
  Apple,
  Banana,
  Beer,
  Cake,
  Carrot,
  Cherry,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Egg,
  Fish,
  Grape,
  IceCream,
  Lollipop,
  Martini,
  Milk,
  Pizza,
  Popcorn,
  Sandwich,
  Soup,
  Utensils,
  Wheat,
  Wine,
];

// Combine and filter just in case (though here we can't filter at runtime easily if import fails compile time).
// We'll stick to the safe list 'availableIcons' plus common ones that usually exist.

const foodIcons = [
  ...availableIcons,
  // Add extras that are highly likely to exist in recent Lucide versions
  Candy,
  Citrus,
  Drumstick,
  EggFried,
  Ham,
  Nut,
  Popsicle,
  Salad,
  Vegan,
];

interface FoodIconItem {
  Icon: LucideIcon;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function FloatingIcon({ icon }: { icon: FoodIconItem }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    let currentX = icon.x;
    let currentY = icon.y;
    let currentVx = icon.vx;
    let currentVy = icon.vy;

    const animate = () => {
      currentX += currentVx;
      currentY += currentVy;

      // Randomly change direction occasionally
      if (Math.random() < 0.01) {
        currentVx = (Math.random() - 0.5) * 0.1;
        currentVy = (Math.random() - 0.5) * 0.1;
      }

      if (ref.current) {
        ref.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [icon.x, icon.y, icon.vx, icon.vy]);

  return (
    <div
      ref={ref}
      className="absolute flex items-center justify-center w-8 h-8"
      style={{
        left: `${icon.x}px`,
        top: `${icon.y}px`,
      }}
    >
      <icon.Icon className="w-4 h-4 text-foreground" />
    </div>
  );
}

export function FoodGridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [icons, setIcons] = useState<FoodIconItem[]>([]);

  useEffect(() => {
    const generateIcons = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = Math.ceil(width / 45);
      const rows = Math.ceil(height / 45);
      const totalIcons = cols * rows;

      const newIcons: FoodIconItem[] = [];
      for (let i = 0; i < totalIcons; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        newIcons.push({
          Icon: foodIcons[i % foodIcons.length],
          x: col * 45 + Math.random() * 15 - 7.5,
          y: row * 45 + Math.random() * 15 - 7.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
        });
      }
      setIcons(newIcons);
    };

    generateIcons();
    window.addEventListener("resize", generateIcons);
    return () => window.removeEventListener("resize", generateIcons);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none"
    >
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] blur-[0.5px] select-none"
        style={{
          transform: "rotate(-12deg) scale(1.5)",
          transformOrigin: "center center",
        }}
      >
        {icons.map((icon, i) => (
          <FloatingIcon key={i} icon={icon} />
        ))}
      </div>
    </div>
  );
}
