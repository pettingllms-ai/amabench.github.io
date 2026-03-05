export interface TaskEntry {
  id: number;
  taskType: string;
  domain: string;
  source: string;
  task: string;
  numTurns: number;
  totalTokens: number;
  state: "success" | "fail";
  numQA: number;
  file: string;
}

export async function fetchTasks(): Promise<TaskEntry[]> {
  const res = await fetch("/gallery-tasks.json");
  return res.json();
}

export async function fetchTaskDetail(fileKey: string) {
  const res = await fetch(`/tasks/${fileKey}.json`);
  return res.json();
}
