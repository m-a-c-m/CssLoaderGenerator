"use client";

import { useState, useCallback, useMemo } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

interface Props { locale?: string; }

type LoaderType = "spinner" | "dual-ring" | "dots" | "bars" | "pulse" | "ripple";

const TYPES: { id: LoaderType; es: string; en: string }[] = [
  { id: "spinner", es: "Anillo", en: "Ring" },
  { id: "dual-ring", es: "Doble anillo", en: "Dual ring" },
  { id: "dots", es: "Puntos", en: "Dots" },
  { id: "bars", es: "Barras", en: "Bars" },
  { id: "pulse", es: "Pulso", en: "Pulse" },
  { id: "ripple", es: "Ondas", en: "Ripple" },
];

export default function CssLoaderGenerator({ locale = "es" }: Props) {
  const isEs = locale === "es";

  const [type, setType] = useState<LoaderType>("spinner");
  const [color, setColor] = useState("#7c3aed");
  const [size, setSize] = useState(48);
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    switch (type) {
      case "spinner":
      case "dual-ring":
      case "pulse":
      case "ripple":
        return `<div class="loader"></div>`;
      case "dots":
        return `<div class="loader">\n  <div></div>\n  <div></div>\n  <div></div>\n</div>`;
      case "bars":
        return `<div class="loader">\n  <div></div>\n  <div></div>\n  <div></div>\n  <div></div>\n  <div></div>\n</div>`;
    }
  }, [type]);

  const css = useMemo(() => {
    const s = size;
    const dur = `${speed}s`;
    switch (type) {
      case "spinner":
        return `.loader {
  width: ${s}px;
  height: ${s}px;
  border: ${Math.max(3, Math.round(s / 12))}px solid ${color}33;
  border-bottom-color: ${color};
  border-radius: 50%;
  display: inline-block;
  animation: loader-rotation ${dur} linear infinite;
}

@keyframes loader-rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
      case "dual-ring":
        return `.loader {
  width: ${s}px;
  height: ${s}px;
  border: ${Math.max(3, Math.round(s / 10))}px solid ${color};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: loader-rotation ${dur} linear infinite;
}

@keyframes loader-rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
      case "dots": {
        const d = Math.round(s / 4);
        return `.loader {
  display: flex;
  gap: ${Math.round(d / 2)}px;
}

.loader > div {
  width: ${d}px;
  height: ${d}px;
  border-radius: 50%;
  background: ${color};
  animation: loader-bounce ${(speed * 0.6).toFixed(2)}s ease-in-out infinite;
}

.loader > div:nth-child(2) { animation-delay: ${(speed * 0.1).toFixed(2)}s; }
.loader > div:nth-child(3) { animation-delay: ${(speed * 0.2).toFixed(2)}s; }

@keyframes loader-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}`;
      }
      case "bars": {
        const w = Math.round(s / 8);
        return `.loader {
  display: flex;
  align-items: center;
  gap: ${w}px;
  height: ${s}px;
}

.loader > div {
  width: ${w}px;
  height: 100%;
  border-radius: ${w}px;
  background: ${color};
  animation: loader-stretch ${dur} ease-in-out infinite;
}

.loader > div:nth-child(2) { animation-delay: 0.1s; }
.loader > div:nth-child(3) { animation-delay: 0.2s; }
.loader > div:nth-child(4) { animation-delay: 0.3s; }
.loader > div:nth-child(5) { animation-delay: 0.4s; }

@keyframes loader-stretch {
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
}`;
      }
      case "pulse":
        return `.loader {
  width: ${s}px;
  height: ${s}px;
  border-radius: 50%;
  background: ${color};
  display: inline-block;
  animation: loader-pulse ${dur} ease-in-out infinite;
}

@keyframes loader-pulse {
  0% { transform: scale(0.8); opacity: 0.9; box-shadow: 0 0 0 0 ${color}66; }
  70% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 0 ${Math.round(s / 2)}px ${color}00; }
  100% { transform: scale(0.8); opacity: 0.9; box-shadow: 0 0 0 0 ${color}00; }
}`;
      case "ripple":
        return `.loader {
  width: ${s}px;
  height: ${s}px;
  display: inline-block;
  position: relative;
}

.loader::after,
.loader::before {
  content: "";
  position: absolute;
  inset: 0;
  border: ${Math.max(3, Math.round(s / 14))}px solid ${color};
  border-radius: 50%;
  animation: loader-ripple ${dur} ease-out infinite;
}

.loader::after {
  animation-delay: ${(speed / -2).toFixed(2)}s;
}

@keyframes loader-ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`;
    }
  }, [type, color, size, speed]);

  const copyAll = useCallback(async () => {
    await navigator.clipboard.writeText(`${html}\n\n<style>\n${css}\n</style>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [html, css]);

  return (
    <div className="space-y-5">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="space-y-4 rounded-xl border border-border/20 bg-surface/30 p-4">
        <div>
          <label className="mb-2 block text-xs text-text-muted/70">{isEs ? "Tipo de loader" : "Loader type"}</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${type === t.id ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-surface/60 text-text-muted hover:text-text"}`}
              >
                {isEs ? t.es : t.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-text-muted/70">{isEs ? "Color" : "Color"}</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-border/30 bg-surface/60" />
          </div>
          {([
            ["size", isEs ? "Tamaño (px)" : "Size (px)", size, setSize, 16, 96],
            ["speed", isEs ? "Duración (s)" : "Duration (s)", speed, setSpeed, 0.4, 3],
          ] as const).map(([key, label, value, setter, min, max]) => (
            <div key={key}>
              <label className="mb-1 flex justify-between text-xs text-text-muted/70"><span>{label}</span><span>{value}</span></label>
              <input type="range" min={min} max={max} step={key === "speed" ? 0.1 : 1} value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-3 w-full accent-primary" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border/20">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-muted">HTML + CSS</label>
          <button onClick={copyAll} className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
            {copied ? <><FiCheck className="text-xs" /> {isEs ? "Copiado" : "Copied"}</> : <><FiCopy className="text-xs" /> {isEs ? "Copiar HTML + CSS" : "Copy HTML + CSS"}</>}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border/30 bg-surface/40 px-4 py-3 font-mono text-xs leading-relaxed text-text">{`${html}\n\n${css}`}</pre>
      </div>
    </div>
  );
}
