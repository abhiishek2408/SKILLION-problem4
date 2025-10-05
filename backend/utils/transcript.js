import config from "../config.js";

/**
 * Generate transcript for a lesson.
 * If TRANSCRIPT_API_KEY is set, you can integrate with AssemblyAI/Whisper/other there.
 * For now, placeholder.
 */
export async function generateTranscript(lesson) {
  if (config.transcriptApiKey) {
    // Example: call external service (left as an exercise, include API docs in README)
    // return await callExternalSTT(lesson.videoUrl)
  }
  // Simple placeholder: split description into sentences
  const text = lesson.description || `Transcript for lesson ${lesson.title}`;
  const sentences = text.split(/[.?!]\s*/).filter(Boolean);
  return sentences.map((s, i) => ({ start: i*5, end: i*5 + 4, text: s }));
}
