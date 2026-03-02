const Highlights = () => {
  return (
    <section className="py-16 px-6 bg-[hsl(var(--hero-bg))]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
          Introduction
        </h2>
        <div className="text-base text-muted-foreground leading-relaxed space-y-4 text-justify">
          <p>
            <strong className="text-foreground">Large Language Models</strong> are deployed as autonomous agents in increasingly complex applications, where enabling long-horizon memory is critical for achieving strong performance. However, a significant gap exists between practical applications and current evaluation standards for agent memory.
          </p>
          <p>
            To bridge this gap, we introduce <strong className="text-foreground">AMA-Bench (Agent Memory with Any length)</strong>, which evaluates long-horizon memory for LLMs in real agentic applications. It features two key components: (1) a set of real-world agentic trajectories across representative applications, paired with expert-curated QA, and (2) a set of synthetic agentic trajectories that scale to arbitrary horizons, paired with rule-based QA.
          </p>
          <p>
            Our comprehensive study shows that existing memory systems underperform on AMA-Bench primarily because they lack causality and objective information. We propose <strong className="text-foreground">AMA-Agent</strong>, an effective memory system featuring a causality graph and tool-augmented retrieval, achieving <strong className="text-foreground">57.22% average accuracy</strong> — surpassing the strongest baselines by <strong className="text-foreground">11.16%</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
