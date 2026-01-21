import { useEffect, useRef } from "react";

export function MapBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number;

    // Tracers
    class Tracer {
      x: number;
      y: number;
      vx: number;
      vy: number;
      history: { x: number; y: number }[];
      maxHistory: number;
      speed: number;
      color: string;
      width: number;
      changeDirectionChance: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = Math.random() * 0.5 + 0.2;

        const dir = Math.floor(Math.random() * 4);
        this.vx = 0;
        this.vy = 0;
        if (dir === 0) this.vx = this.speed;
        else if (dir === 1) this.vx = -this.speed;
        else if (dir === 2) this.vy = this.speed;
        else this.vy = -this.speed;

        this.history = [];
        this.maxHistory = Math.random() * 50 + 50;
        this.changeDirectionChance = 0.01;

        const isDark = document.documentElement.classList.contains("dark");
        const baseColor = isDark ? "255, 255, 255" : "0, 0, 0";
        this.color = `rgba(${baseColor}, ${Math.random() * 0.2 + 0.1})`;
        this.width = Math.random() * 1.5 + 0.5;
      }

      update(width: number, height: number) {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) {
          this.history.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        let wrapped = false;
        if (this.x < 0) {
          this.x = width;
          wrapped = true;
        }
        if (this.x > width) {
          this.x = 0;
          wrapped = true;
        }
        if (this.y < 0) {
          this.y = height;
          wrapped = true;
        }
        if (this.y > height) {
          this.y = 0;
          wrapped = true;
        }

        if (wrapped) {
          this.history = [];
        }

        if (Math.random() < this.changeDirectionChance) {
          if (this.vx !== 0) {
            this.vx = 0;
            this.vy = Math.random() > 0.5 ? this.speed : -this.speed;
          } else {
            this.vy = 0;
            this.vx = Math.random() > 0.5 ? this.speed : -this.speed;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.history.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.stroke();
      }
    }

    const tracers: Tracer[] = [];
    const tracerCount = 50;
    for (let i = 0; i < tracerCount; i++) {
      tracers.push(new Tracer());
    }

    const updateThemeColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const baseColor = isDark ? "255, 255, 255" : "0, 0, 0";

      tracers.forEach((t) => {
        t.color = `rgba(${baseColor}, ${Math.random() * 0.2 + 0.1})`;
      });
    };

    updateThemeColors();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateThemeColors();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      tracers.forEach((t) => {
        t.update(width, height);
        t.draw(ctx);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 blur-[1px]"
      />
    </div>
  );
}
