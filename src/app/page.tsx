"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero"; // adjust path as needed
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/next"

export interface Assignment {
  id: string;
  title: string;
  civilwar: string;
  description: string;
  link: string;
  authors: string;
  type: string; 
  image?: string;
  artistStatement?: string;
}

function SidebarContent({
  searchQuery,
  setSearchQuery,
  selectedWars,
  selectedTypes,
  toggleFilter,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedWars: string[];
  selectedTypes: string[];
  toggleFilter: (
    value: string,
    current: string[],
    type: string
  ) => void;
}) {
  return (
    <>
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
        {["Spain", "Vietnam", "El Salvador", "Nigeria", "Ethiopia"].map((war) => (
          <label key={war} className="block text-sm mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedWars.includes(war)}
              onChange={() => toggleFilter(war, selectedWars, "wars")}
            />
            {war}
          </label>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Assignment Type</h3>
        {["Research Paper", "Documentary", "Choice Project"].map((type) => (
          <label key={type} className="block text-sm mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedTypes.includes(type)}
              onChange={() => toggleFilter(type, selectedTypes, "types")}
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

      <p className="mt-auto text-xs">
        Built by{' '}
        <a
          href="https://github.com/OptimusChen"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Derek Chen
        </a>{' '}
        — © {new Date().getFullYear()}
      </p>
    </>
  );
}

export default function AssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWars, setSelectedWars] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    type : string
  ) => {
    const lowerValue = value.toLowerCase();
    const normalized = current.map((v) => v.toLowerCase());

    if (normalized.includes(lowerValue)) {
      // remove (preserve original casing of stored values)
      if (type === "wars")
        setSelectedWars(current.filter((v) => v.toLowerCase() !== lowerValue));
      if (type === "types")
        setSelectedTypes(current.filter((v) => v.toLowerCase() !== lowerValue));
    } else {
      if (type === "wars")
        setSelectedWars([...current, value]);
      if (type === "types")
        setSelectedTypes([...current, value]);
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
    <div className="flex h-screen flex-col">
      <Analytics />
      <Hero />

      {/* Mobile sidebar toggle button */}
      <button
        className="sm:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white px-3 py-2 rounded shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open filters"
      >
        ☰ Filters
      </button>
      
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <aside className="w-64 h-full overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm p-6 text-gray-900 dark:text-gray-200 flex flex-col hidden sm:flex">
          <SidebarContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedWars={selectedWars}
            selectedTypes={selectedTypes}
            toggleFilter={toggleFilter}
          />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex sm:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <aside className="relative w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-lg p-6 text-gray-900 dark:text-gray-200 flex flex-col z-50">
              <button
                className="absolute top-2 right-2 text-gray-700 dark:text-gray-200 text-2xl"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
              >
                ×
              </button>
              
              

              <SidebarContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedWars={selectedWars}
                selectedTypes={selectedTypes}
                toggleFilter={toggleFilter}
              />
            </aside>
          </div>
        )}

        <main className="flex-1 h-full overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {filteredAssignments.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-white mt-12 flex flex-col items-center gap-4">
                  {/* Light mode image */}
                  <img
                    src="/images/confused-light.png"
                    alt="No results"
                    className="w-32 h-32 dark:hidden"
                  />

                  {/* Dark mode image */}
                  <img
                    src="/images/confused-dark.png"
                    alt="No results"
                    className="w-32 h-32 hidden dark:block"
                  />

                  <p>No assignments found. Try adjusting your filters or search terms.</p>
                </div>
              ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssignments.map((assignment, index) => (
                  <Card
                    key={index}
                    onClick={() => {
                      router.push(`/assignment/${assignment.id}`);
                    }}
                    className="relative group border border-gray-200 dark:border-gray-700 shadow-lg transition cursor-pointer rounded-lg overflow-hidden transform hover:scale-[1.02] duration-200"
                  >
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition duration-200 z-10 rounded-lg"></div>

                    <div className="p-4 pb-0 pt-0 relative z-20">
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

                    <CardContent className="p-4 pb-0 pt-2 relative z-20">
                      <p className="text-l font-semibold mb-2 text-gray-800 dark:text-white truncate max-w-xs">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.authors}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {assignment.civilwar}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {assignment.type}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}