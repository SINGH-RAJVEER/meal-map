import * as React from "react";
import { cn } from "../../lib/utils";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  label?: React.ReactNode;
  subLabel?: React.ReactNode;
  circleClassName?: string;
  trackClassName?: string;
  labelClassName?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  showText = true,
  label,
  subLabel,
  className,
  circleClassName,
  trackClassName,
  labelClassName,
  ...props
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={cn("text-muted/20", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "text-primary transition-all duration-1000 ease-in-out",
            circleClassName,
          )}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {label && (
            <span
              className={cn("text-xl font-bold leading-none", labelClassName)}
            >
              {label}
            </span>
          )}
          {subLabel && (
            <span className="text-xs text-muted-foreground mt-1">
              {subLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
