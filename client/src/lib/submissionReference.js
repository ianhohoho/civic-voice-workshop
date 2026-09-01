export function submissionReference(feedbackId) {
  const shortId = feedbackId.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  return `CV-${shortId}`;
}
