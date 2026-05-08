import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const options = [
  { value: "light",  Icon: Sun,     label: "Light mode"  },
  { value: "system", Icon: Monitor, label: "System theme" },
  { value: "dark",   Icon: Moon,    label: "Dark mode"   },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-full border border-border/70 bg-background/60 p-0.5 backdrop-blur-sm">
      {options.map(({ value, Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
            theme === value
              ? "bg-ember/20 text-ember shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={11} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
