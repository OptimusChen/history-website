"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";

export interface Assignment {
  id: string;
  title: string;
  civilwar: string;
  description: string;
  link: string;
  authors: string;
  type: string; 
  image?: string;
}

export default function AssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWars, setSelectedWars] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/assignments.json")
      .then((res) => res.json())
      .then((data: Assignment[]) => setAssignments(data));
  }, []);

  // Update filters
  const toggleFilter = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const lowerValue = value.toLowerCase();
    const normalized = current.map((v) => v.toLowerCase());

    if (normalized.includes(lowerValue)) {
      // remove (preserve original casing of stored values)
      setter(current.filter((v) => v.toLowerCase() !== lowerValue));
    } else {
      setter([...current, value]);
    }
  };
 
  // Final filter logic
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = [a.title, a.civilwar, a.description, a.authors]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesWar =
      selectedWars.length === 0 || selectedWars.includes(a.civilwar);

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(a.type); // you must add `type` to your JSON

    return matchesSearch && matchesWar && matchesType;
  });

  return (
    <>
      {/* Top Bar */}
      <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-gray-800 text-center">
          Vacca History Portal
        </h1>

        {/* Optional items */}
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <button className="hover:text-black transition">All Assignments</button>
          <button className="hover:text-black transition">Submit</button>
          <button className="hover:text-black transition">About</button>
        </nav>
      </header>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm p-6 rounded-r-lg">
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Civil War</h3>
            {["Spain", "Vietnam", "El Salvador", "Nigeria"].map((war) => (
              <label key={war} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedWars.includes(war)}
                  onChange={() => toggleFilter(war, selectedWars, setSelectedWars)}
                />
                {war}
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Assignment Type</h3>
            {["Research Paper", "Documentary", "Map", "Other"].map((type) => (
              <label key={type} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                />
                {type}
              </label>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Vacca Advanced History Assignments
          </h1>

          {/* Show search bar again for mobile */}
          <div className="lg:hidden mb-6">
            <Input
              type="text"
              placeholder="El Salvador, Civil War, Author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssignments.map((assignment, index) => (
              <Card
                key={index}
                onClick={() => router.push(`/assignment/${assignment.id}`)}
                className="shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                {/* Image wrapped in padding for all sides */}
                <div className="p-4 pb-0 pt-0">
                  <img
                    src={
                      assignment.image && assignment.image.toLowerCase() !== "none"
                        ? assignment.image
                        : "/images/placeholder.jpg"
                    }
                    alt={assignment.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <CardContent className="p-4 pb-0 pt-2">
                  <p className="text-l font-semibold mb-2">{assignment.title}</p>
                  <p className="text-sm text-gray-500">{assignment.authors}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
