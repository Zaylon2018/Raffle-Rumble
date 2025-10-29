import { useEffect, useState } from "react";

export default function Home() {
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    fetch("/api/raffles")
      .then((res) => res.json())
      .then((data) => setRaffles(data))
      .catch((err) => console.error("Error loading raffles:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Raffles</h1>
      {raffles.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {raffles.map((r) => (
            <div key={r.id} className="border p-4 rounded-lg shadow">
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{r.title}</h2>
              <p className="text-gray-600">${r.price} per ticket</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
