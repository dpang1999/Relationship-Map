"use client";

import { useEffect, useState } from "react";
import GraphView from "@/components/GraphView";

export default function Home() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/graph");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch graph data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, notes }),
    });
    
    setName("");
    setNotes("");
    fetchData();
  };

  return (
    <main className="flex min-h-screen flex-col p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Relationship Map</h1>
        
        {/* Simple Add Person Form */}
        <form onSubmit={handleAddPerson} className="flex gap-2 bg-gray-100 p-2 rounded-lg items-center">
          <input
            type="text"
            placeholder="Name"
            className="px-3 py-1 rounded border border-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Fact / Notes"
            className="px-3 py-1 rounded border border-gray-300"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded font-medium hover:bg-blue-700 transition"
          >
            Add Person
          </button>
        </form>
      </div>

      <div className="flex-grow flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500">Loading map...</p>
        ) : data.nodes.length > 0 ? (
          <GraphView data={data} />
        ) : (
          <div className="text-center p-12 bg-gray-50 rounded-lg w-full">
            <h2 className="text-xl text-gray-600 mb-2">No people added yet</h2>
            <p className="text-gray-400">Use the form above to add your first person!</p>
          </div>
        )}
      </div>
    </main>
  );
}
