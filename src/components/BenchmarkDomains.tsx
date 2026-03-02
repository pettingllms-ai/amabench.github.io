import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { domainStats, totalStats } from "@/data/results";

import catAlfworld from "@/assets/cat-alfworld.jpg";
import catBalrog from "@/assets/cat-balrog.jpg";
import catWebarena from "@/assets/cat-webarena.jpg";
import catSwebench from "@/assets/cat-swebench.jpg";
import catGaia from "@/assets/cat-gaia.jpg";
import catSpider from "@/assets/cat-spider.jpg";
import datasetDistImg from "@/assets/figures/domain_distribution.png";

const imageMap: Record<string, string> = {
  "cat-spider": catSpider,
  "cat-gaia": catGaia,
  "cat-webarena": catWebarena,
  "cat-balrog": catBalrog,
  "cat-alfworld": catAlfworld,
  "cat-swebench": catSwebench,
};

const BenchmarkDomains = () => {
  const { ref, isVisible } = useInView();
  const samples = useCountUp(totalStats.samples, 1200, isVisible);
  const qaPairs = useCountUp(totalStats.qaPairs, 1200, isVisible);

  return (
    <section className="py-16 md:py-24 px-6 bg-[hsl(var(--hero-bg))]" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-sm text-accent-blue mb-2 tracking-wider">
          03 — BENCHMARK
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
          Benchmark Domains
        </h2>

        {/* Top: sunburst + stats */}
        <div
          className={cn(
            "flex flex-col md:flex-row items-center gap-8 mb-12 opacity-0 translate-y-8 transition-all duration-700",
            isVisible && "opacity-100 translate-y-0"
          )}
        >
          <img
            src={datasetDistImg}
            alt="Dataset distribution"
            className="w-full max-w-sm rounded-lg"
          />
          <div className="flex flex-row md:flex-col gap-8">
            <div className="text-center md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">
                {Math.round(samples)}
              </p>
              <p className="text-sm text-muted-foreground">Samples</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">
                {Math.round(qaPairs).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">QA Pairs</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">6</p>
              <p className="text-sm text-muted-foreground">Domains</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">4</p>
              <p className="text-sm text-muted-foreground">Capabilities</p>
            </div>
          </div>
        </div>

        {/* Domain cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {domainStats.map((d, i) => (
            <div
              key={d.domain}
              className={cn(
                "rounded-2xl overflow-hidden bg-card shadow-sm opacity-0 translate-y-8 transition-all duration-700",
                isVisible && "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <img
                src={imageMap[d.image]}
                alt={d.domain}
                className="w-full h-36 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{d.domain}</h3>
                  <Badge variant="outline" className="text-xs">
                    {d.source}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                  <span>{d.samples} samples</span>
                  <span>{d.qaPairs} QA</span>
                  <span>{d.avgTokens.toLocaleString()} tok</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenchmarkDomains;
