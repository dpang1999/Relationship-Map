"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit2, Trash2, X, Save } from "lucide-react";

export default function PersonProfile({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [person, setPerson] = useState<any>(null);
  const [allPeople, setAllPeople] = useState<any[]>([]);
  const [color, setColor] = useState<string>("#6b7280");
  
  // Connection form state
  const [targetPersonId, setTargetPersonId] = useState("");
  const [label, setLabel] = useState("");

  // Edit person state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editColor, setEditColor] = useState<string>("#6b7280");

  // Edit tags
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const fetchData = async () => {
    const res = await fetch(`/api/people/${id}`);
    if (res.ok) {
      const data = await res.json();
      setPerson(data);
      setEditName(data.name);
      setEditNotes(data.notes || "");
      setColor(data.color || "#6b7280");
      setEditColor(data.color || "#6b7280");
      setEditTags(data.tags?.map((t: any) => t.name) || []);
    } else {
      router.push("/");
    }
  };

  const fetchAllPeople = async () => {
    const res = await fetch("/api/people");
    if (res.ok) {
      const data = await res.json();
      setAllPeople(data.filter((p: any) => p.id !== id));
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllPeople();
  }, [id]);

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPersonId || !label) return;

    await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPersonId: id,
          toPersonId: targetPersonId,
          label
        }),
    });

    setTargetPersonId("");
    setLabel("");
    fetchData();
  };

  const handleDeleteConnection = async (connId: string) => {
    if (!window.confirm("Are you sure you want to remove this connection?")) return;
    await fetch(`/api/connections/${connId}`, { method: "DELETE" });
    fetchData();
  };

  const handleUpdatePerson = async () => {
    if (!editName) return;
    await fetch(`/api/people/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, notes: editNotes, color: editColor, tags: editTags })
    });
    setIsEditing(false);
    fetchData();
  };

  const handleDeletePerson = async () => {
    if (!window.confirm(`Are you sure you want to delete ${person.name} and all their connections? This cannot be undone.`)) return;
    await fetch(`/api/people/${id}`, { method: "DELETE" });
    router.push("/");
  };

  if (!person) return <div className="p-8 text-gray-500">Loading profile...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Map
        </Link>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
          {!isEditing ? (
            <>
              <div className="absolute top-6 right-6 flex gap-2">
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition" title="Edit Profile">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={handleDeletePerson} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition" title="Delete Person">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: person.color || color }} />
                  <h1 className="text-4xl font-bold mb-2 text-white-900">{person.name}</h1>
                </div>
              </div>
              {person.notes && (
                <p className="text-white-700 text-lg whitespace-pre-wrap">{person.notes}</p>
              )}
              {person.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {person.tags.map((tag: any) => (
                    <span key={tag.id} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 pr-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Notes / Facts</label>
                <textarea className="w-full px-3 py-2 border rounded-lg min-h-[100px] text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" value={editNotes} onChange={e => setEditNotes(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" className="w-12 h-10 p-0 border rounded-md" value={editColor} onChange={e => setEditColor(e.target.value)} />
                  <div className="text-sm text-gray-500">Selected: <span className="inline-block w-4 h-4 rounded-full align-middle ml-2" style={{ backgroundColor: editColor }} /></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {editTags.map(tag => (
                    <span key={tag} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => setEditTags(editTags.filter(t => t !== tag))}>×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. computer science)"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const t = tagInput.trim().toLowerCase();
                        if (t && !editTags.includes(t)) setEditTags([...editTags, t]);
                        setTagInput("");
                      }
                    }}
                  />
                  <button type="button" onClick={() => {
                    const t = tagInput.trim().toLowerCase();
                    if (t && !editTags.includes(t)) setEditTags([...editTags, t]);
                    setTagInput("");
                  }} className="px-3 py-2 border rounded-lg text-gray-400 text-sm hover:bg-gray-50">Add</button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleUpdatePerson} className="flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-white-900">Connections</h2>
            
            {person.outgoingConnections.length === 0 && person.incomingConnections.length === 0 && (
              <p className="text-gray-500 italic">No connections yet.</p>
            )}

            <ul className="space-y-4">
              {person.outgoingConnections.map((conn: any) => (
                <li key={conn.id} className="flex items-center justify-between text-gray-700 group pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      {conn.label}
                    </span>
                    &rarr; 
                    <Link href={`/person/${conn.toPersonId}`} className="ml-2 font-medium text-blue-600 hover:underline">
                      {conn.toPerson.name}
                    </Link>
                  </div>
                  <button onClick={() => handleDeleteConnection(conn.id)} className="p-1 px-2 text-xs rounded text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition">
                    Remove
                  </button>
                </li>
              ))}
              
              {person.incomingConnections.map((conn: any) => (
                <li key={conn.id} className="flex items-center justify-between text-gray-700 group pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-2">
                      is {conn.label} of
                    </span>
                    &larr;
                    <Link href={`/person/${conn.fromPersonId}`} className="ml-2 font-medium text-blue-600 hover:underline">
                      {conn.fromPerson.name}
                    </Link>
                  </div>
                  <button onClick={() => handleDeleteConnection(conn.id)} className="p-1 px-2 text-xs rounded text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-white-900">
              <Plus className="w-5 h-5 mr-1" /> Add Connection
            </h2>
            <form onSubmit={handleAddConnection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">They are...</label>
                <input
                  type="text"
                  placeholder="e.g. Girlfriend's best friend"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">...to...</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={targetPersonId}
                  onChange={(e) => setTargetPersonId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a person</option>
                  {allPeople.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Add Connection
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
