const promptTemplates = [
  `RESPONSE STYLE
- Short paragraphs + bullet points only.
- No long essays.
- Each subsection: max 6–8 bullets.
- Concrete, prescriptive.

TASK
Analyze ONLY Reference Script 1 (ignore timestamps) and extract its style/structure/rhythm DNA.
Output a reusable “Custom Style & Structure Guide” enabling ≥80–90% perceived similarity.
Do NOT: write a new story, plot-summarize for its own sake, ask questions.

REFERENCE SCRIPT 1
[REFERENCE_SCRIPT_START]
[TEST1FORPROMPT1]
[REFERENCE_SCRIPT_END]

STEP 1 — GLOBAL SNAPSHOT (max 6–8 bullets)
- Niche/sub-niche
- Implied audience (age, knowledge, emotional need)
- Purpose blend (warn/shock/comfort/instruct/inspire/entertain)
- Mood band

STEP 2 — WORD COUNT & MACRO STRUCTURE
2.1 Baseline word count
- If [REFERENCE_WORD_COUNT] is a number: set X=[REFERENCE_WORD_COUNT].
- If [REFERENCE_WORD_COUNT]="auto": estimate cleaned narration word count; set X=estimate.
- Output EXACT line:
  Reference Script 1 Estimated Total Word Count: ~[X words]
- Future scripts: Hook fixed ≈100 words (90–110). Remaining (X−100) across 4 acts.

2.2 Hook + 4 Acts
For Hook + Act I–IV, output (each):
- Function (1 line)
- Approx % of total
- Approx words
- Dominant emotion

STEP 3 — VOICE & ENGAGEMENT
3.1 Voice & Emotion (max 6 bullets)
3.2 Narrator Persona (max 6 bullets)
3.3 Engagement Mechanics (max 6–8 bullets)
End Step 3 with a 3–5 sentence “Voice Profile” paragraph (how they sound; how it feels to listen).

STEP 4 — MICRO-STYLE (sentences/paragraphs/evidence)
4.1 Sentences & Rhythm (max 6–8 bullets)
4.2 Paragraphs (max 4–6 bullets)
4.3 Word Choice / Imagery / Evidence (max 6–10 bullets)

STEP 5 — CUSTOM STYLE & STRUCTURE GUIDE (FINAL)
Headings + bullets only (except 1 short Voice Profile paragraph).
Include sections:

VOICE PROFILE
- 1 short paragraph
- 3–6 bullets (who speaks, closeness, read-aloud sound)

STRUCTURAL BLUEPRINT (Hook + 4 Acts)
- Hook ≈100 words (90–110) fixed; remaining words split across Act I–IV.
- For each part: role, typical content, approx share/words, tension growth.

SENTENCE & PARAGRAPH BLUEPRINT
- 6–10 abstract sentence patterns
- Rules for average length, short punches, one-line paragraphs

WORD & EVIDENCE RULES
- Register, sensory detail, metaphors allowed
- What breaks illusion (slang/memes/meta-YouTube)
- Frequency of numbers/dates/names/quotes + typical attribution phrases

PACING & SIGNATURE ELEMENTS
- How to alternate scenes vs data; calm vs shock; questions vs answers
- Where peaks sit (usually Act II–III)
- 5–10 signature traits

REPLICATION TEST
- “Drop-in Test” description
- State: similarity should feel ≥80–90%

FINAL LINES (MANDATORY)
Reference Script 1 Estimated Total Word Count: ~[X words]
Use this as the default total word-count target for future scripts in this style (unless the user explicitly overrides it).`,
  `RESPONSE STYLE
Short paragraphs + bullets. Compact, practical.

LANGUAGE
Use [TARGET_LANGUAGE]. If [TARGET_LANGUAGE]="auto", use the user’s/main language only. Do not switch.

ROLE
You are the SAME model that produced the Prompt 1 Style Guide. Use it as the ONLY style authority.
Do NOT re-analyze the reference or invent a new style.

INPUTS
New video title: [TEST1FORPROMPT2]
Target total word count: [TEST1FORPROMPT3]

SET TOTAL_USER (HARD)
- If [TARGET_WORD_COUNT]="auto": TOTAL_USER = X from Prompt 1 final line.
- If numeric: TOTAL_USER = [TARGET_WORD_COUNT].

LOCKED WORDCOUNT TARGETS (HARD)
- HOOK_TARGET = 100 (EXACT)
- BODY_USER = max(TOTAL_USER - HOOK_TARGET, 0)

COMPUTE [SECTIONS_COUNT] (body only; do NOT ask user)
Goal: fewer sections, still reliable in Claude Sonnet 4.5.
- TARGET_SECTION_SIZE (words):
  - If TOTAL_USER <= 2000: 900
  - Else if TOTAL_USER <= 4500: 1100
  - Else if TOTAL_USER <= 8000: 1350
  - Else if TOTAL_USER <= 12000: 1500
  - Else if TOTAL_USER <= 18000: 1700
  - Else: 1900
- [SECTIONS_COUNT] = ceil(BODY_USER / TARGET_SECTION_SIZE)
- Clamp: minimum 1, maximum 10

ACT TARGETS (structure only)
- Act I target ≈ round(BODY_USER / 4)
- Act II target ≈ round(BODY_USER / 4)
- Act III target ≈ round(BODY_USER / 4)
- Act IV target ≈ BODY_USER - (Act I + Act II + Act III)

SECTION TARGETS (EXACT, HARD)
Compute exact per-section word targets so the full script lands EXACTLY on TOTAL_USER:
- SECTION_BASE = floor(BODY_USER / [SECTIONS_COUNT])
- REMAINDER = BODY_USER - (SECTION_BASE * [SECTIONS_COUNT])

For each section k = 1..[SECTIONS_COUNT]:
- If k <= REMAINDER:
  Sk_TARGET = SECTION_BASE + 1
- Else:
  Sk_TARGET = SECTION_BASE

Hard rules for Prompt 3:
- Hook variants: exactly 100 words each.
- Each section k: exactly Sk_TARGET words (EXACT).
- No ranges. No “approx”.

TOP SUMMARY (output these lines first)
Target script total requested by user: [TOTAL_USER words] (EXACT)
Hook target: 100 words (EXACT)
Body target (without hooks): [BODY_USER words] (EXACT)
Number of sections (body only): [SECTIONS_COUNT]
Act I target: ~[A1 words]
Act II target: ~[A2 words]
Act III target: ~[A3 words]
Act IV target: ~[A4 words]

STEP 1 — ACT-LEVEL OVERVIEW
For Hook + Act I–IV: 4–6 bullets each (function, emotion, typical start/end, what must be established).

STEP 2 — KEY BEATS BY PART
For Hook + Act I–IV: 5–10 bullets each (mystery/contradiction, escalation, reveals, evidence style, closing aftertaste).

SECTION PLAN FOR PROMPT 3 (MUST include exact targets)
For each Section k=1..[SECTIONS_COUNT], output:
- Exact target: [Sk_TARGET] words (EXACT)
- Act focus (e.g., late Act I + early Act II)
- MUST cover beats (2–5 bullets)
- MUST NOT do yet (no full resolution except final section)

STEP 3 — SHORT STYLE CHECKLIST (for Prompt 3)
- Voice
- Rhythm
- Word choice bans
- Evidence density + attribution phrases
- Pacing/peaks
- 5–8 signature traits that MUST appear`,
  `OUTPUT FORMAT
- Output ONLY narrative script text + the fixed English labels below.
- No headings, bullets, or “Act/Chapter” labels.
- Start immediately with story text (no meta/openers like “Here is…”).

FIXED ENGLISH LINES
Hook variant 1
Hook variant 2
Hook variant 3
Section [BLOCK_ID] of [SECTIONS_COUNT]
Story Complete

Input: [BLOCK_ID] = BLOCK_HOOK]

LANGUAGE
- Input: [TARGET_LANGUAGE] = [TEST2FORPROMPT3]
- If missing/empty/undefined/"auto": set [TARGET_LANGUAGE]="English".
- If explicitly set: write ALL story text (hooks/sections) in exactly [TARGET_LANGUAGE].
- Never ask the user about language.

ROLE
You are the SAME model that made: Prompt 1 Style Guide + Prompt 2 Outline/Section Plan.
Use them as the ONLY authority. Do NOT re-analyze reference. Do NOT ask for any inputs.
Assume TOTAL_USER, BODY_USER, SECTIONS_COUNT, and each section’s Sk_TARGET exist from Prompt 2.

DEFINITIONS (HARD)
- Command "HOOKS" means: generate 3 hook variants ONLY (no sections).
- Command "block k" / "section k" / "BLOCK_ID=k" / "k" means: generate Section k ONLY.
- Command "block a-b" / "section a-b" / "BLOCK_ID=a-b" / "a-b" means: generate Sections a..b ONLY (range mode).
- Hook variants (1/2/3) are NOT sections and MUST NEVER be treated as section numbers.

STATELESS NUMBERING (HARD)
- Do NOT track progress or auto-advance section numbers.
- The ONLY source of truth is the last user command message.

CONTROL INPUT PARSING (HARD)
Treat the LAST user message as the control command.
IMPORTANT: If it contains extra text, ignore everything except a valid control pattern below.

1) RANGE MODE (highest priority)
- If the last message contains a valid range command:
  "block a-b" OR "section a-b" OR "BLOCK_ID=a-b" OR just "a-b"
  where a and b are integers, a<=b, and both in 1..[SECTIONS_COUNT],
  then set START=a and END=b → RANGE MODE.

2) SECTION MODE
- Else, if the last message contains a valid section command:
  "block k" OR "section k" OR "BLOCK_ID=k"
  where k is an integer in 1..[SECTIONS_COUNT],
  then set K=k → SECTION MODE.
- Else, if the entire last message is exactly an integer k in 1..[SECTIONS_COUNT],
  then set K=k → SECTION MODE.

3) HOOKS MODE
- Else, if the last message contains the standalone token "HOOKS" (case-insensitive),
  set MODE=HOOKS.

4) DEFAULT (NO QUESTIONS)
- If none match, default to HOOKS MODE.

ABSOLUTE SINGLE-MODE RULE (HARD)
In ONE answer:
- HOOKS MODE: output exactly 3 hooks and STOP.
- SECTION MODE: output exactly 1 section and STOP.
- RANGE MODE: output sections START..END only (no hooks) and STOP.
No explanations, no questions, no onboarding, no system talk.

BANNED OUTPUT (HARD)
You MUST NEVER output:
- Any questions
- Any instructions like “Please provide BLOCK_ID…”
- Any meta commentary (no “I’m ready…”, no “I will…”)
If uncertain, follow DEFAULT and generate HOOKS.

HOOKS MODE (EXACT)
Generate 3 alternative hook variants for the SAME underlying story.
WORD COUNT (HARD, EXACT):
- Each hook variant MUST be exactly 100 words.
OUTPUT ORDER (exactly this order):
(hook narrative)
Hook variant 1
(hook narrative)
Hook variant 2
(hook narrative)
Hook variant 3
Then STOP immediately. Do NOT generate sections.

SECTION / RANGE MODES (HARD GUARDRAILS)
- No hooks in Section/Range modes.
- Do NOT output: "Hook variant 1/2/3".
- Do NOT repeat the hook. Section 1 starts AFTER the hook.

WORD COUNT ENFORCEMENT (HARD, INTERNAL)
Word counting rule: split on spaces; numbers count as one word; hyphenated counts as one.
Do NOT include the final label line in the word count.

For any section k:
- Read Sk_TARGET(k) from Prompt 2 output for that section.
- Draft to ~92–95% of Sk_TARGET(k) first (do NOT exceed Sk_TARGET yet).
- Add short micro-detail sentences to land EXACTLY on Sk_TARGET(k).
- If you exceed Sk_TARGET(k), delete full sentences ONLY from the end until EXACT.

FINAL SECTION TOTAL-LOCK (HARD)
If generating the FINAL section (k = [SECTIONS_COUNT]):
- Internally count narrative words in ALL previously generated sections 1..k-1 in this chat.
- Set FINAL_TARGET = BODY_USER - WORDS_PREVIOUS_SECTIONS.
- Use FINAL_TARGET (EXACT) instead of Sk_TARGET(k) if there is any drift.
- Enforce EXACT on the final section.

SECTION MODE OUTPUT
- Generate exactly ONE section: Section K.
- After the narrative text, output on a new line:
Section K of [SECTIONS_COUNT]
- If K = [SECTIONS_COUNT], then add on the next line:
Story Complete
Then STOP.

RANGE MODE OUTPUT
- Generate sections START..END in order.
- Hard cap for stability: generate at most 2 sections per answer if Sk_TARGET(START) >= 1400, otherwise at most 3.
  If the requested range exceeds the cap, silently reduce END to fit the cap.
- After each section narrative, output its label line:
Section k of [SECTIONS_COUNT]
- If the last generated k equals [SECTIONS_COUNT], add:
Story Complete
Then STOP.

CUT-OFF CONTINUATION (HARD)
If the previous answer was cut off mid-section (no "Section k of N" label yet) and the user writes "continue":
- Continue the SAME current section immediately (no repeats, no hooks).
- Finish it to the EXACT target, then output the label line and STOP.`,
  `RESPONSE STYLE
- Diagnostic: short paragraphs + bullets.
- Rewrite: ONLY narrative script text + fixed English labels/questions (no bullets/headings/meta).
- Post-analysis: short paragraphs + bullets.

LANGUAGE CONTROL
Use the SAME dominant language as the current draft produced by Prompt 3 (detect once; never switch).
ONLY allowed English lines:
- “Should I rewrite the story to increase structural similarity to the reference? (Yes/No)”
- “Continue with Section k of N? (Yes/No)”
- “Would you like me to analyze the rewritten story, explain what I changed, and estimate the new structural similarity to the reference? (Yes/No)”
- Hook variant 1/2/3
- Section [BLOCK_ID] of [SECTIONS_COUNT]
- Story Complete

ROLE
You are the SAME model that made Prompt 1–3. Use the existing guide/outline/section plan; do NOT re-invent style.

CURRENT DRAFT (internal)
Find the most recent Prompt 3 outputs in this chat:
- 3 hooks labeled Hook variant 1/2/3
- Sections labeled “Section k of N” (ordered by k)
Reconstruct full draft = hooks + all available sections.
If none found: output a short message (story language) saying Prompt 3 must be run first, then STOP.

MODE SELECTION
- If user has NOT answered the rewrite question → DIAGNOSTIC MODE.
- If your last message ended with the rewrite question and user said “Yes” → REWRITE MODE.
- If your last message ended with the post-analysis question and user said “Yes” → POST-ANALYSIS MODE.
If output was cut off and user says “continue/продолжай/keep going”: stay in the SAME mode and continue from where you stopped (no restarts/repeats).

DIAGNOSTIC MODE
Internal: compare draft vs Prompt 1 Style Guide + Prompt 2 Outline/Section Plan; estimate similarity ~[X]%.
Output (story language) with headings + bullets:
- STYLE SIMILARITY DIAGNOSTIC: ~[X]%
- Main strengths (2–4)
- Main structural mismatches/risks (3–6)
- Phase notes: Opening/Hooks; Middle; Ending (bullets)
End with EXACT English line:
Should I rewrite the story to increase structural similarity to the reference? (Yes/No)
Do NOT rewrite in this mode.

REWRITE MODE (stepwise)
Goal: ≥85–90% structural style similarity, without changing core story events.
Length constraints (internal):
- OLD_TOTAL ≈ current draft words
- New total must be within round(OLD_TOTAL*0.97) .. round(OLD_TOTAL*1.03)
Per-section constraints:
- For each original Section k word count OLD_k:
  rewritten section must be within round(OLD_k*0.95) .. round(OLD_k*1.05)
Hooks should remain 90–110 words.

What you MAY change: phrasing/rhythm, minor beat order within a section, evidence placement, small clarity/pacing details.
You MUST NOT: change core events/characters, genre, or factual consistency; copy reference sentences.

Stage 1 (first rewrite-mode message): rewrite all 3 hooks (story language), each followed by its English label line.
Then ask EXACT English line:
Continue with Section 1 of N? (Yes/No)

Stage 2 (for each Section k when user answers Yes):
Output ONLY rewritten Section k narrative, then:
Section k of N
If k < N, ask:
Continue with Section [k+1] of N? (Yes/No)
If user answers No: acknowledge in story language and STOP rewriting.

Stage 3 (final Section N):
After rewritten narrative:
Section N of N
Story Complete
Then ask EXACT English line:
Would you like me to analyze the rewritten story, explain what I changed, and estimate the new structural similarity to the reference? (Yes/No)

POST-ANALYSIS MODE
Internal: compare original vs rewritten vs guide/outline; estimate ~[Y]%.
Output (story language) with headings + bullets:
- STYLE ANALYSIS OF REWRITTEN STORY: ~[Y]%
- Main changes applied (3–6)
- Improvements vs original (3–6)
- Remaining minor differences (optional 2–4)
No further questions unless user asks.`,
  `ROLE
You are a professional YouTube SEO expert specializing in high-CTR titles, cinematic storytelling descriptions, and keyword-rich tags for educational videos.

INPUT CONTROL
TARGET_LANGUAGE: [TEST1FORPROMPT5]
- If empty or "auto" → use the language of the script
- If specified → ALL outputs MUST be in this language

TASK
Use the MOST RECENT completed script in this chat (including the selected hook and all sections) as your input.

Generate:

1. 3 HIGH-CTR YouTube titles
2. 1 cinematic storytelling YouTube description
3. YouTube tags (15–20 tags)

RULES

TITLES
- MUST be between 60–80 characters (STRICT)
- Must be emotionally engaging and curiosity-driven
- Use power words (secret, hidden, discovered, truth, shocking, unexplained, etc.)
- Keep titles natural (NOT spammy)
- Do NOT copy the original title

DESCRIPTION (VERY IMPORTANT — STRICT STYLE)

Write the description EXACTLY in this structure:

1. OPENING HOOK (2–3 lines)
- Start with a strong, curiosity-driven statement
- Create intrigue immediately

2. MAIN EXPLANATION (2–3 short paragraphs)
- Explain the topic in a storytelling way
- Add historical, scientific, or mysterious elements
- Keep it engaging, NOT robotic

3. EXPANSION / DETAILS (1–2 paragraphs)
- Add deeper insights, examples, or surprising facts
- Build intensity and curiosity

4. BIG QUESTION (1 line)
- End with a philosophical or intriguing question

5. CTA (1 line)
- Example: 👉 Watch until the end for the final answer.

6. TIMESTAMPS (if applicable)
Format:
0:00 – ...
2:15 – ...

STYLE RULES
- Use short paragraphs
- Keep it cinematic and engaging
- Avoid boring SEO stuffing
- Write like a documentary narrator
- NO hashtags inside description body

TAGS
- MUST be 15–20 tags
- TOTAL length MUST be close to 500 characters (450–500 ideal)
- Must be relevant
- Mix short + long keywords
- No repetition
- NO hashtags
- FORMAT MUST BE EXACTLY:
  tag1,tag2,tag3,tag4,tag5

IMPORTANT
- Do NOT ask for the script
- Do NOT summarize separately
- Do NOT explain anything
- Output ONLY the final result

OUTPUT FORMAT

TITLES:
1.
2.
3.

DESCRIPTION:
[Write in the exact storytelling format above]

TAGS:
tag1,tag2,tag3,tag4,tag5`
];

