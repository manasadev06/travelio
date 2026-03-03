import { useState } from "react";

export default function DayCarousel({ days }) {
  const [current, setCurrent] = useState(0);

  if (!days || days.length === 0) return null;

  const day = days[current];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-2">
        Day {day.day}: {day.title}
      </h3>

      <p className="text-gray-600 mb-4">{day.theme}</p>

      <div className="space-y-4">
        {day.places?.map((place, index) => (
  <div
    key={index}
    className="flex gap-6 p-5 border rounded-xl bg-gray-50"
  >
    {/* LEFT SIDE - TEXT */}
    <div className="flex-1">
      <h4 className="font-semibold text-lg text-gray-800">
        {place.name}
      </h4>

      <p className="text-sm text-gray-600 mt-1">
        {place.description}
      </p>

      <p className="text-sm text-gray-500 mt-3">
        🕒 {place.time}
      </p>

      <p className="text-sm text-teal-600 mt-1">
        🚗 {place.transport?.mode} • {place.transport?.duration}
      </p>
    </div>

    {/* RIGHT SIDE - IMAGE */}
    {place.image && (
      <div className="w-40 h-32 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    )}
  </div>
))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
          disabled={current === 0}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>

        <button
          onClick={() =>
            setCurrent((prev) => Math.min(prev + 1, days.length - 1))
          }
          disabled={current === days.length - 1}
          className="px-4 py-2 bg-teal-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}