import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { domainStats, totalStats } from "@/data/results";
import TrajectoryModal, { type TrajectoryExample } from "@/components/TrajectoryModal";

import catAlfworld from "@/assets/cat-alfworld.jpg";
import catBalrog from "@/assets/cat-balrog.jpg";
import catWebarena from "@/assets/cat-webarena.jpg";
import catSwebench from "@/assets/cat-swebench.jpg";
import catGaia from "@/assets/cat-gaia.jpg";
import catSpider from "@/assets/cat-spider.jpg";
import datasetDistImg from "@/assets/figures/domain_distribution.png";

import alfworldData from "@/assets/data/task_alfworld_1.json";
import spiderData from "@/assets/data/task_spider2-snow_sf002.json";
import swebenchData from "@/assets/data/task_swebench_astropy__astropy-14598.json";
import webarenaData from "@/assets/data/task_webarena_1.json";
import gaiaData from "@/assets/data/task_gaia_level1_0383a3ee-47a7-41a4-b493-519bdefe0488.json";
import balrogData from "@/assets/data/balrog_babaisai_20251212_gpt5.1_make_win-distr_obj_rule_run_00_fail_specific_subtypes_hard.json";

const imageMap: Record<string, string> = {
  "cat-spider": catSpider,
  "cat-gaia": catGaia,
  "cat-webarena": catWebarena,
  "cat-balrog": catBalrog,
  "cat-alfworld": catAlfworld,
  "cat-swebench": catSwebench,
};

// Normalize the varying JSON structures into a unified TrajectoryExample
function normalize(raw: any, domain: string): TrajectoryExample {
  const trajectory = (raw.trajectory || []).map((t: any) => ({
    turn_idx: t.turn_idx ?? 0,
    action: t.action || t.action_name || "—",
    observation: t.observation || t.reasoning || "",
  }));

  const qaPairs = (raw.qa_pairs || []).map((q: any) => ({
    question: q.question,
    answer: q.answer,
    type: q.type || "",
    sub_type: q.sub_type || q.subtype || "",
  }));

  const state = raw.state || (raw.success === true ? "success" : "fail");

  return {
    episode_id: raw.episode_id || raw.source_trajectory?.split("/").pop()?.replace(".json", "") || "example",
    task: raw.task || "See trajectory below.",
    domain,
    num_turns: raw.num_turns || trajectory.length,
    total_tokens: raw.total_tokens || 0,
    state,
    trajectory,
    qa_pairs: qaPairs,
  };
}

const exampleMap: Record<string, TrajectoryExample> = {
  "Embodied AI": normalize(alfworldData, "Embodied AI"),
  "Text 2 SQL": normalize(spiderData, "Text 2 SQL"),
  "Software Engineering": normalize(swebenchData, "Software Engineering"),
  "Web Task Execution": normalize(webarenaData, "Web Task Execution"),
  "Open World Tool QA": normalize(gaiaData, "Open World Tool QA"),
  "Gaming": normalize(balrogData, "Gaming"),
};

const BenchmarkDomains = () => {
  const { ref, isVisible } = useInView();
  const samples = useCountUp(totalStats.samples, 1200, isVisible);
  const qaPairs = useCountUp(totalStats.qaPairs, 1200, isVisible);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<TrajectoryExample | null>(null);

  const handleCardClick = (domain: string) => {
    const example = exampleMap[domain];
    if (example) {
      setSelectedExample(example);
      setModalOpen(true);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-[hsl(var(--hero-bg))]" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-sm text-accent-blue mb-2 tracking-wider">
          03 — BENCHMARK
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
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
            <div className="flex items-center gap-3 md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">
                {Math.round(samples)}
              </p>
              <p className="text-sm font-semibold text-foreground">Samples</p>
            </div>
            <div className="flex items-center gap-3 md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">
                {Math.round(qaPairs).toLocaleString()}
              </p>
              <p className="text-sm font-semibold text-foreground">QA Pairs</p>
            </div>
            <div className="flex items-center gap-3 md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">6</p>
              <p className="text-sm font-semibold text-foreground">Domains</p>
            </div>
            <div className="flex items-center gap-3 md:text-left">
              <p className="font-mono text-4xl font-bold text-accent-blue">4</p>
              <p className="text-sm font-semibold text-foreground">Capabilities</p>
            </div>
          </div>
        </div>

        {/* Domain cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {domainStats.map((d, i) => (
            <div
              key={d.domain}
              onClick={() => handleCardClick(d.domain)}
              className={cn(
                "rounded-2xl overflow-hidden bg-card shadow-sm cursor-pointer group opacity-0 translate-y-8 transition-all duration-700",
                isVisible && "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="overflow-hidden">
                <img
                  src={imageMap[d.image]}
                  alt={d.domain}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-accent-blue transition-colors">
                    {d.domain}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {d.source}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                  <span>{d.samples} samples</span>
                  <span>{d.qaPairs} QA</span>
                  <span>{d.avgTokens.toLocaleString()} tok</span>
                </div>
                <p className="text-xs text-accent-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view example trajectory
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TrajectoryModal
        example={selectedExample}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default BenchmarkDomains;
