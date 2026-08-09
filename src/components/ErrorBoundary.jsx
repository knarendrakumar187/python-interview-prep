import { Component } from "react";
import { Link } from "react-router-dom";

/** Keeps the shell (nav) visible if a page crashes. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="panel p-8 text-center max-w-lg mx-auto mt-10">
          <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2 leading-relaxed">
            This page hit an unexpected error. Try another question, or go back
            home.
          </p>
          <pre className="mt-4 text-left text-xs font-mono bg-[var(--color-paper)] border border-[var(--color-line)] p-3 overflow-auto text-rose-600">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div className="flex gap-2 justify-center mt-5">
            <Link to="/" className="btn-primary">
              Dashboard
            </Link>
            <Link to="/questions" className="btn-ghost">
              All questions
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
