import { useParams } from "react-router-dom";

export default function Destination() {
  const { slug } = useParams();

  return (
    <div style={{ padding: "100px 40px" }}>
      <h1>{slug}</h1>
      <p>Destination page coming soon</p>
    </div>
  );
}