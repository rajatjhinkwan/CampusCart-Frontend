// ErrorBoundary.jsx
import React from "react";

// Extract file + line + column from stack trace
function parseStack(stack) {
  if (!stack) return null;

  const lines = stack.split("\n");

  for (const l of lines) {
    // Detect format like /src/components/App.jsx:23:10
    const match = l.match(/(\/src\/.*):(\d+):(\d+)/);
    if (match) {
      return {
        file: match[1],
        line: match[2],
        column: match[3],
      };
    }
  }
  return null;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  // Copy stack, file, line, column, and message
  handleCopy = () => {
    const { error } = this.state;
    const parsed = parseStack(error?.stack);

    const report = [
      "🔥 React Runtime Error Report",
      "-----------------------------------",
      `Error: ${error?.toString()}`,
      parsed
        ? [
            "",
            "📍 LOCATION",
            `File  : ${parsed.file}`,
            `Line  : ${parsed.line}`,
            `Column: ${parsed.column}`,
          ].join("\n")
        : "📍 Source map not found (enable sourcemap: true)",
      "",
      "🔎 STACK TRACE",
      error?.stack,
    ].join("\n\n");

    navigator.clipboard.writeText(report);
    alert("Debug report copied to clipboard!");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const parsed = parseStack(this.state.error?.stack);

    return (
      <div
        style={{
          padding: "20px",
          background: "#fff4f4",
          border: "1px solid #d03c3c",
          margin: "20px",
          borderRadius: "10px",
          fontFamily: "monospace",
        }}
      >
        <h2 style={{ color: "#b70000" }}>❌ React Runtime Error</h2>

        <p
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {this.state.error?.toString()}
        </p>

        {parsed ? (
          <div style={{ marginBottom: "15px" }}>
            <p>📍 <strong>Location:</strong></p>
            <p>File: {parsed.file}</p>
            <p>Line: {parsed.line}</p>
            <p>Column: {parsed.column}</p>
          </div>
        ) : (
          <p style={{ color: "#444" }}>
            ⚠ Enable <strong>sourcemap: true</strong> in Vite to show file + line.
          </p>
        )}

        <button
          onClick={this.handleCopy}
          style={{
            padding: "8px 12px",
            background: "#b70000",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        >
          📋 Copy Full Debug Report
        </button>

        <h3 style={{ marginTop: "10px" }}>🔎 Full Stack Trace</h3>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#fff",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            maxHeight: "350px",
            overflow: "auto",
          }}
        >
          {this.state.error?.stack}
        </pre>
      </div>
    );
  }
}

export default ErrorBoundary;
