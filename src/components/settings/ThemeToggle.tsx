// src/components/settings/ThemeToggle.tsx
// Theme toggle card with light/dark/system options

"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const themes = [
  {
    value: "light",
    label: "Claro",
    description: "Interfaz brillante y limpia",
    icon: Sun,
    preview: "bg-gray-100 border-gray-200",
    dot: "bg-yellow-400",
  },
  {
    value: "dark",
    label: "Oscuro",
    description: "Descansa tu vista",
    icon: Moon,
    preview: "bg-gray-900 border-gray-700",
    dot: "bg-violet-400",
  },
  {
    value: "system",
    label: "Sistema",
    description: "Sigue la config. de tu OS",
    icon: Monitor,
    preview: "bg-gradient-to-r from-gray-100 to-gray-900 border-gray-400",
    dot: "bg-blue-400",
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ value, label, description, icon: Icon, preview, dot }) => {
          const isActive = theme === value;

          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "relative flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                isActive
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--surface))] hover:border-violet-500/40 hover:bg-[hsl(var(--surface-hover))]"
              )}
              aria-pressed={isActive}
              aria-label={`${label} theme`}
            >
              {/* Check indicator */}
              {isActive && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </span>
              )}

              {/* Preview */}
              <div className={cn("w-full h-10 rounded-lg border", preview)} />

              {/* Label */}
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
