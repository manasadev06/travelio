import { useState,useEffect } from "react";
import "leaflet/dist/leaflet.css";
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
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";
import { Handle, Position } from "reactflow";
import { useMap } from "react-leaflet";
import L from "leaflet";
import customMarker from "../assets/marker.png";
const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [35, 45],     // adjust size
  iconAnchor: [17, 45],   // bottom center of marker
  popupAnchor: [0, -40]   // popup position
});

function MapUpdater({ location }) {
  const map = useMap();

  if (location) {
    map.flyTo([location.lat, location.lng], 10);
  }

  return null;
}
// const locationDB = {
//   Manali: { lat: 32.2432, lng: 77.1892 },
//   "Solang Valley": { lat: 32.3168, lng: 77.1569 },
//   "Rohtang Pass": { lat: 32.3716, lng: 77.2462 },
//   Delhi: { lat: 28.6139, lng: 77.2090 },
//   Paris: { lat: 48.8566, lng: 2.3522 }
// };

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCoordinates(place) {
  try {

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1&countrycodes=in`;

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        name: place
      };
    }

    return null;

  } catch (error) {
    console.log("Geocode failed for:", place);
    return null;
  }
}

export default function AIFlowchart() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredLocation, setHoveredLocation] = useState(null);
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
      const res = await fetch("http://localhost:5678/webhook/get-name", {
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
    <div className="max-w-7xl mx-auto grid grid-cols-[1fr_420px] gap-8">  
      <div className="flex-1">
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
                <DayCarousel
                  days={plan.days}
                  setHoveredLocation={setHoveredLocation}
                    getCoordinates={getCoordinates}
                />
              </div>
            )}

        </div>
      </div>

        {/* RIGHT SIDE MAP */}
        <div className="w-[450px] sticky top-8 h-[600px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater location={hoveredLocation} />

            {hoveredLocation && (
              <Marker position={[hoveredLocation.lat, hoveredLocation.lng]} icon={customIcon}>
                <Popup>{hoveredLocation.name}</Popup>
              </Marker>
            )}
          </MapContainer>
      </div>

    </div>
  );
}