const constraint = `one image only; landscape or portrait composition; perfectly level; straight-on framing (no tilt/warp/keystone); multi-generation archival reproduction anchor: rephotographed old printed photo / microfilm photocopy / worn album print (not a modern digital photo); no readable text/logos/icons/overlays/watermarks; if any writing exists it must be completely illegible smudges (zero readable characters); ONLY micro-thin beige side strips left/right; no top/bottom border; strips contain no image content; no blur-fill; no mirrored sides; no duplicated/extended background; very faded warm sepia with FADE LOCK: washed-out, very low contrast, matte; lifted blacks; grayish highlights (no bright whites); absolutely no deep blacks; patchy sun-bleach; uneven exposure; milky chemical fog haze; flat tonal range (NOT dark); coarse halftone dot screen across entire photo area + strong dot gain/ink bleed (printed look, not blurry); irregular big clumpy grain (large clumps) + paper fiber texture; heavy damage stack: dense dust/dirt flecks, many long scratches/scuffs, stains/blotches; water marks; grime patches; foxing; emulsion cracking/crazing; banding/posterization; mild print smear/ink spread; repro/photocopy loss artifacts WITHOUT heavy blur; slight ghosting/double-impression; roller streaks; chemical fogging; ringing/halation; subtle macroblocking/mosquito noise; muddy micro-detail; minimal blur only: slight softness at most; motion blur extremely subtle and MUST NOT hit faces; FACE CLARITY LOCK: faces readable (structure visible-eyes/nose/mouth placement), not smeared, not blobbed, not melted; anti-AI look: no HDR, no modern sharpness, no clean gradients, no glossy skin, no cinematic grading, no bokeh, no perfect symmetry; subtly eerie documentary mood (no gore); prefer a posed/held-still moment so faces remain readable`;

