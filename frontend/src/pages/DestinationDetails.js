import { useParams, useNavigate } from "react-router-dom";
import { destinations } from "../data/destinations";

export default function DestinationDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  console.log("URL slug:", slug);
console.log("All available slugs:", destinations.map(d => d.slug));


  const destination = destinations.find(
    (dest) => dest.slug === slug
  );

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Destination Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {destination.name}
            </h1>
            <p className="text-xl">
              📍 {destination.country}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-lg">
              ⭐ {destination.rating} ({destination.reviews} reviews)
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 px-4 container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">About this destination</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {destination.description}
        </p>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Community Experiences
            </h2>
            <button
              onClick={() => navigate("/upload-trip")}
              className="px-6 py-3 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition"
            >
              Share Your Experience
            </button>
          </div>

          {/* Placeholder (we will connect trips next) */}
          <div className="text-center text-gray-600 py-10">
            Trips for this destination will appear here.
          </div>
        </div>
      </section>

    </div>
  );
}
