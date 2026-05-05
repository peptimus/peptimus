import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NeonProgressBarProps {
  value: number; // 0 to 100
  color?: "cyan" | "emerald" | "purple";
  label?: string;
  className?: string;
}

export function NeonProgressBar({ value, color = "cyan", label, className }: NeonProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Slight delay for effect
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  const colorMap = {
    cyan: "bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary))]",
    emerald: "bg-[hsl(var(--secondary))] shadow-[0_0_10px_hsl(var(--secondary))]",
    purple: "bg-[hsl(var(--accent))] shadow-[0_0_10px_hsl(var(--accent))]",
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <span>{label}</span>
          <span className="text-foreground">{value}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${animatedValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorMap[color])}
        />
      </div>
    </div>
  );
}
