import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, fetchTaskDetail, type TaskEntry } from "@/data/tasks";
import TrajectoryModal, { type TrajectoryExample } from "@/components/TrajectoryModal";

const DOMAIN_ORDER = [
  "Text 2 SQL",
  "Open World Tool QA",
  "Web Task Execution",
  "Gaming",
  "Embodied AI",
  "Software Engineering",
];

const domainColorMap: Record<string, string> = {
  "Text 2 SQL": "bg-blue-100 text-blue-800 border-blue-200",
  "Open World Tool QA": "bg-purple-100 text-purple-800 border-purple-200",
  "Web Task Execution": "bg-emerald-100 text-emerald-800 border-emerald-200",
  Gaming: "bg-orange-100 text-orange-800 border-orange-200",
  "Embodied AI": "bg-pink-100 text-pink-800 border-pink-200",
  "Software Engineering": "bg-amber-100 text-amber-800 border-amber-200",
};

function TaskCard({
  task,
  onClick,
}: {
  task: TaskEntry;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-md hover:border-accent-blue/40 transition-all duration-200 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-foreground leading-tight group-hover:text-accent-blue transition-colors">
          {task.taskType}
          <span className="text-muted-foreground font-normal ml-1">
            #{task.id}
          </span>
        </h3>
        <span
          className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
            task.state === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {task.state}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 border ${domainColorMap[task.domain] || ""}`}
        >
          {task.source}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 text-muted-foreground"
        >
          {task.numQA} QA pairs
        </Badge>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 flex-1">
        {task.task}
      </p>

      {/* Stats */}
      <div className="flex gap-3 text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/60">
        <span>{task.numTurns} turns</span>
        {task.totalTokens > 0 && (
          <span>{task.totalTokens.toLocaleString()} tokens</span>
        )}
        <span className="ml-auto text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
          Click to view
        </span>
      </div>
    </div>
  );
}

const Gallery = () => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedExample, setSelectedExample] =
    useState<TrajectoryExample | null>(null);

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const handleCardClick = async (task: TaskEntry) => {
    setModalOpen(true);
    setModalLoading(true);
    setSelectedExample(null);
    try {
      const detail = await fetchTaskDetail(task.file);
      setSelectedExample(detail as TrajectoryExample);
    } finally {
      setModalLoading(false);
    }
  };

  const domainNames = useMemo(
    () => DOMAIN_ORDER.filter((d) => tasks.some((t) => t.domain === d)),
    [tasks]
  );

  const filtered = useMemo(() => {
    let result = tasks;
    if (selectedDomain !== "all") {
      result = result.filter((t) => t.domain === selectedDomain);
    }
    if (selectedState !== "all") {
      result = result.filter((t) => t.state === selectedState);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.taskType.toLowerCase().includes(q) ||
          t.task.toLowerCase().includes(q) ||
          t.source.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, search, selectedDomain, selectedState]);

  const grouped = useMemo(() => {
    const map: Record<string, TaskEntry[]> = {};
    for (const t of filtered) {
      if (!map[t.domain]) map[t.domain] = [];
      map[t.domain].push(t);
    }
    return DOMAIN_ORDER.filter((d) => map[d]).map((d) => ({
      domain: d,
      tasks: map[d],
    }));
  }, [filtered]);

  const hasFilters =
    search.trim() !== "" ||
    selectedDomain !== "all" ||
    selectedState !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedDomain("all");
    setSelectedState("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[hsl(var(--hero-bg))] border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to AMA-Bench
          </Link>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
            Task Gallery
          </h1>
          <p className="text-muted-foreground text-sm">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            of {tasks.length} tasks across {domainNames.length} domains
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-colors"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
          >
            <option value="all">All domains</option>
            {domainNames.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
          >
            <option value="all">All states</option>
            <option value="success">Success</option>
            <option value="fail">Fail</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Gallery content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {grouped.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No tasks found matching your filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 text-accent-blue text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map(({ domain, tasks: domainTasks }) => (
              <section key={domain}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-bold text-foreground">
                    {domain}
                  </h2>
                  <Badge
                    variant="outline"
                    className={`text-xs ${domainColorMap[domain] || ""}`}
                  >
                    {domainTasks[0]?.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {domainTasks.length} tasks
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {domainTasks.map((task) => (
                    <TaskCard
                      key={`${task.taskType}-${task.id}`}
                      task={task}
                      onClick={() => handleCardClick(task)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Detail modal — show loading spinner while fetching */}
      {modalLoading && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl p-8 flex flex-col items-center gap-3 shadow-lg">
            <Loader2 className="animate-spin text-accent-blue" size={28} />
            <p className="text-sm text-muted-foreground">
              Loading task detail...
            </p>
          </div>
        </div>
      )}

      <TrajectoryModal
        example={selectedExample}
        open={modalOpen && !modalLoading}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Gallery;
