import { useEffect, useState } from "react";
import { getFeedback } from "../api";

export function AdminFeedbackPanel({ loading, error, feedback, onRetry }) {
  if (loading) {
    return (
      <section className="feedback-state" aria-live="polite">
        <strong>Loading feedback…</strong>
        <p>Fetching the latest submissions.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="feedback-state error-state" role="alert">
        <strong>Couldn’t load feedback</strong>
        <p>{error}</p>
        <button className="primary-button" type="button" onClick={onRetry}>Try again</button>
      </section>
    );
  }

  return (
    <section className="feedback-list">
      <div className="list-header"><strong>Latest feedback</strong><span>{feedback.length} items</span></div>
      {feedback.length === 0 ? (
        <div className="empty-state">
          <strong>No feedback yet</strong>
          <p>New submissions will appear here.</p>
        </div>
      ) : feedback.map((item) => (
        <article className="feedback-row" key={item.id}>
          <div>
            <div className="feedback-meta">{item.name} · {new Date(item.createdAt).toLocaleDateString()}</div>
            <p>{item.message}</p>
          </div>
          <span className="status-pill">{item.status}</span>
        </article>
      ))}
    </section>
  );
}

export function AdminPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadFeedback() {
    setLoading(true);
    setError("");
    try {
      const response = await getFeedback(user);
      setFeedback(response.feedback);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, [user]);

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      <AdminFeedbackPanel loading={loading} error={error} feedback={feedback} onRetry={loadFeedback} />
    </main>
  );
}
