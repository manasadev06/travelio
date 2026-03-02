import { useState } from "react";
import DayCarousel from "../components/DayCarousel";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from "reactflow";
import "reactflow/dist/style.css";

import { useEffect } from "react";
import { Handle, Position } from "reactflow";

/* Editable Ellipse Node */
function EditableNode({ id, data }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label);

  const handleBlur = () => {
    setEditing(false);

    data.setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: value } }
          : node
      )
    );
  };

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      style={{
        padding: 12,
        borderRadius: 50,
        border: "2px solid #0d9488",
        background: "#f0fdfa",
        fontWeight: 600,
        textAlign: "center",
        minWidth: 120
      }}
    >
      <Handle type="target" position={Position.Top} />

      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            textAlign: "center",
            width: "100%"
          }}
        />
      ) : (
        value
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  editable: EditableNode
};

export default function AIFlowchart() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [plan, setPlan] = useState({
    text: "",
    graph: { nodes: [], edges: [] },
    days: []
  });

  const [error, setError] = useState("");

  const generateFlowchart = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    // ✅ FIXED RESET (graph not chart)
    setPlan({
      text: "",
      graph: { nodes: [], edges: [] },
      days: []
    });

    try {
      const res = await fetch("http://localhost:5678/webhook/get-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log("FULL RESPONSE:", data);

      // ✅ Safe parse graph
      const rawGraph =
        typeof data.graph === "string"
          ? JSON.parse(data.graph)
          : data.graph || { nodes: [], edges: [] };

      // ✅ Transform to React Flow format
      const transformGraph = (graph) => {
        if (!graph || !graph.nodes || !graph.edges) {
          return { nodes: [], edges: [] };
        }

        const nodes = graph.nodes.map((node, index) => ({
          id: node.id,
          type: "editable",
          data: {
            label: node.label,
            setNodes
          },
          position: { x: 250, y: index * 120 }

        }));

        const edges = graph.edges.map((edge, index) => ({
          id: `e-${index}`,
          source: edge.source,
          target: edge.target,
          animated: true,
          style: { stroke: "#0d9488" }
        }));

        return { nodes, edges };
      };

      const transformedGraph = transformGraph(rawGraph);

      setPlan({
        text: (data.textPlan || "").trim(),
        graph: transformedGraph,
        days: Array.isArray(data.itinerary)
          ? data.itinerary
          : typeof data.itinerary === "string"
            ? JSON.parse(data.itinerary)
            : []
      });
      setNodes(transformedGraph.nodes);
      setEdges(transformedGraph.edges);
    } catch (err) {
      console.error(err);
      setError("Could not connect to AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            🤖 AI Trip Flowchart
          </h1>
          <p className="text-lg text-gray-600">
            Describe a trip idea and get a visual flowchart.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateFlowchart()}
              placeholder="e.g. 3 day trip to Manali"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300"
            />

            <button
              onClick={generateFlowchart}
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-bold text-white
                ${loading
                  ? "bg-gray-400"
                  : "bg-teal-600 hover:bg-teal-700"
                }`}
            >
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* TEXT PLAN */}
        {plan.text && (
          <div className="mt-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                📋 AI Explanation
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 whitespace-pre-wrap">
                {plan.text}
              </div>
            </div>
          </div>
        )}

        {/* FLOWCHART */}
        {plan.graph?.nodes?.length > 0 && (
          <div className="mt-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🗺️ Flowchart
              </h3>

              <div style={{ height: 500, padding: 20 }}>
                <button
                    onClick={() => {
                      const newNode = {
                        id: Date.now().toString(),
                        type: "editable",
                        position: { x: 250, y: nodes.length * 120 },
                        data: {
                          label: "New Step",
                          setNodes
                        }
                      };

                      setNodes((nds) => [...nds, newNode]);
                    }}
                    className="mb-4 px-4 py-2 bg-teal-600 text-white rounded-lg"
                  >
                    ➕ Add Step
                  </button>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                  deleteKeyCode={['Backspace', 'Delete']}
                  fitView
                >
                  <MiniMap />
                  <Controls />
                  <Background gap={12} size={1} />
                </ReactFlow>
              </div>
            </div>
          </div>
        )}

        {/* DAY CAROUSEL */}
        {plan.days.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              📅 Trip Breakdown
            </h3>
            <DayCarousel days={plan.days} />
          </div>
        )}

      </div>
    </div>
  );
}