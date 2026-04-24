/**
 * Action verb dictionary for the Action Verb Engine.
 * From PLAN.md: strong vs weak verb detection.
 */
export const strongVerbs = [
  "achieved", "built", "created", "delivered", "designed", "developed",
  "drove", "engineered", "established", "executed", "expanded",
  "generated", "implemented", "improved", "increased", "initiated",
  "integrated", "launched", "led", "managed", "modernized",
  "optimized", "orchestrated", "pioneered", "produced", "reduced",
  "redesigned", "resolved", "revamped", "scaled", "shipped",
  "spearheaded", "streamlined", "transformed", "upgraded",
  "architected", "automated", "collaborated", "consolidated",
  "customized", "debugged", "deployed", "diagnosed", "eliminated",
  "enhanced", "facilitated", "formulated", "mentored", "migrated",
  "negotiated", "overhauled", "refactored", "restructured",
  "secured", "simplified", "solved", "supervised", "tripled",
  "doubled", "quadrupled",
];

export const weakVerbs = [
  "worked", "helped", "did", "was", "had", "got", "made",
  "used", "tried", "went", "knew", "saw", "came", "took",
  "looked", "wanted", "gave", "thought", "told", "found",
  "put", "ran", "said", "asked", "needed", "kept", "started",
  "involved", "participated", "assisted", "contributed",
  "responsible", "tasked", "handled", "supported", "maintained",
];

/**
 * Suggest a strong verb replacement for a weak verb.
 */
export const verbReplacements = {
  worked: ["developed", "built", "engineered"],
  helped: ["facilitated", "enabled", "supported"],
  did: ["executed", "completed", "delivered"],
  was: ["served as", "functioned as"],
  made: ["created", "designed", "produced"],
  used: ["leveraged", "utilized", "employed"],
  tried: ["experimented with", "explored", "tested"],
  handled: ["managed", "oversaw", "coordinated"],
  responsible: ["owned", "led", "spearheaded"],
  maintained: ["sustained", "preserved", "optimized"],
  assisted: ["supported", "collaborated on", "contributed to"],
  participated: ["engaged in", "contributed to", "collaborated on"],
};