const pbRef = document.getElementById("pb-reference");
const pbWords = document.getElementById("pb-words");
const pbLang = document.getElementById("pb-language");
const pbLanguageSelect = document.getElementById("pb-language-select");
const pbLanguageTrigger = document.getElementById("pb-language-trigger");
const pbLanguageValue = document.getElementById("pb-language-value");
const pbLanguageDropdown = document.getElementById("pb-language-dropdown");
const pbLanguageList = document.getElementById("pb-language-list");
const pbLanguageCustom = document.getElementById("pb-language-custom");
const pbLanguageAdd = document.getElementById("pb-language-add");
const pbGenerate = document.getElementById("pb-generate");
const pbClear = document.getElementById("pb-clear");
const pbStatus = document.getElementById("pb-status");
const pbTabs = Array.from(document.querySelectorAll("#pb-tabs .segmented-tab"));
const pbPromptSettingsToggle = document.getElementById("pb-prompt-settings-toggle");
const pbPromptSettingsPanel = document.getElementById("pb-prompt-settings-panel");
const pbReferencePanel = document.getElementById("pb-reference-panel");
const pbPromptsPanel = document.getElementById("pb-prompts-panel");
const pbOutput = document.getElementById("pb-output");
const workflowFrame = document.getElementById("workflow-embed-frame");
const heroPanel = document.querySelector(".hero-panel");
const toolOneSection = document.getElementById("tool-1");
const toolTwoSection = document.getElementById("tool-2");

const jsonInput = document.getElementById("json-input");
const srtOutput = document.getElementById("srt-output");
const promptsOutput = document.getElementById("prompts-output");
const promptsCopy = document.getElementById("prompts-copy");
const promptPresetBadge = document.getElementById("prompt-preset-badge");
const promptPresetSettings = document.getElementById("prompt-preset-settings");
const promptPresetModal = document.getElementById("prompt-preset-modal");
const promptPresetClose = document.getElementById("prompt-preset-close");
const promptPresetList = document.getElementById("prompt-preset-list");
const promptPresetName = document.getElementById("prompt-preset-name");
const promptPresetText = document.getElementById("prompt-preset-text");
const promptPresetSave = document.getElementById("prompt-preset-save");
const presetDeleteConfirm = document.getElementById("preset-delete-confirm");
const presetDeleteText = document.getElementById("preset-delete-text");
const presetDeleteCancel = document.getElementById("preset-delete-cancel");
const presetDeleteConfirmBtn = document.getElementById("preset-delete-confirm-btn");
const srtGenerate = document.getElementById("srt-generate");
const srtDownload = document.getElementById("srt-download");
const srtClear = document.getElementById("srt-clear");
const srtStatus = document.getElementById("srt-status");

const themeToggle = document.getElementById("theme-toggle");
const themeToggleLabel = document.getElementById("theme-toggle-label");
const topbar = document.querySelector(".topbar");
const promptBuilderHeading = document.querySelector("#tool-1 .section-heading h2");
const topbarLinks = Array.from(document.querySelectorAll(".topbar-link"));
const glowButtons = Array.from(document.querySelectorAll(".glow-button"));
const PROMPT_PRESET_STORAGE_KEY = "kamili-image-prompt-presets";
const ACTIVE_PROMPT_PRESET_STORAGE_KEY = "kamili-image-prompt-preset-active";
const APP_DRAFT_STORAGE_KEY = "kamili-studio-draft-state-v1";
const DEFAULT_LANGUAGES = ["English", "Arabic", "French", "German", "Russian", "Italian"];
const WORKFLOW_PROMPT_SHELL_STYLE_ID = "workflow-prompt-shell-styles";
const WORKFLOW_PROMPT_SHELL_CSS = `
#workflow-unified-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
}

.workflow-unified-card {
  min-height: 0;
}

.workflow-youtube-card {
  align-self: flex-start;
  width: min(calc(388px + 7ch), 100%);
}

.workflow-embedded-prompt-shell {
  margin: 0 !important;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015));
}

.workflow-embedded-prompt-shell .tabs-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.workflow-embedded-prompt-shell .tabs-head-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.workflow-embedded-prompt-shell .label {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.workflow-embedded-prompt-shell .tabs-hint {
  color: var(--muted);
  font-size: 13px;
}

.workflow-embedded-prompt-shell .tabs-head {
  overflow: visible;
}

.workflow-embedded-prompt-shell .segmented-shell {
  position: relative;
}

.workflow-embedded-prompt-shell .prompt-banner-params {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline {
  margin-left: auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 6px;
  overflow: visible;
  z-index: 4;
}

.workflow-embedded-prompt-shell .prompt-param {
  min-width: 0;
  padding: 5px 10px 4px;
  border: 1px solid var(--field-border);
  border-radius: 14px;
  background: var(--field-bg);
  box-shadow: var(--field-shadow);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param {
  min-height: 26px;
  padding: 1px 6px;
  border-radius: 10px;
  justify-content: center;
  overflow: visible;
  border-color: rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.018)),
    rgba(7, 10, 18, 0.92);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 8px 18px rgba(0, 0, 0, 0.18);
}

.workflow-embedded-prompt-shell .prompt-param-top {
  display: none;
}

.workflow-embedded-prompt-shell .prompt-param-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
  color: var(--muted);
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param-label {
  display: none;
}

.workflow-embedded-prompt-shell .prompt-param-icon {
  display: none;
}

.workflow-embedded-prompt-shell .prompt-param-icon svg {
  display: none;
}

.workflow-embedded-prompt-shell .prompt-param-input {
  min-height: 20px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  font-size: 10px;
  font-weight: 650;
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-align: center;
}

.workflow-embedded-prompt-shell .prompt-param-words {
  width: 92px;
  min-width: 92px;
}

.workflow-embedded-prompt-shell .prompt-param-language {
  width: 92px;
  min-width: 92px;
  position: relative;
  z-index: 10;
}

.workflow-embedded-prompt-shell .prompt-param-input:focus {
  transform: none;
  border-color: transparent;
  box-shadow: none;
}

.workflow-embedded-prompt-shell .language-select-compact {
  width: 100%;
}

.workflow-embedded-prompt-shell .language-trigger-compact {
  min-height: 14px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 10px;
  font-weight: 650;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param-input,
.workflow-embedded-prompt-shell .prompt-banner-params-inline .language-trigger-compact {
  min-height: 14px;
  font-size: 10px;
  line-height: 1;
  text-align: center;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param-input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param-input[type="number"]::-webkit-outer-spin-button,
.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.workflow-embedded-prompt-shell .language-trigger-compact:hover,
.workflow-embedded-prompt-shell .language-select-compact.is-open .language-trigger-compact {
  transform: none;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.workflow-embedded-prompt-shell .language-select-compact.is-open .language-caret {
  border-color: transparent;
  transform: translateY(-50%);
}

.workflow-embedded-prompt-shell .prompt-param-language .language-caret {
  display: none;
}

.workflow-embedded-prompt-shell .language-trigger-compact #pb-language-value,
.workflow-embedded-prompt-shell .language-trigger-compact span:first-child {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  pointer-events: none;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .prompt-param-language .language-trigger-compact {
  padding-right: 0;
  padding-left: 0;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline #pb-language-value {
  display: block;
  width: auto;
  text-align: center;
}

.workflow-embedded-prompt-shell .prompt-param-language .language-dropdown {
  width: 258px;
  min-width: 258px;
  max-width: min(300px, calc(100vw - 40px));
  left: auto;
  right: 0;
  z-index: 30;
  padding: 12px;
  border-radius: 20px;
}

.workflow-embedded-prompt-shell .language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(28, 28, 34, 0.98), rgba(18, 18, 24, 0.98));
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(18px);
}

.workflow-embedded-prompt-shell .language-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 180px;
  overflow: auto;
  padding-right: 4px;
}

.workflow-embedded-prompt-shell .language-option {
  width: 100%;
  min-height: 42px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 16px;
  background: transparent;
  color: var(--muted-strong);
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.workflow-embedded-prompt-shell .language-option:hover {
  transform: translateY(-1px);
  border-color: var(--line);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.workflow-embedded-prompt-shell .language-option.is-active {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.workflow-embedded-prompt-shell .language-custom {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .language-custom {
  flex-direction: column;
  align-items: stretch;
}

.workflow-embedded-prompt-shell .language-custom input {
  flex: 1;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 16px;
}

.workflow-embedded-prompt-shell .prompt-banner-params-inline .language-custom input,
.workflow-embedded-prompt-shell .prompt-banner-params-inline .secondary-button-compact {
  width: 100%;
}

.workflow-embedded-prompt-shell .secondary-button-compact {
  min-width: 78px;
  height: 44px;
  padding: 0 14px;
  border-radius: 16px;
}

.workflow-embedded-prompt-shell .prompt-settings-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 12;
  width: min(292px, calc(100vw - 64px));
  padding: 10px;
  border: 1px solid var(--field-border);
  border-radius: 18px;
  background: var(--field-bg-active);
  box-shadow: var(--field-shadow-focus);
  backdrop-filter: blur(18px);
}

.workflow-embedded-prompt-shell .prompt-settings-panel[hidden] {
  display: none;
}

.workflow-embedded-prompt-shell .segmented-control {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.workflow-embedded-prompt-shell .segmented-control::-webkit-scrollbar {
  display: none;
}

.workflow-embedded-prompt-shell .segmented-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 40px;
  box-sizing: border-box;
  border: none;
  border-radius: 999px;
  padding: 11px 16px;
  line-height: 1;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.workflow-embedded-prompt-shell .segmented-tab:hover {
  transform: translateY(-1px);
  color: var(--muted-strong);
  background: rgba(255, 255, 255, 0.06);
}

.workflow-embedded-prompt-shell .segmented-tab.active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(221, 0, 0, 0.88), rgba(255, 98, 98, 0.85));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 8px 18px rgba(221, 0, 0, 0.2);
}

.workflow-embedded-prompt-shell .segmented-tab.is-ready {
  color: #d9efff;
}

.workflow-embedded-prompt-shell .segmented-tab.active.is-ready {
  background: linear-gradient(135deg, #73b9ff 0%, #58a9ff 52%, #67cbff 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 8px 18px rgba(82, 184, 255, 0.22);
}

.workflow-embedded-prompt-shell .segmented-tab.active:hover,
.workflow-embedded-prompt-shell .segmented-tab.active.is-ready:hover {
  transform: translateY(0);
}

.workflow-embedded-prompt-shell .segmented-tab.is-locked {
  opacity: 0.72;
  color: rgba(212, 212, 216, 0.78);
}

.workflow-embedded-prompt-shell .segmented-icon-button {
  margin-left: auto;
  flex: 0 0 auto;
  width: 40px;
  min-width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.workflow-embedded-prompt-shell .segmented-icon-button svg {
  width: 16px;
  height: 16px;
}

.workflow-embedded-prompt-shell .segmented-icon-button:hover {
  transform: translateY(-1px);
  color: var(--muted-strong);
  border-color: var(--line-strong);
  background: rgba(255, 255, 255, 0.08);
}

.workflow-embedded-prompt-shell .segmented-icon-button.is-copied {
  color: #ffffff;
  border-color: rgba(126, 243, 207, 0.32);
  background: linear-gradient(135deg, rgba(126, 243, 207, 0.22), rgba(72, 215, 178, 0.18));
  box-shadow: 0 10px 20px rgba(72, 215, 178, 0.16);
}

.workflow-embedded-prompt-shell .segmented-icon-button.is-active {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.09);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
}

.workflow-embedded-prompt-shell .segmented-tab.is-copied {
  color: #062f28;
  background: linear-gradient(135deg, rgba(126, 243, 207, 0.98), rgba(72, 215, 178, 0.95));
  box-shadow: 0 12px 24px rgba(72, 215, 178, 0.22);
}

.workflow-embedded-prompt-shell .segmented-tab.is-copied::after {
  content: "\\2713";
  position: absolute;
  top: -4px;
  right: -2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid rgba(126, 243, 207, 0.24);
  background: rgba(126, 243, 207, 0.18);
  color: #8ef0d8;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.workflow-embedded-prompt-shell .segmented-tab.active.is-copied::after {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.24);
  color: #ffffff;
}

.workflow-embedded-prompt-shell .prompt-tab-panel {
  display: none;
  margin-top: 14px;
}

.workflow-embedded-prompt-shell .prompt-tab-panel.is-active {
  display: block;
}

.workflow-embedded-prompt-shell .output-editor,
.workflow-embedded-prompt-shell .prompt-builder-reference {
  height: 320px;
  min-height: 320px;
  max-height: 320px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid var(--field-border);
  border-radius: 18px;
  background: var(--field-bg);
  color: var(--text);
  font-family: "Inter", system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.72;
  letter-spacing: 0.003em;
  box-shadow: var(--field-shadow);
}

.workflow-embedded-prompt-shell .prompt-builder-reference {
  resize: none;
}

.workflow-embedded-prompt-shell .output-editor {
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.workflow-embedded-prompt-shell .output-editor:focus,
.workflow-embedded-prompt-shell .prompt-builder-reference:focus {
  outline: none;
  border-color: var(--field-border-focus);
  background: var(--field-bg-active);
  box-shadow: var(--field-shadow-focus);
  transform: none;
}

.workflow-embedded-prompt-shell .output-editor:empty::before {
  content: attr(data-placeholder);
  color: rgba(161, 161, 170, 0.82);
}

.workflow-embedded-prompt-shell .prompt-token {
  color: #52b8ff;
  font-weight: 600;
}

.workflow-embedded-prompt-shell textarea::placeholder {
  color: rgba(161, 161, 170, 0.82);
}

@media (max-width: 720px) {
  .workflow-embedded-prompt-shell .tabs-head {
    flex-direction: column;
    align-items: stretch;
  }

  .workflow-embedded-prompt-shell .prompt-banner-params {
    width: 100%;
  }

  .workflow-embedded-prompt-shell .prompt-settings-panel {
    position: static;
    width: 100%;
    margin-top: 10px;
  }

  .workflow-embedded-prompt-shell .prompt-param {
    flex: 1 1 auto;
  }

  .workflow-embedded-prompt-shell .segmented-icon-button {
    margin-left: 0;
  }

  .workflow-embedded-prompt-shell .prompt-banner-params-inline {
    margin-left: 0;
    flex-direction: column;
    flex-wrap: wrap;
  }
}
`;

