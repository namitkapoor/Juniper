# Christine Valmy enrollment agent: requirements (source)

Provided by Namit on 2026-11-02 for this project. Redacted for a public repo:
internal service URLs, a teammate's name, test transcripts and prices are removed.
Infrastructure note from Namit (2026-11-02): the workflow runs on GCP, with BigQuery
for the data side. (The plugin's chat webhook points at a hosted n8n instance; treat
"n8n on GCP + BigQuery" as Namit's confirmation.)

## Response characteristics
- Persona: friendly, interested, warm, polite, positive.
- Informative, grounded in the school's internal documents.
- Light urgency: time until the next class starts.
- Serves English and Spanish speakers.
- Emphasises the school's strengths.
- Pricing only after the student has named the course they're interested in.
- Conversation order: course interest → pricing → financial aid (esthetics only).
- States explicitly when a student does not meet the enrollment criteria.

## Performance
- A response from model inference in under 30 seconds.

## Formatting
- Four sentences or fewer, short sentences, no jargon.
- Conversational; every reply ends with a question.

## Disqualification rules (lead is disqualified if any apply)
- Not currently living in the United States.
- Cannot commit to the full 600-hour program.
- Cannot attend the required in-person sessions in New Jersey and New York.
- Does not speak English or Spanish.
- No GED, U.S. high-school diploma, or accepted equivalent.
- Requires visa sponsorship.

## AI approach
- RAG over the school's proprietary documents.
- Strong prompting plus RAG to meet the requirements above.
- Factors in the chat history within a session.
- Easy to update or upload new documents.
- Model routing via Model Context Protocol: Claude for English, Gemini for Spanish.

## Evaluation strategy
Automated, per response: safe; accuracy of details; accuracy of detecting inappropriate
or irrelevant messages; accuracy of detecting SQL injection; helpfulness; emotional
intelligence (empathy via Perspective API or positive sentiment; likeability as
1 minus toxicity); bias (non-judgmental, neutral sentiment); persuasion; coherence in
English and Spanish (no typos, grammatical); latency ≤ 30 s.
Human, per response (5-point Likert): empathy, likeability, bias, non-judgment,
persuasion, helpfulness.
Per session: follows the course → pricing → financial-aid flow; accuracy of
disqualification; number of sentences sharing the school's strengths.

## Guardrails
Front end: user messages capped at 300 characters (5 sentences × 15 words × 4.7 chars
≈ 352), with an inline red error when exceeded; after a set number of messages (e.g. 5),
a hand-off message connecting the student to an enrollment officer.
Model side: abuse detection (Gemini safety settings); off-topic questions get "We're here
to help you learn more about Christine Valmy. Please ask a new question."; SQL injection
gets "Sorry, we can't help you with that. Please try again."

## Testing feedback (from review sessions)
- Slow the conversation down; don't give too much information at once.
- At most 1-2 questions from the agent per reply.
- Check accuracy of every detail (pricing, programs, offerings).
- Observed in a test: asked to "connect me with a human", the agent claimed to be a real
  person on the team. The fix direction is a hand-off to an enrollment advisor instead.
- Give the reception phone number only when the student asks for it.
- Off-topic and identity questions ("who owns you?") need the scripted redirect.
