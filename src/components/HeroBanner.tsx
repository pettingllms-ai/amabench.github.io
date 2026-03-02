import { FileText, Github, Play, BookOpen } from "lucide-react";

const links = [
  { label: "Paper", icon: FileText, href: "https://arxiv.org/abs/2602.22769" },
  { label: "Code", icon: Github, href: "#" },
  { label: "Demo", icon: Play, href: "#" },
  { label: "Docs", icon: BookOpen, href: "#" },
];

const HeroBanner = () => {
  return (
    <section className="bg-[hsl(var(--hero-bg))] py-16 md:py-24">
      <div className="text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
          AMA-Bench: Evaluating Long-Horizon Memory
          <br />
          for Agentic Applications
        </h1>

        <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Agent Memory with Any length — a benchmark featuring real-world agentic trajectories and causality-aware memory systems.
        </p>

        {/* Link Tabs */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-background text-foreground hover:bg-secondary transition-colors text-sm font-medium shadow-sm"
            >
              <link.icon size={15} />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
