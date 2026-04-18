import { getSupabaseClient } from "@/lib/supabase";
import { Question, DailyQuestions, NewQuestion } from "@/types";

const TABLE = "questions_471" as const;

// ─── Core queries ────────────────────────────────────────────────────────────

export async function getAllQuestions(): Promise<Question[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select("*")
    .order("year", { ascending: false });

  if (error) throw new Error(`getAllQuestions: ${error.message}`);
  return data ?? [];
}

export async function addQuestion(q: NewQuestion): Promise<void> {
  const { error } = await getSupabaseClient().from(TABLE).insert(q);
  if (error) throw new Error(`addQuestion: ${error.message}`);
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(`deleteQuestion: ${error.message}`);
}

export async function addSolvedQuestion(questionId: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("solved_questions")
    .insert({ question_id: questionId });
  if (error) throw new Error(`addSolvedQuestion: ${error.message}`);
}

export async function getSolvedCount(): Promise<number> {
  const { count, error } = await getSupabaseClient()
    .from("solved_questions")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`getSolvedCount: ${error.message}`);
  return count ?? 0;
}

export async function resetSolvedQuestions(): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("solved_questions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all rows
  if (error) throw new Error(`resetSolvedQuestions: ${error.message}`);
}

export async function getRandomQuestionByTopic(topic: string): Promise<Question | null> {
  // Fetch all rows for the topic, then pick one randomly client-side.
  // Avoids a custom RPC and works well for the expected table size.
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select("*")
    .eq("topic", topic);

  if (error) throw new Error(`getRandomQuestionByTopic: ${error.message}`);
  if (!data || data.length === 0) return null;

  return data[Math.floor(Math.random() * data.length)];
}

export async function getUnsolvedQuestions(): Promise<Question[]> {
  const supabase = getSupabaseClient();

  const [all, { data: solvedRows, error: solvedError }] = await Promise.all([
    getAllQuestions(),
    supabase.from("solved_questions").select("question_id"),
  ]);

  if (solvedError) throw new Error(`getUnsolvedQuestions: ${solvedError.message}`);

  const solvedIds = new Set((solvedRows ?? []).map((r) => r.question_id));
  const unsolved = all.filter((q) => !solvedIds.has(q.id));

  // Interleave: probability → geometry → derivatives → repeat (skip when bucket empty)
  const TOPIC_ORDER = ["probability", "geometry", "derivatives"] as const;
  const buckets: Record<string, Question[]> = { probability: [], geometry: [], derivatives: [] };
  for (const q of unsolved) {
    (buckets[q.topic] ??= []).push(q);
  }

  const result: Question[] = [];
  let slot = 0;
  while (TOPIC_ORDER.some((t) => (buckets[t]?.length ?? 0) > 0)) {
    const topic = TOPIC_ORDER[slot % 3];
    slot++;
    if ((buckets[topic]?.length ?? 0) > 0) result.push(buckets[topic].shift()!);
  }

  return result;
}

export async function getTwoRandomQuestionsDifferentTopics(): Promise<[Question, Question]> {
  const all = await getAllQuestions();
  if (all.length < 2) {
    throw new Error("Not enough questions in the database.");
  }

  // Group questions by topic
  const topicMap = new Map<string, Question[]>();
  for (const q of all) {
    const bucket = topicMap.get(q.topic) ?? [];
    bucket.push(q);
    topicMap.set(q.topic, bucket);
  }

  const topics = Array.from(topicMap.keys());
  if (topics.length < 2) {
    throw new Error("Need at least 2 different topics to return two distinct questions.");
  }

  // Fisher-Yates shuffle to pick two different topics at random
  for (let i = topics.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [topics[i], topics[j]] = [topics[j], topics[i]];
  }

  const pickRandom = (questions: Question[]): Question =>
    questions[Math.floor(Math.random() * questions.length)];

  return [
    pickRandom(topicMap.get(topics[0])!),
    pickRandom(topicMap.get(topics[1])!),
  ];
}

// ─── Deterministic seeded RNG (Mulberry32) ───────────────────────────────────

function dateToSeed(dateStr: string): number {
  // Simple hash of the date string so each calendar day yields different but
  // stable results across all page loads on the same day.
  return dateStr.split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 1);
}

function makeSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Daily questions ──────────────────────────────────────────────────────────

// Pair rotation: 3 pairs × 3 topics, no two consecutive days share a pair.
const TOPIC_PAIRS: [string, string][] = [
  ["probability", "geometry"],
  ["probability", "derivatives"],
  ["geometry",    "derivatives"],
];

const EPOCH = new Date("2025-01-01").getTime();
function dayIndex(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - EPOCH) / 86_400_000);
}

// How many times has a topic been used in days 0..(d-1)?
// probability appears in pairs 0 & 1  (days where d%3 ∈ {0,1})
// geometry    appears in pairs 0 & 2  (days where d%3 ∈ {0,2})
// derivatives appears in pairs 1 & 2  (days where d%3 ∈ {1,2})
function usagesBefore(topic: string, d: number): number {
  const full = Math.floor(d / 3) * 2;
  const r = d % 3;
  if (topic === "probability") return full + Math.min(r, 2);       // r=0→0, r=1→1, r=2→2
  if (topic === "geometry")    return full + (r >= 1 ? 1 : 0);    // r=0→0, r≥1→1 (day 2 adds 1 more via pair 2… wait handled by full)
  if (topic === "derivatives") return full + (r >= 2 ? 1 : 0);
  return 0;
}

// Shuffle a pool once using the topic name as a stable seed, then cycle through it.
function stableShuffled(pool: Question[], topic: string): Question[] {
  const rand = makeSeededRandom(dateToSeed(topic));
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function getTodaysQuestions(): Promise<DailyQuestions> {
  const today = new Date().toISOString().split("T")[0];
  const dIdx  = dayIndex(today);
  const [topicA, topicB] = TOPIC_PAIRS[((dIdx % 3) + 3) % 3];

  const all = await getAllQuestions();

  const pickQuestion = (topic: string): Question => {
    const pool = all.filter((q) => q.topic === topic);
    if (pool.length === 0) throw new Error(`No questions for topic: ${topic}`);
    const shuffled = stableShuffled(pool, topic);
    return shuffled[usagesBefore(topic, dIdx) % shuffled.length];
  };

  return {
    date: today,
    questions: [pickQuestion(topicA), pickQuestion(topicB)],
  };
}
