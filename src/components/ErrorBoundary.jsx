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
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      backendError: null,
      isChunkError: false,
      detailsOpen: false
    };
  }

  static getDerivedStateFromError(error) {
    const errorStr = error?.message || error?.toString() || "";
    const isChunkError = /Failed to fetch dynamically imported module|ChunkLoadError|Loading chunk/i.test(errorStr);
    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    const errorStr = error?.message || error?.toString() || "";
    const isChunkError = /Failed to fetch dynamically imported module|ChunkLoadError|Loading chunk/i.test(errorStr);
    if (isChunkError) {
      const lastReload = sessionStorage.getItem("last-chunk-error-reload");
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem("last-chunk-error-reload", now.toString());
        window.location.reload();
      }
    }
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
    const { hasError, error, isChunkError, detailsOpen, backendError } = this.state;
    if (!hasError) {
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
                padding: "16px",
                background: "rgba(30, 27, 22, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(224, 168, 0, 0.3)",
                color: "#ffeeba",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                fontFamily: "system-ui, sans-serif",
                zIndex: 9999,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#ffd54f", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "18px" }}>⚠️</span> Backend Warning
                </strong>
                <button
                  onClick={() => this.setState({ backendError: null })}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ffd54f",
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: "14px", lineHeight: "1.4" }}>
                <div style={{ fontWeight: "bold", color: "#fff" }}>{backendError.message || "Request failed"}</div>
                <div style={{ marginTop: 4, opacity: 0.8 }}>Status: {backendError.status}</div>
                <div style={{ opacity: 0.8 }}>Path: {backendError.path}</div>
                {backendError.file && (
                  <div style={{ marginTop: 6, padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px" }}>
                    <div>File: {backendError.file}</div>
                    <div>Line: {backendError.line}</div>
                    <div>Column: {backendError.column}</div>
                  </div>
                )}
                {backendError.requestId && <div style={{ opacity: 0.6, fontSize: "12px", marginTop: 4 }}>ID: {backendError.requestId}</div>}
              </div>
              <button
                onClick={this.handleBackendCopy}
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#e0a800",
                  color: "#000",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontSize: "13px",
                  width: "100%",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                📋 Copy Backend Error Report
              </button>
            </div>
          )}
        </>
      );
    }

    const parsed = parseStack(error?.stack);

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top right, #111827, #030712)",
          color: "#f3f4f6",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            background: "rgba(17, 24, 39, 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          {/* Animated Icon Container */}
          <div
            style={{
              width: "80px",
              height: "80px",
              background: isChunkError ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 68, 68, 0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              border: isChunkError ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {isChunkError ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>

          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "12px",
              background: isChunkError
                ? "linear-gradient(to right, #60a5fa, #3b82f6)"
                : "linear-gradient(to right, #fca5a5, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isChunkError ? "Update Available" : "Application Error"}
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#9ca3af",
              marginBottom: "32px",
            }}
          >
            {isChunkError
              ? "We've added new features and updates to CampusCart! Let's reload the page to load the latest version."
              : "CampusCart encountered an unexpected problem. Try reloading the page, or view the details below if the problem persists."}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <button
              onClick={() => window.location.reload()}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: isChunkError
                  ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                  : "linear-gradient(135deg, #ef4444, #b91c1c)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: isChunkError
                  ? "0 4px 20px rgba(59, 130, 246, 0.4)"
                  : "0 4px 20px rgba(239, 68, 68, 0.4)",
                transition: "transform 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              🔄 Reload & Update
            </button>

            {/* Accordion Trigger */}
            <button
              onClick={() => this.setState({ detailsOpen: !detailsOpen })}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "14px",
                padding: "8px",
                textDecoration: "underline",
                outline: "none",
              }}
            >
              {detailsOpen ? "Hide technical details" : "Show technical details"}
            </button>
          </div>

          {/* Collapsible Technical Details */}
          {detailsOpen && (
            <div
              style={{
                textAlign: "left",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            >
              <div style={{ color: "#f87171", fontWeight: "bold", marginBottom: "12px", wordBreak: "break-all" }}>
                {error?.toString()}
              </div>

              {parsed && (
                <div style={{ marginBottom: "16px", color: "#e5e7eb" }}>
                  <strong>📍 Location:</strong>
                  <div style={{ marginTop: "4px", opacity: 0.8 }}>File: {parsed.file}</div>
                  <div style={{ opacity: 0.8 }}>Line: {parsed.line}</div>
                  <div style={{ opacity: 0.8 }}>Column: {parsed.column}</div>
                </div>
              )}

              <button
                onClick={this.handleCopy}
                style={{
                  padding: "6px 12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  cursor: "pointer",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "12px",
                }}
              >
                📋 Copy Full Debug Report
              </button>

              <div style={{ fontWeight: "bold", marginBottom: "6px", color: "#e5e7eb" }}>🔎 Stack Trace:</div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  maxHeight: "200px",
                  overflowY: "auto",
                  color: "#9ca3af",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                {error?.stack}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