let promptData = Array(5).fill("");
let promptCopiedState = Array(5).fill(false);
let referenceCopiedState = false;
let activeTab = "reference";
let promptTabReadyToCopy = false;
let promptsTextStore = "";
let srtDownloadUrl = "";
let imagePromptSeeds = [];
let promptPresets = [];
let activePromptPresetId = "";
let srtDownloadLoadingTimer = 0;
let pendingDeletePresetId = "";
let topbarVisibilityTicking = false;
let lastBuiltPromptKey = "";

function setStatus(element, message, kind = "") {
  if (!element) {
    return;
  }
  element.textContent = message;
  element.classList.remove("is-error", "is-success");
  if (kind === "error") {
    element.classList.add("is-error");
  }
  if (kind === "success") {
    element.classList.add("is-success");
  }
}

function extractYouTubeUrl(text) {
  if (!text) return null;
  const match = text.match(/https?:\/\/\S+/);
  if (!match) return null;
  const url = match[0].trim();
  return /(youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts)/.test(url) ? url : null;
}

async function fetchVideoTitle(url) {
  if (!url) return null;
  try {
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return (data.title || "").trim() || null;
  } catch (error) {
    return null;
  }
}

function cleanReferenceScript(text) {
  if (!text) return "";
  let cleaned = text.replace(/https?:\/\/\S+/g, "");
  cleaned = cleaned.replace(/(^|\n)transcript\s*:?.*$/gim, "");
  return cleaned
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && line !== ":")
    .join("\n");
}

function normalizeInlineText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function createDefaultPromptPreset() {
  return {
    id: "default-preset",
    name: "Default preset",
    prompt: constraint
  };
}

function ensurePromptPresetsShape(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [createDefaultPromptPreset()];
  }

  const normalized = items
    .map(item => ({
      id: typeof item.id === "string" && item.id ? item.id : `preset-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name: normalizeInlineText(item.name || "Untitled preset"),
      prompt: normalizeInlineText(item.prompt || "")
    }))
    .filter(item => item.name && item.prompt);

  const hasDefault = normalized.some(item => item.id === "default-preset");
  if (!hasDefault) {
    normalized.unshift(createDefaultPromptPreset());
  }

  return normalized.length ? normalized : [createDefaultPromptPreset()];
}

function savePromptPresets() {
  localStorage.setItem(PROMPT_PRESET_STORAGE_KEY, JSON.stringify(promptPresets));
  localStorage.setItem(ACTIVE_PROMPT_PRESET_STORAGE_KEY, activePromptPresetId);
}

function syncBodyScrollLock() {
  const hasOpenModal = !promptPresetModal.hidden || !presetDeleteConfirm.hidden;
  document.body.style.overflow = hasOpenModal ? "hidden" : "";
}

function getActivePromptPreset() {
  return promptPresets.find(item => item.id === activePromptPresetId) || promptPresets[0];
}

function getPresetPreviewText(text) {
  const compact = normalizeInlineText(text);
  if (compact.length <= 132) return compact;
  return `${compact.slice(0, 129)}...`;
}

function renderPromptPresetBadge() {
  const activePreset = getActivePromptPreset();
  promptPresetBadge.textContent = activePreset ? activePreset.name : "No preset";
}

function composeToolTwoPrompts() {
  const activePreset = getActivePromptPreset();
  const presetPrompt = activePreset ? normalizeInlineText(activePreset.prompt) : "";

  return imagePromptSeeds.map(prompt => {
    const inlinePrompt = normalizeInlineText(prompt);
    return presetPrompt ? `${inlinePrompt} ${presetPrompt}` : inlinePrompt;
  });
}

function renderToolTwoPrompts() {
  const prompts = composeToolTwoPrompts();
  promptsTextStore = prompts.join("\n\n");
  promptsOutput.value = promptsTextStore;
  saveAppDraftState();
}

function setActivePromptPreset(id, { rerender = true, closeModal = false } = {}) {
  const nextPreset = promptPresets.find(item => item.id === id);
  if (!nextPreset) return;

  activePromptPresetId = nextPreset.id;
  savePromptPresets();
  renderPromptPresetBadge();
  renderPromptPresetList();

  if (rerender) {
    renderToolTwoPrompts();
  }

  if (closeModal) {
    closePromptPresetModal();
  }
}

function renderPromptPresetList() {
  promptPresetList.innerHTML = "";

  promptPresets.forEach(preset => {
    const item = document.createElement("div");
    item.className = "preset-item";
    if (preset.id === activePromptPresetId) {
      item.classList.add("is-active");
    }

    const mainButton = document.createElement("button");
    mainButton.type = "button";
    mainButton.className = "preset-item-main";
    mainButton.dataset.presetId = preset.id;
    mainButton.innerHTML = `<strong>${escapeHtml(preset.name)}</strong><span>${escapeHtml(getPresetPreviewText(preset.prompt))}</span>`;

    const meta = document.createElement("span");
    meta.className = "preset-item-meta";
    meta.textContent = preset.id === activePromptPresetId ? "Active" : "Use";

    item.appendChild(mainButton);
    item.appendChild(meta);

    if (promptPresets.length > 1) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "icon-button preset-delete";
      deleteButton.dataset.presetDelete = preset.id;
      deleteButton.setAttribute("aria-label", `Delete ${preset.name}`);
      deleteButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM7 10h2v8H7v-8Zm-1 10h12l1-13H5l1 13Z"/>
        </svg>`;
      item.appendChild(deleteButton);
    }

    promptPresetList.appendChild(item);
  });
}

