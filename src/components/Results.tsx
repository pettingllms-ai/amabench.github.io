import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import {
  memorySystemResults,
  llmResults,
  fullContextBaseline,
  type MethodCategory,
} from "@/data/results";

type FilterTab = "All" | MethodCategory;

const ACCENT = "hsl(217, 71%, 53%)";
const MUTED_BAR = "hsl(30, 10%, 78%)";
const MEMORY_BAR = "hsl(30, 15%, 68%)";
const RAG_BAR = "hsl(30, 20%, 72%)";

const barColor = (category: MethodCategory) => {
  if (category === "Proposed") return ACCENT;
  if (category === "RAG") return RAG_BAR;
  return MEMORY_BAR;
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof memorySystemResults[0] }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-background border border-border/50 rounded-lg shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{d.method}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
        <span>Recall</span><span className="font-mono text-foreground">{(d.recall * 100).toFixed(1)}%</span>
        <span>Causal</span><span className="font-mono text-foreground">{(d.causal * 100).toFixed(1)}%</span>
        <span>State-Update</span><span className="font-mono text-foreground">{(d.stateUpdate * 100).toFixed(1)}%</span>
        <span>State-Abstract</span><span className="font-mono text-foreground">{(d.stateAbstract * 100).toFixed(1)}%</span>
        <span className="font-medium text-foreground">Average</span>
        <span className="font-mono font-medium text-foreground">{(d.avg * 100).toFixed(2)}%</span>
      </div>
    </div>
  );
};

const Results = () => {
  const { ref, isVisible } = useInView();
  const [filter, setFilter] = useState<FilterTab>("All");

  const accuracy = useCountUp(57.22, 1500, isVisible);
  const improvement = useCountUp(11.16, 1500, isVisible);
  const pairs = useCountUp(2496, 1200, isVisible);

  const filtered = useMemo(() => {
    const data = filter === "All"
      ? memorySystemResults
      : memorySystemResults.filter((r) => r.category === filter);
    return [...data].sort((a, b) => a.avg - b.avg);
  }, [filter]);

  const chartHeight = Math.max(300, filtered.length * 36 + 60);

  return (
    <section className="py-16 md:py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-sm text-accent-blue mb-2 tracking-wider">
          04 — RESULTS
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Main Results
        </h2>
        <div className="mb-10 rounded-lg border border-accent-blue/30 bg-accent-blue-light px-4 py-3 text-sm text-foreground/80">
          <strong className="text-accent-blue">Note:</strong> Results shown here are from the paper using{" "}
          <strong>open-ended QA evaluation</strong> (LLM-as-judge). This differs from our{" "}
          <a
            href="https://huggingface.co/datasets/Pettingllms/AMA-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-accent-blue hover:text-accent-blue/80"
          >
            Hugging Face leaderboard
          </a>
          , which uses a different evaluation protocol.
        </div>

        {/* Hero stats */}
        <div
          className={cn(
            "grid grid-cols-3 gap-6 mb-12 opacity-0 translate-y-8 transition-all duration-700",
            isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div className="text-center">
            <p className="font-mono text-3xl md:text-4xl font-bold text-accent-blue">
              {accuracy.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">AMA-Agent Accuracy</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-3xl md:text-4xl font-bold text-accent-blue">
              +{improvement.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">Over Best Baseline</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-3xl md:text-4xl font-bold text-accent-blue">
              {Math.round(pairs).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">QA Pairs Evaluated</p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={cn(
            "opacity-0 translate-y-8 transition-all duration-700 delay-200",
            isVisible && "opacity-100 translate-y-0"
          )}
        >
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterTab)}
            className="mb-6"
          >
            <TabsList className="bg-muted rounded-full p-1">
              {(["All", "RAG", "Memory", "Proposed"] as FilterTab[]).map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-accent-blue data-[state=active]:text-white"
                >
                  {tab === "Memory" ? "Memory Agent" : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Bar chart */}
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filtered}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis
                  type="number"
                  domain={[0, 0.7]}
                  tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="method"
                  width={90}
                  fontSize={12}
                  tick={{ fill: "hsl(0, 0%, 45%)" }}
                />
                <ReferenceLine
                  x={fullContextBaseline}
                  stroke="hsl(0, 0%, 60%)"
                  strokeDasharray="6 4"
                  label={{
                    value: "Qwen3-32B Full Context",
                    position: "top",
                    fontSize: 11,
                    fill: "hsl(0, 0%, 50%)",
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(30, 10%, 95%)" }} />
                <Bar dataKey="avg" radius={[0, 4, 4, 0]} barSize={20}>
                  {filtered.map((entry) => (
                    <Cell key={entry.method} fill={barColor(entry.category)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LLM Table */}
        <div
          className={cn(
            "mt-16 opacity-0 translate-y-8 transition-all duration-700 delay-300",
            isVisible && "opacity-100 translate-y-0"
          )}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            LLM Full-Context Performance
          </h3>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right font-mono">Recall</TableHead>
                  <TableHead className="text-right font-mono">Causal</TableHead>
                  <TableHead className="text-right font-mono">State-Upd.</TableHead>
                  <TableHead className="text-right font-mono">State-Abs.</TableHead>
                  <TableHead className="text-right font-mono font-semibold">Avg</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {llmResults.map((r) => (
                  <TableRow key={r.model}>
                    <TableCell className="font-medium">{r.model}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{(r.recall * 100).toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{(r.causal * 100).toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{(r.stateUpdate * 100).toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{(r.stateAbstract * 100).toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">{(r.avg * 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
