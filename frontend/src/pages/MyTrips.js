import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {

    const fetchTrips = async () => {

      try {

        const res = await API.get("/trips/my-trips");
        setTrips(res.data);

      } catch (err) {

        console.error(err);

      }

    };

    fetchTrips();

  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        My Saved Trips
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {trips.map(trip => (

  <div
    key={trip._id}
    onClick={() => navigate(`/trip/${trip._id}`)}
    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
  >

    <img
      src={`http://localhost:5000/${trip.cover_image}`}
      alt=""
      className="rounded-lg mb-3"
    />

    <h3 className="font-bold">
      {trip.title}
    </h3>

    <p className="text-sm text-gray-600">
      {trip.short_summary}
    </p>

  </div>

))}

      </div>

    </div>
  );
}