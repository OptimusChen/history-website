"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero"; // adjust path as needed

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
      <Hero />
      
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 h-full overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm p-6 text-gray-900 dark:text-gray-200">
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

          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <button
              onClick={() => {
                const html = document.documentElement;
                html.classList.toggle("dark");
              }}
              className="ml-4 text-sm px-3 py-1 border border-gray text-gray dark:text-white dark:border-white rounded transition"
            >
              🌓 Toggle Theme
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto p-8">
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
                className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition cursor-pointer rounded-lg transform hover:scale-[1.02] transition duration-200"
              >
                {/* Image */}
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
                  <p className="text-l font-semibold mb-2 text-gray-800 dark:text-white">{assignment.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.authors}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
