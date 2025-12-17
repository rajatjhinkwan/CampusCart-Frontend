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
    this.state = { hasError: false, error: null, errorInfo: null, backendError: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  componentDidMount() {
    window.addEventListener("backend-error", this.handleBackendError);
  }

  componentWillUnmount() {
    window.removeEventListener("backend-error", this.handleBackendError);
  }

  handleBackendError = (evt) => {
    const detail = evt?.detail || {};
    this.setState({ backendError: detail });
  };

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

  handleBackendCopy = () => {
    const e = this.state.backendError || {};
    const report = [
      "🔥 Backend Error Report",
      "-----------------------------------",
      `Message   : ${e.message || ""}`,
      `Status    : ${e.status || ""}`,
      `Path      : ${e.path || ""}`,
      `Method    : ${e.method || ""}`,
      `RequestId : ${e.requestId || ""}`,
      e.file ? `File      : ${e.file}` : "",
      e.file ? `Line      : ${e.line}` : "",
      e.file ? `Column    : ${e.column}` : "",
      "",
      "Copy Text",
      e.copyText || "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(report);
    alert("Backend debug report copied to clipboard!");
  };

  render() {
    const backendError = this.state.backendError;
    if (!this.state.hasError) {
      return (
        <>
          {this.props.children}
          {backendError && (
            <div
              style={{
                position: "fixed",
                right: 20,
                bottom: 20,
                width: 360,
                padding: "14px",
                background: "#fff8e6",
                border: "1px solid #e0a800",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                fontFamily: "monospace",
                zIndex: 9999,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#8a6d3b" }}>⚠ Backend Error</strong>
                <button
                  onClick={() => this.setState({ backendError: null })}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#8a6d3b",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginTop: 8, color: "#8a6d3b" }}>
                <div style={{ fontWeight: "bold" }}>{backendError.message || "Request failed"}</div>
                <div>Status: {backendError.status}</div>
                <div>Path: {backendError.path}</div>
                {backendError.file && (
                  <div style={{ marginTop: 6 }}>
                    <div>File: {backendError.file}</div>
                    <div>Line: {backendError.line}</div>
                    <div>Column: {backendError.column}</div>
                  </div>
                )}
                {backendError.requestId && <div>RequestId: {backendError.requestId}</div>}
              </div>
              <button
                onClick={this.handleBackendCopy}
                style={{
                  marginTop: 10,
                  padding: "6px 10px",
                  background: "#e0a800",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                📋 Copy Backend Error
              </button>
            </div>
          )}
        </>
      );
    }

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
