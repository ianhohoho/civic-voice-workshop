import { useEffect, useState } from "react";
import { getFeedback } from "../api";

const CATEGORY_FILTERS = ["Estate", "Transport", "Environment", "Other"];
const STATUS_FILTERS = ["New", "In review", "Closed"];

export function filterFeedback(feedback, category, status) {
  return feedback.filter((item) => (
    (!category || item.category === category) && (!status || item.status === status)
  ));
}

export function AdminFeedbackPanel({
  loading,
  error,
  feedback,
  totalCount = feedback.length,
  filtersActive = false,
  onRetry,
  onClearFilters,
}) {
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
      <div className="list-header">
        <strong>Latest feedback</strong>
        <span>{filtersActive ? `${feedback.length} of ${totalCount}` : feedback.length} items</span>
      </div>
      {feedback.length === 0 ? (
        <div className="empty-state">
          <strong>{filtersActive ? "No matching feedback" : "No feedback yet"}</strong>
          <p>{filtersActive ? "Try clearing the filters to see all submissions." : "New submissions will appear here."}</p>
          {filtersActive && (
            <button className="text-button" type="button" onClick={onClearFilters}>Clear filters</button>
          )}
        </div>
      ) : feedback.map((item) => (
        <article className="feedback-row" key={item.id}>
          <div>
            <div className="feedback-meta">{item.name} · {new Date(item.createdAt).toLocaleDateString()}</div>
            <p>{item.message}</p>
            <span className="category-pill">{item.category}</span>
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
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

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

  const visibleFeedback = filterFeedback(feedback, category, status);
  const filtersActive = Boolean(category || status);

  function clearFilters() {
    setCategory("");
    setStatus("");
  }

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {!loading && !error && (
        <section className="filter-bar" aria-label="Feedback filters">
          <label>Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {CATEGORY_FILTERS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {STATUS_FILTERS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <button className="text-button" type="button" onClick={clearFilters} disabled={!filtersActive}>
            Clear filters
          </button>
        </section>
      )}
      <AdminFeedbackPanel
        loading={loading}
        error={error}
        feedback={visibleFeedback}
        totalCount={feedback.length}
        filtersActive={filtersActive}
        onRetry={loadFeedback}
        onClearFilters={clearFilters}
      />
    </main>
  );
}