function loadPromptPresets() {
  try {
    const rawPresets = JSON.parse(localStorage.getItem(PROMPT_PRESET_STORAGE_KEY) || "[]");
    promptPresets = ensurePromptPresetsShape(rawPresets);
  } catch (error) {
    promptPresets = [createDefaultPromptPreset()];
  }

  const savedActivePresetId = localStorage.getItem(ACTIVE_PROMPT_PRESET_STORAGE_KEY) || "";
  activePromptPresetId = promptPresets.some(item => item.id === savedActivePresetId)
    ? savedActivePresetId
    : promptPresets[0].id;

  renderPromptPresetBadge();
  renderPromptPresetList();
  savePromptPresets();
}

function ensureLanguageOption(language) {
  const normalized = normalizeLanguageName(language || "");
  if (!normalized) return "";

  const existingOption = Array.from(pbLanguageList.querySelectorAll(".language-option")).find(
    option => option.dataset.language.toLowerCase() === normalized.toLowerCase()
  );
  if (existingOption) {
    return existingOption.dataset.language;
  }

  const option = document.createElement("button");
  option.type = "button";
  option.className = "language-option";
  option.dataset.language = normalized;
  option.textContent = normalized;
  pbLanguageList.appendChild(option);
  return normalized;
}

function saveAppDraftState() {
  const draftState = {
    pbReference: pbRef.value,
    pbWords: pbWords.value,
    pbLanguage: normalizeLanguageName(pbLang.value || "English"),
    pbPromptBuildKey: lastBuiltPromptKey,
    referenceCopiedState,
    pbExtraLanguages: Array.from(pbLanguageList.querySelectorAll(".language-option"))
      .map(option => option.dataset.language)
      .filter(language => !DEFAULT_LANGUAGES.includes(language)),
    pbLanguageCustomDraft: pbLanguageCustom.value,
    promptData,
    activeTab,
    jsonInput: jsonInput.value,
    srtOutput: srtOutput.value,
    promptsOutput: promptsOutput.value,
    imagePromptSeeds,
    promptPresetDraftName: promptPresetName.value,
    promptPresetDraftText: promptPresetText.value
  };

  localStorage.setItem(APP_DRAFT_STORAGE_KEY, JSON.stringify(draftState));
}

function loadAppDraftState() {
  try {
    const rawDraft = localStorage.getItem(APP_DRAFT_STORAGE_KEY);
    if (!rawDraft) return;

    const draftState = JSON.parse(rawDraft);
    if (!draftState || typeof draftState !== "object") return;

    pbRef.value = typeof draftState.pbReference === "string" ? draftState.pbReference : "";
    pbWords.value = typeof draftState.pbWords === "string" && draftState.pbWords.trim()
      ? draftState.pbWords
      : "3000";

    if (Array.isArray(draftState.pbExtraLanguages)) {
      draftState.pbExtraLanguages.forEach(ensureLanguageOption);
    }

    const savedLanguage = ensureLanguageOption(draftState.pbLanguage || "English") || "English";
    setPromptLanguage(savedLanguage);
    lastBuiltPromptKey = typeof draftState.pbPromptBuildKey === "string"
      ? draftState.pbPromptBuildKey
      : "";
    referenceCopiedState = Boolean(draftState.referenceCopiedState);
    pbLanguageCustom.value = typeof draftState.pbLanguageCustomDraft === "string"
      ? draftState.pbLanguageCustomDraft
      : "";

    promptData = Array.isArray(draftState.promptData) && draftState.promptData.length === 5
      ? draftState.promptData.map(item => typeof item === "string" ? item : "")
      : Array(5).fill("");

    promptCopiedState = Array(5).fill(false);
    if (typeof draftState.activeTab === "string") {
      activeTab = draftState.activeTab === "reference" || /^prompt-[0-4]$/.test(draftState.activeTab)
        ? draftState.activeTab
        : "reference";
    } else if (Number.isInteger(draftState.activeTab) && draftState.activeTab >= 0 && draftState.activeTab < 5) {
      activeTab = `prompt-${draftState.activeTab}`;
    } else {
      activeTab = "reference";
    }

    jsonInput.value = typeof draftState.jsonInput === "string" ? draftState.jsonInput : "";
    srtOutput.value = typeof draftState.srtOutput === "string" ? draftState.srtOutput : "";
    imagePromptSeeds = Array.isArray(draftState.imagePromptSeeds)
      ? draftState.imagePromptSeeds.filter(item => typeof item === "string")
      : [];
    promptsTextStore = typeof draftState.promptsOutput === "string" ? draftState.promptsOutput : "";
    promptsOutput.value = promptsTextStore;
    promptPresetName.value = typeof draftState.promptPresetDraftName === "string"
      ? draftState.promptPresetDraftName
      : "";
    promptPresetText.value = typeof draftState.promptPresetDraftText === "string"
      ? draftState.promptPresetDraftText
      : "";
  } catch (error) {
    localStorage.removeItem(APP_DRAFT_STORAGE_KEY);
  }
}

function openPromptPresetModal() {
  promptPresetModal.hidden = false;
  syncBodyScrollLock();
  promptPresetName.focus();
}

function closePromptPresetModal() {
  promptPresetModal.hidden = true;
  closeDeleteConfirmModal();
  syncBodyScrollLock();
}

function openDeleteConfirmModal(id) {
  const preset = promptPresets.find(item => item.id === id);
  if (!preset) return;

  pendingDeletePresetId = id;
  presetDeleteText.textContent = `Delete "${preset.name}" from your saved presets?`;
  presetDeleteConfirm.hidden = false;
  syncBodyScrollLock();
  presetDeleteCancel.focus();
}

function closeDeleteConfirmModal() {
  pendingDeletePresetId = "";
  presetDeleteConfirm.hidden = true;
  syncBodyScrollLock();
}

function confirmDeletePromptPreset() {
  const id = pendingDeletePresetId;
  const preset = promptPresets.find(item => item.id === id);
  if (!preset) {
    closeDeleteConfirmModal();
    return;
  }

  promptPresets = promptPresets.filter(item => item.id !== id);
  if (!promptPresets.length) {
    promptPresets = [createDefaultPromptPreset()];
  }

  if (!promptPresets.some(item => item.id === activePromptPresetId)) {
    activePromptPresetId = promptPresets[0].id;
  }

  savePromptPresets();
  renderPromptPresetBadge();
  renderPromptPresetList();
  renderToolTwoPrompts();
  closeDeleteConfirmModal();
  setStatus(srtStatus, `${preset.name} deleted.`, "success");
}

