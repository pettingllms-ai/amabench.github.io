import { FileText, Github, Play, Database } from "lucide-react";

const HuggingFaceIcon = () => (
  <img
    src="https://huggingface.co/favicon.ico"
    alt=""
    width={15}
    height={15}
    className="inline-block"
  />
);

const links = [
  { label: "Paper", icon: FileText, href: "https://arxiv.org/abs/2602.22769" },
  { label: "Code", icon: Github, href: "#" },
  { label: "Demo", icon: Play, href: "#" },
  { label: "Hugging Face", icon: Database, href: "https://huggingface.co/datasets/Pettingllms/AMA-bench", customIcon: HuggingFaceIcon },
];

const HeroBanner = () => {
  return (
    <section className="bg-[hsl(var(--hero-bg))] py-16 md:py-24">
      <div className="text-center px-6 max-w-4xl mx-auto">
        <p className="font-mono text-sm text-accent-blue mb-4 tracking-wider">
          01 — OVERVIEW
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
          AMA-Bench: Evaluating Long-Horizon Memory
          <br />
          for Agentic Applications
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-foreground/70 max-w-2xl mx-auto mb-6 leading-relaxed italic">
          Evaluate agent memory itself, not just dialogue.
        </p>

        <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Yujie Zhao<sup>1</sup>,{" "}
          Boqin Yuan<sup>1</sup>,{" "}
          Junbo Huang<sup>1</sup>, Haocheng Yuan<sup>1</sup>, Zhongming Yu<sup>1</sup>, Haozhou Xu<sup>1</sup>,{" "}
          Lanxiang Hu<sup>1</sup>, Abhilash Shankarampeta<sup>1</sup>, Zimeng Huang<sup>1</sup>,{" "}
          Wentao Ni<sup>1</sup>, Yuandong Tian<sup>2</sup>, Jishen Zhao<sup>1</sup>
          <br />
          <span className="text-muted-foreground/70 text-xs mt-1 inline-block">
            <sup>1</sup>University of California, San Diego &nbsp;&middot;&nbsp; <sup>2</sup>Independent Research
          </span>
        </p>

        {/* Link Tabs */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href !== "#" ? "_blank" : undefined}
              rel={link.href !== "#" ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-background transition-colors text-sm font-medium shadow-sm ${
                link.href === "#"
                  ? "text-muted-foreground cursor-default opacity-60"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {"customIcon" in link && link.customIcon ? <link.customIcon /> : <link.icon size={15} />}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
