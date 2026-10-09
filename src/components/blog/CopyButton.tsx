import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

type CopyState = "idle" | "copied" | "error";

export function CopyButton({ text, className = "", label }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [text]);

  const ariaLabel =
    state === "copied" ? "Copied!" : state === "error" ? "Failed — try again" : label ?? "Copy prompt";

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel}
        className={`b-copy-btn${state === "copied" ? " copied" : ""}${state === "error" ? " error" : ""} ${className}`}
      >
        {state === "copied" ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M1 4h2M1 4v8a1.5 1.5 0 001.5 1.5H10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        )}
        <span>{state === "idle" ? (label ?? "Copy") : state === "copied" ? "Copied!" : "Error"}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Prompt copied to clipboard" : state === "error" ? "Failed to copy" : ""}
      </span>
    </>
  );
}