function savePromptPresetFromForm() {
  const name = normalizeInlineText(promptPresetName.value);
  const prompt = normalizeInlineText(promptPresetText.value);

  if (!name) {
    setStatus(srtStatus, "Add a preset name.", "error");
    promptPresetName.focus();
    return;
  }

  if (!prompt) {
    setStatus(srtStatus, "Add the preset prompt text.", "error");
    promptPresetText.focus();
    return;
  }

  const preset = {
    id: `preset-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name,
    prompt
  };

  promptPresets.push(preset);
  promptPresetName.value = "";
  promptPresetText.value = "";
  renderPromptPresetList();
  setActivePromptPreset(preset.id, { rerender: true, closeModal: true });
  setStatus(srtStatus, `${name} saved.`, "success");
  saveAppDraftState();
}

function deletePromptPreset(id) {
  openDeleteConfirmModal(id);
}

function fillTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replaceAll(`[${key}]`, value),
    template
  );
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function highlightPromptText(text) {
  let html = escapeHtml(text || "");

  [
    /(New video title:\s*)([^\n]+)/g,
    /(Target total word count:\s*)([^\n]+)/g,
    /(Input:\s*\[TARGET_LANGUAGE\]\s*=\s*)([^\n]+)/g,
    /(TARGET_LANGUAGE:\s*)([^\n]+)/g
  ].forEach(pattern => {
    html = html.replace(pattern, `$1<span class="prompt-token">$2</span>`);
  });

  return html;
}

function getPromptEditorText() {
  return (pbOutput.innerText || pbOutput.textContent || "").replace(/\u00a0/g, " ");
}

function setPromptEditorText(text) {
  pbOutput.textContent = text || "";
}

function getPromptIndexFromView(view = activeTab) {
  const match = String(view || "").match(/^prompt-([0-4])$/);
  return match ? Number(match[1]) : -1;
}

function hasValidReferenceScript() {
  return Boolean(extractYouTubeUrl(pbRef.value));
}

function hasReferenceScriptBody() {
  return Boolean(cleanReferenceScript(pbRef.value).trim());
}

function hasBuildableReferenceScript() {
  return hasValidReferenceScript() && hasReferenceScriptBody();
}

function getCurrentPromptBuildKey() {
  return JSON.stringify({
    reference: pbRef.value.trim(),
    words: pbWords.value.trim(),
    language: pbLang.value.trim()
  });
}

function hasBuiltPrompts() {
  return promptData.some(item => typeof item === "string" && item.trim().length > 0);
}

function canAccessPromptTabs() {
  return hasBuildableReferenceScript() && hasBuiltPrompts() && lastBuiltPromptKey === getCurrentPromptBuildKey();
}

function openPromptSettings() {
  if (!pbPromptSettingsPanel || !pbPromptSettingsToggle) {
    return;
  }

  pbPromptSettingsPanel.hidden = false;
  pbPromptSettingsToggle.classList.add("is-active");
  pbPromptSettingsToggle.setAttribute("aria-expanded", "true");
}

function closePromptSettings() {
  if (!pbPromptSettingsPanel || !pbPromptSettingsToggle) {
    return;
  }

  pbPromptSettingsPanel.hidden = true;
  pbPromptSettingsToggle.classList.remove("is-active");
  pbPromptSettingsToggle.setAttribute("aria-expanded", "false");
  closeLanguageDropdown();
}

function togglePromptSettings() {
  if (!pbPromptSettingsPanel || !pbPromptSettingsToggle) {
    return;
  }

  if (pbPromptSettingsPanel.hidden) {
    openPromptSettings();
    return;
  }

  closePromptSettings();
}

function updatePromptPanels() {
  const showingReference = activeTab === "reference";

  if (pbReferencePanel) {
    pbReferencePanel.hidden = !showingReference;
    pbReferencePanel.classList.toggle("is-active", showingReference);
  }

  if (pbPromptsPanel) {
    pbPromptsPanel.hidden = showingReference;
    pbPromptsPanel.classList.toggle("is-active", !showingReference);
  }
}

function renderPromptOutput() {
  const promptIndex = getPromptIndexFromView();
  if (promptIndex < 0) {
    return;
  }

  if (document.activeElement === pbOutput) {
    setPromptEditorText(promptData[promptIndex] || "");
    return;
  }

  pbOutput.innerHTML = highlightPromptText(promptData[promptIndex] || "");
}

function renderPromptTabStates() {
  const promptTabsUnlocked = canAccessPromptTabs();
  referenceCopiedState = promptCopiedState.length > 0 && promptCopiedState.every(Boolean);

  pbTabs.forEach(tab => {
    const view = tab.dataset.view || "reference";
    const promptIndex = getPromptIndexFromView(view);
    const isPromptTab = promptIndex > -1;
    tab.classList.toggle("active", view === activeTab);
    tab.classList.toggle("is-ready", view === "reference" && hasBuildableReferenceScript());
    tab.classList.toggle("is-copied", view === "reference" ? referenceCopiedState : Boolean(promptCopiedState[promptIndex]));
    tab.classList.toggle("is-locked", isPromptTab && !promptTabsUnlocked);
    tab.setAttribute("aria-disabled", isPromptTab && !promptTabsUnlocked ? "true" : "false");
  });
}

function focusReferenceScriptEditor() {
  if (!pbRef) {
    return;
  }

  pbRef.focus({ preventScroll: true });

  const cursorPosition = pbRef.value.length;
  pbRef.selectionStart = cursorPosition;
  pbRef.selectionEnd = cursorPosition;
}

function focusPromptOutputEditor() {
  if (!pbOutput) {
    return;
  }

  pbOutput.focus({ preventScroll: true });

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(pbOutput);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function setActiveTab(view) {
  const promptIndex = getPromptIndexFromView(view);
  if (promptIndex > -1 && !canAccessPromptTabs()) {
    activeTab = "reference";
  } else {
    activeTab = view;
  }
  closePromptSettings();
  renderPromptTabStates();
  updatePromptPanels();
  renderPromptOutput();
  saveAppDraftState();
}

function updatePromptGenerateState() {
  const hasBuildableReference = hasBuildableReferenceScript();
  if (!canAccessPromptTabs() && getPromptIndexFromView(activeTab) > -1) {
    activeTab = "reference";
  }
  renderPromptTabStates();
  if (pbGenerate) {
    pbGenerate.classList.toggle("is-danger", !hasBuildableReference);
  }
}

function normalizeLanguageName(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function openLanguageDropdown() {
  pbLanguageSelect.classList.add("is-open");
  pbLanguageDropdown.hidden = false;
  pbLanguageDropdown.style.display = "flex";
  pbLanguageTrigger.setAttribute("aria-expanded", "true");
}

function closeLanguageDropdown() {
  pbLanguageSelect.classList.remove("is-open");
  pbLanguageDropdown.hidden = true;
  pbLanguageDropdown.style.display = "none";
  pbLanguageTrigger.setAttribute("aria-expanded", "false");
}

function toggleLanguageDropdown() {
  if (pbLanguageDropdown.hidden) {
    openLanguageDropdown();
    return;
  }
  closeLanguageDropdown();
}

function setPromptLanguage(language) {
  pbLang.value = language;
  pbLanguageValue.textContent = language;
  Array.from(pbLanguageList.querySelectorAll(".language-option")).forEach(option => {
    option.classList.toggle("is-active", option.dataset.language === language);
  });
  referenceCopiedState = false;
  closeLanguageDropdown();
  updatePromptGenerateState();
  saveAppDraftState();
}

function addCustomLanguage() {
  const rawValue = pbLanguageCustom.value;
  const language = normalizeLanguageName(rawValue);

  if (!language) {
    setStatus(pbStatus, "Enter a language.", "error");
    return;
  }

  const existingOption = Array.from(pbLanguageList.querySelectorAll(".language-option")).find(
    option => option.dataset.language.toLowerCase() === language.toLowerCase()
  );

  if (existingOption) {
    setPromptLanguage(existingOption.dataset.language);
    pbLanguageCustom.value = "";
    setStatus(pbStatus, `${existingOption.dataset.language} selected.`, "success");
    closeLanguageDropdown();
    return;
  }

  const option = document.createElement("button");
  option.type = "button";
  option.className = "language-option";
  option.dataset.language = language;
  option.textContent = language;
  pbLanguageList.appendChild(option);
  setPromptLanguage(language);
  pbLanguageCustom.value = "";
  setStatus(pbStatus, `${language} added.`, "success");
  closeLanguageDropdown();
  saveAppDraftState();
}

function resetPrompts() {
  promptData = Array(5).fill("");
  promptCopiedState = Array(5).fill(false);
  referenceCopiedState = false;
  lastBuiltPromptKey = "";
  promptTabReadyToCopy = false;
  setActiveTab("reference");
  saveAppDraftState();
}

function clearReferenceScriptForNextRun() {
  pbRef.value = "";
  resetPrompts();
  setStatus(pbStatus, "Add a YouTube link and reference script.", "error");
  updatePromptGenerateState();
  saveAppDraftState();
}

function clearPromptBuilder({ statusMessage = "Paste script, then press Enter." } = {}) {
  pbRef.value = "";
  pbWords.value = "3000";
  resetPrompts();
  setPromptLanguage("English");
  pbLanguageCustom.value = "";
  closeLanguageDropdown();
  setStatus(pbStatus, statusMessage);
  updatePromptGenerateState();
  saveAppDraftState();
}

async function buildPrompts() {
  const url = extractYouTubeUrl(pbRef.value);
  if (!url) {
    setStatus(pbStatus, "Add a valid YouTube link.", "error");
    updatePromptGenerateState();
    return;
  }

  const referenceScript = cleanReferenceScript(pbRef.value);
  if (!referenceScript.trim()) {
    setStatus(pbStatus, "Add the reference script below the YouTube link.", "error");
    updatePromptGenerateState();
    return;
  }

  setStatus(pbStatus, "Generating...");
  const title = (await fetchVideoTitle(url)) || "Auto-detected title";
  const words = pbWords.value.trim() || "3000";
  const language = pbLang.value.trim() || "English";

  const replacements = {
    TEST1FORPROMPT1: referenceScript,
    TEST1FORPROMPT2: title,
    TEST1FORPROMPT3: words,
    TEST2FORPROMPT3: language,
    TEST1FORPROMPT4: language,
    TEST1FORPROMPT5: language
  };

    promptData = promptTemplates.map(template => fillTemplate(template, replacements).trim());
    promptCopiedState = Array(5).fill(false);
    referenceCopiedState = false;
    lastBuiltPromptKey = getCurrentPromptBuildKey();
    setActiveTab("prompt-0");
    promptTabReadyToCopy = true;
    setStatus(pbStatus, "Prompts ready. Click the tabs to review or copy.", "success");
    updatePromptGenerateState();
    saveAppDraftState();
    window.requestAnimationFrame(focusPromptOutputEditor);
  }

function buildSrtAndPrompts() {
  promptsTextStore = "";
  imagePromptSeeds = [];
  srtOutput.value = "";
  promptsOutput.value = "";
  promptsCopy.textContent = "Copy Prompts";
  promptsCopy.classList.remove("is-success");

  try {
    const data = JSON.parse(jsonInput.value || "[]");
    if (!Array.isArray(data)) {
      throw new Error("JSON must be an array.");
    }

    const srtBlocks = [];

    data.forEach((item, index) => {
      const start = (item.start_time || "").trim();
      const end = (item.end_time || "").trim();
      const idea = (item.main_idea || "").trim();
      const prompt = (item.image_prompt || "").trim();

      if (start && end && idea) {
        srtBlocks.push(`${index + 1}\n${start} --> ${end}\n${idea}`);
      }

      if (prompt) {
        imagePromptSeeds.push(prompt);
      }
    });

    srtOutput.value = srtBlocks.join("\n\n");
    refreshSrtDownloadUrl();
    renderToolTwoPrompts();
    setStatus(srtStatus, "Done.", "success");
    saveAppDraftState();
  } catch (error) {
    imagePromptSeeds = [];
    refreshSrtDownloadUrl();
    setStatus(srtStatus, `Error: ${error.message}`, "error");
    saveAppDraftState();
  }
}

async function copyPromptAtIndex(index) {
  const activePromptIndex = getPromptIndexFromView();
  const text = activePromptIndex === index && document.activeElement === pbOutput
    ? getPromptEditorText()
    : promptData[index] || "";
  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);
    promptCopiedState[index] = true;
    renderPromptTabStates();
    setStatus(pbStatus, `Prompt ${index + 1} copied.`, "success");
  } catch (error) {
    setStatus(pbStatus, "Copy failed.", "error");
  }
}

async function copyAllPrompts() {
  const text = promptsOutput.value.trim() ? promptsOutput.value : promptsTextStore;
  if (!text.trim()) {
    setStatus(srtStatus, "No prompts to copy.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    promptsCopy.textContent = "Copied";
    promptsCopy.classList.add("is-success");
    promptCopiedState = promptCopiedState.map(() => true);
    referenceCopiedState = true;
    renderPromptTabStates();
    saveAppDraftState();
    setStatus(srtStatus, "Prompts copied.", "success");
    window.setTimeout(() => {
      promptsCopy.textContent = "Copy Prompts";
      promptsCopy.classList.remove("is-success");
    }, 1800);
  } catch (error) {
    setStatus(srtStatus, "Copy failed.", "error");
  }
}

function downloadSrtFile() {
  if (!srtOutput.value.trim()) {
    setStatus(srtStatus, "No SRT to download.", "error");
    return;
  }

  window.clearTimeout(srtDownloadLoadingTimer);
  srtDownload.classList.add("is-loading");

  const link = document.createElement("a");
  if (!srtDownloadUrl) {
    refreshSrtDownloadUrl();
  }
  link.href = srtDownloadUrl;
  link.download = "subtitles.srt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setStatus(srtStatus, "SRT download started.", "success");
  srtDownloadLoadingTimer = window.setTimeout(() => {
    srtDownload.classList.remove("is-loading");
  }, 900);
}

function clearToolTwo() {
  jsonInput.value = "";
  srtOutput.value = "";
  refreshSrtDownloadUrl();
  imagePromptSeeds = [];
  promptsTextStore = "";
  promptsOutput.value = "";
  promptsCopy.textContent = "Copy Prompts";
  promptsCopy.classList.remove("is-success");
  setStatus(srtStatus, "Cleared. Paste JSON and generate.");
  saveAppDraftState();
}

function refreshSrtDownloadUrl() {
  if (srtDownloadUrl) {
    URL.revokeObjectURL(srtDownloadUrl);
    srtDownloadUrl = "";
  }

  if (!srtOutput.value.trim()) {
    return;
  }

  srtDownloadUrl = URL.createObjectURL(
    new Blob([srtOutput.value], { type: "text/plain;charset=utf-8" })
  );
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("kamilys-theme", theme);
  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  themeToggleLabel.textContent = nextLabel;
  themeToggle.setAttribute("aria-label", nextLabel);
  themeToggle.setAttribute("title", nextLabel);
  themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
}

function animateGlowButton(button) {
  if (!button) return;
  button.dataset.state = "clicked";
  window.clearTimeout(button._glowClickTimer);
  button._glowClickTimer = window.setTimeout(() => {
    button.removeAttribute("data-state");
  }, 200);
}

function resolveScrollFocusTarget(target) {
  if (!target) return null;

  if (target.id === "tool-workflow" || target.classList?.contains("workflow-inline-shell")) {
    return (
      target.querySelector(".workflow-embed-card-inline") ||
      target.querySelector(".workflow-embed-card") ||
      target.querySelector(".workflow-inline-head") ||
      target
    );
  }

  if (target.classList?.contains("tool-section")) {
    return target.querySelector(".tool-card") || target;
  }

  const parentSection = target.closest?.(".tool-section");
  if (parentSection) {
    return parentSection.querySelector(".tool-card") || target;
  }

  return target;
}

function isWorkflowScrollTarget(target) {
  return Boolean(
    target?.id === "tool-workflow" ||
    target?.classList?.contains("workflow-inline-shell") ||
    target?.classList?.contains("workflow-inline-head") ||
    target?.classList?.contains("workflow-embed-card-inline") ||
    target?.classList?.contains("workflow-embed-card")
  );
}

function scrollSectionIntoFocus(section) {
  const focusTarget = resolveScrollFocusTarget(section);
  if (!focusTarget) return;

  const header = document.querySelector(".topbar");
  const headerHeight = header ? header.offsetHeight : 0;
  const viewportHeight = window.innerHeight;
  const sectionTop = window.scrollY + focusTarget.getBoundingClientRect().top;
  const usableViewport = Math.max(320, viewportHeight - headerHeight - 32);
  const desiredVisibleHeight = Math.min(focusTarget.offsetHeight, usableViewport * 0.82);
  const topOffset = isWorkflowScrollTarget(focusTarget)
    ? headerHeight + 10
    : headerHeight + Math.max(24, (usableViewport - desiredVisibleHeight) / 2);
  const nextTop = Math.max(0, sectionTop - topOffset);

  window.scrollTo({
    top: nextTop,
    behavior: "smooth"
  });
}

function alignHashTarget({ smooth = false } = {}) {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith("#")) return;

  const rawTarget = document.querySelector(hash);
  const target = resolveScrollFocusTarget(rawTarget);
  if (!target) return;

  if (smooth) {
    scrollSectionIntoFocus(target);
    return;
  }

  const originalScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  const header = document.querySelector(".topbar");
  const headerHeight = header ? header.offsetHeight : 0;
  const viewportHeight = window.innerHeight;
  const sectionTop = window.scrollY + target.getBoundingClientRect().top;
  const usableViewport = Math.max(320, viewportHeight - headerHeight - 32);
  const desiredVisibleHeight = Math.min(target.offsetHeight, usableViewport * 0.72);
  const topOffset = isWorkflowScrollTarget(target)
    ? headerHeight + 10
    : headerHeight + Math.max(24, (usableViewport - desiredVisibleHeight) / 2);
  const nextTop = Math.max(0, sectionTop - topOffset);

  window.scrollTo(0, nextTop);
  document.documentElement.style.scrollBehavior = originalScrollBehavior;
}

function syncTopbarVisibility() {
  if (!topbar) return;
  topbar.classList.remove("is-hidden");
}

function syncSectionDepthEffects() {
  if (!toolTwoSection) {
    return;
  }

  if (window.innerWidth <= 900) {
    document.body.classList.remove("is-json-focus");
    return;
  }

  const topbarBottom = topbar ? topbar.getBoundingClientRect().bottom : 0;
  const toolTwoRect = toolTwoSection.getBoundingClientRect();
  const focusLine = Math.max(topbarBottom + 26, window.innerHeight * 0.34);
  const shouldBlurUpperContent =
    toolTwoRect.top <= focusLine + 42 &&
    toolTwoRect.bottom > 160;

  document.body.classList.toggle("is-json-focus", shouldBlurUpperContent);
}

function requestTopbarVisibilitySync() {
  if (topbarVisibilityTicking) return;
  topbarVisibilityTicking = true;

  window.requestAnimationFrame(() => {
    topbarVisibilityTicking = false;
    syncTopbarVisibility();
    syncSectionDepthEffects();
  });
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("kamilys-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
    return;
  }
  applyTheme("dark");
}

function injectPromptShellStylesIntoWorkflow(frameDoc) {
  if (!frameDoc || frameDoc.getElementById(WORKFLOW_PROMPT_SHELL_STYLE_ID)) {
    return;
  }

  const style = frameDoc.createElement("style");
  style.id = WORKFLOW_PROMPT_SHELL_STYLE_ID;
  style.textContent = WORKFLOW_PROMPT_SHELL_CSS;
  frameDoc.head.appendChild(style);
}

function bindPromptShellFrameInteractions(frameDoc) {
  if (!frameDoc || frameDoc.documentElement.dataset.promptShellBound === "true") {
    return;
  }

  frameDoc.addEventListener("pointerdown", event => {
    if (!pbLanguageSelect.contains(event.target)) {
      closeLanguageDropdown();
    }

    const clickedInsidePromptSettings = (pbPromptSettingsPanel && pbPromptSettingsPanel.contains(event.target))
      || (pbPromptSettingsToggle && pbPromptSettingsToggle.contains(event.target));
    if (!clickedInsidePromptSettings) {
      closePromptSettings();
    }
  });

  frameDoc.addEventListener("click", event => {
    if (!pbLanguageSelect.contains(event.target)) {
      closeLanguageDropdown();
    }

    const clickedInsidePromptSettings = (pbPromptSettingsPanel && pbPromptSettingsPanel.contains(event.target))
      || (pbPromptSettingsToggle && pbPromptSettingsToggle.contains(event.target));
    if (!clickedInsidePromptSettings) {
      closePromptSettings();
    }
  });

  frameDoc.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLanguageDropdown();
      closePromptSettings();
    }
  });

  frameDoc.documentElement.dataset.promptShellBound = "true";
}

function mountPromptBuilderIntoWorkflowFrame() {
  if (!workflowFrame) {
    return;
  }

  const frameDoc = workflowFrame.contentDocument;
  const frameWindow = workflowFrame.contentWindow;
  const promptShell = document.querySelector(".prompt-builder-shell") || frameDoc?.querySelector(".prompt-builder-shell");
  if (!frameDoc || !frameWindow || !promptShell) {
    return;
  }

  const workflowPanel = frameDoc.querySelector(".workflow-panel");
  const summaryGrid = frameDoc.querySelector(".summary-grid");
  const youtubeCard = frameDoc.getElementById("youtube-link")?.closest(".summary-card");
  const titleCard = frameDoc.getElementById("current-title")?.closest(".summary-card");
  const tabsShell = frameDoc.querySelector(".tabs-shell");

  if (!workflowPanel || !youtubeCard || !titleCard || !tabsShell) {
    return;
  }

  injectPromptShellStylesIntoWorkflow(frameDoc);
  bindPromptShellFrameInteractions(frameDoc);

  let flowStack = frameDoc.getElementById("workflow-unified-stack");
  if (!flowStack) {
    flowStack = frameDoc.createElement("div");
    flowStack.id = "workflow-unified-stack";
  }

  youtubeCard.classList.add("workflow-unified-card");
  titleCard.classList.add("workflow-unified-card");
  youtubeCard.classList.add("workflow-youtube-card");
  promptShell.classList.add("workflow-embedded-prompt-shell");

  flowStack.appendChild(youtubeCard);
  flowStack.appendChild(promptShell);
  flowStack.appendChild(titleCard);
  flowStack.appendChild(tabsShell);

  if (summaryGrid?.isConnected) {
    summaryGrid.remove();
  }

  workflowPanel.insertBefore(flowStack, workflowPanel.querySelector(".action-row"));
  frameWindow.requestAnimationFrame(() => {
    frameWindow.dispatchEvent(new Event("resize"));
  });
}

function syncWorkflowFrameHeight(rawHeight) {
  if (!workflowFrame) {
    return;
  }

  const nextHeight = Math.max(1, Math.ceil(Number(rawHeight) || 0));
  workflowFrame.style.height = `${nextHeight}px`;
}

pbRef.addEventListener("input", updatePromptGenerateState);
pbRef.addEventListener("input", () => {
  referenceCopiedState = false;
  renderPromptTabStates();
  saveAppDraftState();
});
pbRef.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    buildPrompts();
  }
});
pbWords.addEventListener("input", () => {
  referenceCopiedState = false;
  updatePromptGenerateState();
  saveAppDraftState();
});
pbOutput.addEventListener("focus", () => {
  const promptIndex = getPromptIndexFromView();
  if (promptIndex < 0) return;
  setPromptEditorText(promptData[promptIndex] || "");
});
pbOutput.addEventListener("input", () => {
  const promptIndex = getPromptIndexFromView();
  if (promptIndex < 0) return;
  promptData[promptIndex] = getPromptEditorText();
  promptCopiedState[promptIndex] = false;
  renderPromptTabStates();
  saveAppDraftState();
});
pbOutput.addEventListener("blur", () => {
  const promptIndex = getPromptIndexFromView();
  if (promptIndex < 0) return;
  promptData[promptIndex] = getPromptEditorText();
  renderPromptOutput();
  saveAppDraftState();
});
pbLanguageTrigger.addEventListener("click", event => {
  event.stopPropagation();
  toggleLanguageDropdown();
});
if (pbPromptSettingsToggle) {
  pbPromptSettingsToggle.addEventListener("click", event => {
    event.stopPropagation();
    togglePromptSettings();
  });
}
pbLanguageList.addEventListener("click", event => {
  const option = event.target.closest(".language-option");
  if (!option) return;
  setPromptLanguage(option.dataset.language);
});
pbLanguageAdd.addEventListener("click", event => {
  event.stopPropagation();
  addCustomLanguage();
});
pbLanguageCustom.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    addCustomLanguage();
  }
});
pbLanguageCustom.addEventListener("input", saveAppDraftState);
document.addEventListener("click", event => {
  if (!pbLanguageSelect.contains(event.target)) {
    closeLanguageDropdown();
  }

  const clickedInsidePromptSettings = (pbPromptSettingsPanel && pbPromptSettingsPanel.contains(event.target))
    || (pbPromptSettingsToggle && pbPromptSettingsToggle.contains(event.target));
  if (!clickedInsidePromptSettings) {
    closePromptSettings();
  }
});
document.addEventListener("pointerdown", event => {
  if (!pbLanguageSelect.contains(event.target)) {
    closeLanguageDropdown();
  }

  const clickedInsidePromptSettings = (pbPromptSettingsPanel && pbPromptSettingsPanel.contains(event.target))
    || (pbPromptSettingsToggle && pbPromptSettingsToggle.contains(event.target));
  if (!clickedInsidePromptSettings) {
    closePromptSettings();
  }

  if (!presetDeleteConfirm.hidden) {
    const clickedInsideConfirm = event.target.closest(".confirm-dialog");
    if (!clickedInsideConfirm) {
      closeDeleteConfirmModal();
    }
    return;
  }

  if (!promptPresetModal.hidden) {
    const clickedInsideDialog = event.target.closest(".preset-dialog");
    const clickedTrigger = event.target.closest("#prompt-preset-settings");
    if (!clickedInsideDialog && !clickedTrigger) {
      closePromptPresetModal();
    }
  }
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLanguageDropdown();
    closePromptSettings();
    closeDeleteConfirmModal();
    closePromptPresetModal();
  }
});
promptsOutput.addEventListener("input", () => {
  promptsTextStore = promptsOutput.value;
  saveAppDraftState();
});
jsonInput.addEventListener("input", saveAppDraftState);
if (pbGenerate) {
  pbGenerate.addEventListener("click", buildPrompts);
}
if (pbClear) {
  pbClear.addEventListener("click", () => {
    clearPromptBuilder();
  });
}

  pbTabs.forEach(tab => {
  tab.addEventListener("click", () => {
      const view = tab.dataset.view || "reference";
      const promptIndex = getPromptIndexFromView(view);
      const isPromptTab = promptIndex > -1;

    if (isPromptTab && !canAccessPromptTabs()) {
      promptTabReadyToCopy = false;
      return;
    }

    if (view === "reference" && referenceCopiedState) {
      clearReferenceScriptForNextRun();
      window.requestAnimationFrame(focusReferenceScriptEditor);
      return;
    }

    if (view === activeTab) {
      if (promptIndex < 0) {
        if (canAccessPromptTabs()) {
          setActiveTab("prompt-0");
          promptTabReadyToCopy = true;
          window.requestAnimationFrame(focusPromptOutputEditor);
          return;
        }
        if (hasBuildableReferenceScript()) {
          promptTabReadyToCopy = false;
          void buildPrompts();
          return;
        }
        promptTabReadyToCopy = false;
        focusReferenceScriptEditor();
        return;
      }
      if (!promptTabReadyToCopy) {
        promptTabReadyToCopy = true;
        return;
        }
        copyPromptAtIndex(promptIndex);
      } else {
        setActiveTab(view);
        promptTabReadyToCopy = promptIndex > -1;
        if (promptIndex < 0) {
          window.requestAnimationFrame(focusReferenceScriptEditor);
        }
      }
    });
  });

srtGenerate.addEventListener("click", buildSrtAndPrompts);
promptsCopy.addEventListener("click", copyAllPrompts);
srtDownload.addEventListener("click", downloadSrtFile);
srtClear.addEventListener("click", clearToolTwo);
promptPresetSettings.addEventListener("click", openPromptPresetModal);
promptPresetClose.addEventListener("click", closePromptPresetModal);
promptPresetModal.addEventListener("click", event => {
  if (event.target === promptPresetModal) {
    closePromptPresetModal();
  }
});
presetDeleteConfirm.addEventListener("click", event => {
  if (event.target === presetDeleteConfirm) {
    closeDeleteConfirmModal();
  }
});
presetDeleteCancel.addEventListener("click", closeDeleteConfirmModal);
presetDeleteConfirmBtn.addEventListener("click", confirmDeletePromptPreset);
promptPresetSave.addEventListener("click", savePromptPresetFromForm);
promptPresetName.addEventListener("input", saveAppDraftState);
promptPresetText.addEventListener("input", saveAppDraftState);
promptPresetList.addEventListener("click", event => {
  const deleteButton = event.target.closest("[data-preset-delete]");
  if (deleteButton) {
    deletePromptPreset(deleteButton.dataset.presetDelete);
    return;
  }

  const presetButton = event.target.closest("[data-preset-id]");
  if (presetButton) {
    setActivePromptPreset(presetButton.dataset.presetId, { rerender: true, closeModal: true });
    setStatus(srtStatus, "Preset applied.", "success");
  }
});
promptPresetText.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    savePromptPresetFromForm();
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

window.kamiliResetPromptBuilder = (options = {}) => {
  clearPromptBuilder({
    statusMessage: options.statusMessage || "Ready for the next reference script."
  });
};

window.addEventListener("message", event => {
  if (!workflowFrame || event.source !== workflowFrame.contentWindow) {
    return;
  }

  if (event.data?.type === "workflow-embed-height") {
    syncWorkflowFrameHeight(event.data?.height);
    return;
  }

  if (event.data?.type === "workflow-row-load") {
    window.kamiliResetPromptBuilder({
      statusMessage: "Prompt Builder reloaded for the current row."
    });
    return;
  }

  if (event.data?.type === "workflow-submit-success") {
    window.kamiliResetPromptBuilder({
      statusMessage: "Workflow submitted. Prompt Builder is ready for the next reference script."
    });
  }
});

if (workflowFrame) {
  workflowFrame.addEventListener("load", () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(mountPromptBuilderIntoWorkflowFrame);
    });
  });
}

glowButtons.forEach(button => {
  button.addEventListener("click", () => {
    animateGlowButton(button);
  });
});

topbarLinks.forEach(link => {
  link.addEventListener("click", event => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, "", href);
    scrollSectionIntoFocus(target);
  });
});

window.addEventListener("load", () => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      alignHashTarget();
    });
  });
});

window.addEventListener("pageshow", () => {
  window.requestAnimationFrame(() => {
    alignHashTarget();
  });
});

window.addEventListener("hashchange", () => {
  alignHashTarget();
});

window.addEventListener("scroll", requestTopbarVisibilitySync, { passive: true });
window.addEventListener("resize", requestTopbarVisibilitySync);

loadPromptPresets();
loadAppDraftState();
refreshSrtDownloadUrl();
setActiveTab(activeTab);
promptTabReadyToCopy = false;
if (!pbLang.value) {
  setPromptLanguage("English");
}
closeLanguageDropdown();
setStatus(pbStatus, pbRef.value.trim() ? "Draft restored." : "Paste script, then press Enter.");
setStatus(srtStatus, jsonInput.value.trim() ? "Draft restored." : "Paste JSON and generate.");
updatePromptGenerateState();
initializeTheme();
requestTopbarVisibilitySync();
window.requestAnimationFrame(() => {
  window.requestAnimationFrame(mountPromptBuilderIntoWorkflowFrame);
});
