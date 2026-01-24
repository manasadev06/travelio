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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-wrapper">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">🤖 AI Trip Flowchart</h1>
          <p className="text-lg text-gray-600">
            Describe a trip idea and get a visual flowchart to understand it better.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateFlowchart()}
              placeholder="e.g. 3 day trip to Manali"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
            />

            <button
              onClick={generateFlowchart}
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform hover:-translate-y-0.5
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </span>
              ) : (
                "Generate Plan"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0 text-red-500">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {plan.text && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span> AI Explanation
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {plan.text}
              </div>
            </div>
          </div>
        )}

        {plan.chart && (
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🗺️</span> Flowchart
              </h3>
              <div className="p-4 border border-gray-200 rounded-xl bg-white overflow-x-auto">
                <MermaidDiagram chart={plan.chart} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
