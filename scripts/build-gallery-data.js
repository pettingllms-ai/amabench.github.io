#!/usr/bin/env node
/**
 * Reads open_end_qa_set.jsonl (50MB) and produces:
 *   1. public/gallery-tasks.json          — lightweight index for the card grid (~70 KB)
 *   2. public/tasks/<taskType>-<id>.json  — individual full-detail files (loaded on click)
 *
 * Run:  node scripts/build-gallery-data.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const INPUT = resolve(ROOT, "data/open_end_qa_set.jsonl");
const OUTPUT_INDEX = resolve(ROOT, "public/gallery-tasks.json");
const OUTPUT_DIR = resolve(ROOT, "public/tasks");

// If the source JSONL is not present (e.g. in CI), skip.
// The pre-built output files are committed to git.
if (!existsSync(INPUT)) {
  if (existsSync(OUTPUT_INDEX)) {
    console.log("Skipping gallery build — source JSONL not found, using committed output files.");
    process.exit(0);
  }
  console.error(`Error: ${INPUT} not found and no pre-built output exists.`);
  process.exit(1);
}

// Map raw domain names to display names
const DOMAIN_DISPLAY = {
  TEXT2SQL: "Text 2 SQL",
  OPENWORLD_QA: "Open World Tool QA",
  WEB: "Web Task Execution",
  Game: "Gaming",
  EMBODIED_AI: "Embodied AI",
  SOFTWARE: "Software Engineering",
};

// Map task_type to source benchmark
const SOURCE_MAP = {
  spider2: "Spider",
  gaia_level1: "GAIA",
  gaia_level2: "GAIA",
  gaia_level3: "GAIA",
  webarena: "WebArena",
  babaisai: "BALROG",
  minihack: "BALROG",
  crafter: "BALROG",
  "2048": "BALROG",
  candy_crush: "BALROG",
  alfworld: "ALFWorld",
  swebench: "SWE-bench",
};

mkdirSync(OUTPUT_DIR, { recursive: true });

const raw = readFileSync(INPUT, "utf-8");
const lines = raw.trim().split("\n");

const index = [];
let totalDetailKB = 0;

for (const line of lines) {
  const d = JSON.parse(line);
  const domain = DOMAIN_DISPLAY[d.domain] || d.domain;
  const source = SOURCE_MAP[d.task_type] || d.task_type;
  const fileKey = `${d.task_type}-${d.episode_id}`;

  // ── Index entry (lightweight) ──
  index.push({
    id: d.episode_id,
    taskType: d.task_type,
    domain,
    source,
    task: d.task.length > 300 ? d.task.slice(0, 300) + "..." : d.task,
    numTurns: d.num_turns,
    totalTokens: d.total_tokens,
    state: d.success ? "success" : "fail",
    numQA: d.qa_pairs ? d.qa_pairs.length : 0,
    file: fileKey,
  });

  // ── Full detail file (normalized to TrajectoryModal format) ──
  const detail = {
    episode_id: String(d.episode_id),
    task: d.task,
    domain,
    num_turns: d.num_turns,
    total_tokens: d.total_tokens,
    state: d.success ? "success" : "fail",
    trajectory: (d.trajectory || []).map((t) => ({
      turn_idx: t.turn_idx ?? 0,
      action: t.action || t.action_name || "—",
      observation: t.observation || t.reasoning || "",
    })),
    qa_pairs: (d.qa_pairs || []).map((q) => ({
      question: q.question,
      answer: q.answer,
      type: q.type || "",
      sub_type: q.sub_type || q.subtype || "",
    })),
  };

  const detailJSON = JSON.stringify(detail);
  writeFileSync(resolve(OUTPUT_DIR, `${fileKey}.json`), detailJSON, "utf-8");
  totalDetailKB += Buffer.byteLength(detailJSON) / 1024;
}

writeFileSync(OUTPUT_INDEX, JSON.stringify(index), "utf-8");

const indexKB = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(1);
console.log(`Index:  ${index.length} tasks → ${OUTPUT_INDEX} (${indexKB} KB)`);
console.log(`Detail: ${index.length} files → ${OUTPUT_DIR}/ (${(totalDetailKB / 1024).toFixed(1)} MB total)`);
