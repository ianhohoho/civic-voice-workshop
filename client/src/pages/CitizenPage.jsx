import { useState } from "react";
import { submitFeedback } from "../api";
import { submissionReference } from "../lib/submissionReference";

const FEEDBACK_CHARACTER_LIMIT = 500;

export function CitizenPage({ user }) {
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!message.trim()) {
      setError("Please enter feedback.");
      return;
    }

    if (message.length > FEEDBACK_CHARACTER_LIMIT) {
      setError(`Feedback must be ${FEEDBACK_CHARACTER_LIMIT} characters or fewer.`);
      return;
    }

    try {
      const response = await submitFeedback({ nric: user.nric, name: user.name, message });
      setReference(submissionReference(response.feedback.id));
      setMessage("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div className="eyebrow">Public feedback</div>
        <h1>What would you like us to know?</h1>
        <p>Tell us about an issue, an idea, or a positive experience in your community.</p>
      </div>
      <section className="form-card">
        {reference && (
          <div className="success-banner">
            Thank you. Your feedback has been received. Your reference is <strong>{reference}</strong>.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>Your feedback
            <textarea
              rows="7"
              value={message}
              maxLength={FEEDBACK_CHARACTER_LIMIT}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share your feedback here..."
            />
            <span className="character-count" aria-live="polite">
              {message.length} / {FEEDBACK_CHARACTER_LIMIT} characters
            </span>
          </label>
          <div className="form-footer">
            <span className="muted">Please do not include sensitive personal information.</span>
            <button className="primary-button">Submit feedback</button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </section>
    </main>
  );
}
