import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import catAlfworld from "@/assets/cat-alfworld.jpg";
import catBalrog from "@/assets/cat-balrog.jpg";
import catWebarena from "@/assets/cat-webarena.jpg";
import catSwebench from "@/assets/cat-swebench.jpg";
import catGaia from "@/assets/cat-gaia.jpg";
import catSpider from "@/assets/cat-spider.jpg";

const categories = [
  {
    name: "ALFWorld-verified",
    desc: "Watch the AI agent navigate and complete household tasks in a text-based virtual environment.",
    image: catAlfworld,
  },
  {
    name: "BALROG / Imgame Bench",
    desc: "Evaluate AI agents playing interactive games requiring strategic decision-making and planning.",
    image: catBalrog,
  },
  {
    name: "WebArena",
    desc: "Test AI agents on realistic web browsing tasks across complex, real-world websites.",
    image: catWebarena,
  },
  {
    name: "SWE-bench",
    desc: "Challenge AI to resolve real GitHub issues from popular open-source Python repositories.",
    image: catSwebench,
  },
  {
    name: "GAIA",
    desc: "Assess multi-step reasoning with web search, document analysis, and tool use.",
    image: catGaia,
  },
  {
    name: "Spider 2.0",
    desc: "Evaluate text-to-SQL generation on complex, cross-database enterprise queries.",
    image: catSpider,
  },
];

const CategoryCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          Benchmark Categories
        </h2>

        <div className="relative">
          {/* Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-6 top-[130px] z-10 w-10 h-10 rounded-full bg-background border border-border shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-6 top-[130px] z-10 w-10 h-10 rounded-full bg-background border border-border shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide py-2 px-1"
          >
            {categories.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 w-[340px] cursor-pointer group">
                <div className="rounded-2xl overflow-hidden bg-card shadow-sm mb-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-[240px] object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-foreground mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
