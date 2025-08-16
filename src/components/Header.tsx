import { Scale } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-glass/95 backdrop-blur supports-[backdrop-filter]:bg-surface-glass/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">JuriNews</h1>
            <p className="text-xs text-muted-foreground">Notícias Jurídicas</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    </header>
  );
};