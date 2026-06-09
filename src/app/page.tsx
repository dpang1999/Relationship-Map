"use client";

import { useEffect, useState } from "react";
import GraphView from "@/components/GraphView";

export default function Home() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  // Search states
  const [allPeople, setAllPeople] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      const [graphRes, peopleRes] = await Promise.all([
        fetch("/api/graph"),
        fetch("/api/people")
      ]);
      const graphJson = await graphRes.json();
      const peopleJson = await peopleRes.json();
      setData(graphJson);
      setAllPeople(peopleJson);
      const tags = [...new Set(peopleJson.flatMap((p: any) => p.tags.map((t: any) => t.name)))] as string[];
      setAllTags(tags.sort());
    } catch (error) {
      console.error("Failed to fetch graph data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPeople = allPeople.filter(person => {
    const matchesText = person.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesTags = selectedTags.every(tag => person.tags.some((t: any) => t.name === tag));
    return matchesText && matchesTags;
  });

  const filteredIds = new Set(filteredPeople.map((p: any) => p.id));

  const filteredData = {
    nodes: data.nodes.filter((n: any) => filteredIds.has(n.id)),
    links: data.links.filter((l: any) => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      return filteredIds.has(sourceId) && filteredIds.has(targetId);
    })
  };

  

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


      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-3 py-1 rounded border border-gray-300"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTags(prev =>
              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
            )}
            className={`text-xs px-2 py-1 rounded-full border transition ${
              selectedTags.includes(tag)
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex-grow flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500">Loading map...</p>
        ) : filteredData.nodes.length > 0 ? (
          <GraphView data={filteredData} />
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
