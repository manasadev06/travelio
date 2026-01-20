import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize Mermaid once
mermaid.initialize({
  startOnLoad: false,
  theme: "forest",
  securityLevel: "loose",
  flowchart: { useMaxWidth: true, htmlLabels: true },
});

/* ---------------- Mermaid Renderer ---------------- */

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !chart) return;

    let cleanChart = chart
      .replace(/\\n/g, "\n")
      .replace(/flowchart TD/gi, "")
      .replace(/mermaid/gi, "")
      .trim();

    if (!cleanChart.includes("\n")) {
      cleanChart = cleanChart.replace(/ --> /g, "\n--> ");
    }

    const finalChart = `flowchart TD\n${cleanChart}`;

    ref.current.innerHTML = "";
    ref.current.removeAttribute("data-processed");

    const render = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, finalChart);
        if (ref.current) ref.current.innerHTML = svg;
      } catch {
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="color:red; font-size:12px; border:1px solid red; padding:8px;">
              Mermaid syntax error
            </div>
          `;
        }
      }
    };

    render();
  }, [chart]);

  return <div ref={ref} style={{ width: "100%", overflowX: "auto" }} />;
};

/* ---------------- AI Flowchart Page ---------------- */

export default function AIFlowchart() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState({ text: "", chart: "" });
  const [error, setError] = useState("");

  const generateFlowchart = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setPlan({ text: "", chart: "" });

    try {
      const res = await fetch("http://localhost:5678/webhook/get-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      setPlan({
        text: (data.textPlan || "").trim(),
        chart: (data.mermaidCode || "").trim(),
      });
    } catch {
      setError("Could not connect to AI service. Is n8n running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
      <h1>🤖 AI Trip Flowchart</h1>
      <p style={{ color: "#555" }}>
        Describe a trip idea and get a visual flowchart to understand it better.
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateFlowchart()}
          placeholder="e.g. 3 day trip to Manali"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={generateFlowchart}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: "6px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "16px" }}>{error}</p>
      )}

      {plan.text && (
        <div style={{ marginTop: "40px" }}>
          <h3>📋 AI Explanation</h3>
          <div
            style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            }}
          >
            {plan.text}
          </div>
        </div>
      )}

      {plan.chart && (
        <div style={{ marginTop: "40px" }}>
          <h3>🗺️ Flowchart</h3>
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "white",
            }}
          >
            <MermaidDiagram chart={plan.chart} />
          </div>
        </div>
      )}
    </div>
  );
}
