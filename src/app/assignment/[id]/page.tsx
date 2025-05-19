'use client';

import { Assignment } from "../../page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { List } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function extractYouTubeID(url: string): string {
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?]+)/;
  const match = url.match(regExp);
  return match ? match[1] : "";
}

function ListComponent(items: string[], assignment: Assignment) {
  return (
    <ul>
      {(() => {
        const listItems = [];
        for (let i = 0; i < items.length; i++) {
          const link = items[i].trim();
          console.log(link);
          listItems.push(
            <div className="rounded-lg overflow-hidden shadow space-y-6">
              {link ? (
                <>
                  {/* Main File Rendering */}
                  {link.endsWith(".pdf") ? (
                    <iframe
                      src={link}
                      className="w-full min-h-[600px] h-[80vh] border rounded"
                      title="Assignment PDF"
                    />
                  ) : (
                    <>
                      {/* Media Content (Image, Video, etc.) */}
                      {link.endsWith(".mp4") && (
                        <video controls className="w-full rounded h-[80vh]">
                          <source src={link} type="video/mp4" />
                        </video>
                      )}

                      {(link.includes("youtube.com/watch") || link.includes("youtu.be")) && (
                        <div className="w-full mb-6" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeID(link)}`}
                            className="absolute top-0 left-0 w-full h-full rounded"
                            title="YouTube Video"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {(link.endsWith(".jpg") || link.endsWith(".png")) && (
                        <img
                          src={link}
                          alt="Assignment Image"
                          className="max-w-full max-h-[600px] w-auto h-auto mx-auto rounded shadow"
                        />
                      )}

                      {link.endsWith(".mp3") && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded">
                          <audio controls className="w-full">
                            <source src={link} type="audio/mp3" />
                          </audio>
                        </div>
                      )}

                      {link.endsWith(".txt") && (
                        <iframe
                          src={link}
                          className="w-full h-[80vh] border rounded bg-white text-sm"
                          title="Assignment Text"
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No file provided for this assignment.</p>
              )}
            </div>
          );
        }

        if (assignment.artistStatement && assignment.artistStatement !== "none") {
          listItems.push(
            <div key="artist-statement" className="mt-10">
              <h3 className="text-lg font-semibold mb-2 text-black text-center dark:text-white">Artist Statement</h3>
              <iframe
                src={assignment.artistStatement}
                className="w-full min-h-[600px] h-[60vh] border rounded bg-white"
                title="Artist Statement"
              />
            </div>
          );
        }

        return listItems;
      })()}
    </ul>
  );
}

export default function AssignmentPage(props: PageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const router = useRouter();

  // Load assignments from JSON
  useEffect(() => {
    fetch("/assignments.json")
      .then((res) => res.json())
      .then((data: Assignment[]) => setAssignments(data));
  }, []);

  // Once we have the assignments and the ID, find the one we need
  useEffect(() => {
    let isMounted = true;

    props.params.then(({ id }) => {
      const found = assignments.find((a) => a.id === id);
      if (isMounted) {
        setAssignment(found ?? null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [assignments, props.params]);

  if (assignment === null) return <p className="p-4">Loading or assignment not found.</p>;

  const links = assignment.link.split(";")

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar - fixed height */}
      <header className="w-full bg-[#003B71] text-white py-6 px-8 shadow shrink-0">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
      </header>

      {/* Content area below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed width, full height, no scroll */}
        <aside className="w-72 shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 px-6 py-6 text-gray-900 dark:text-gray-200">
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-sm px-4 py-2 border border-gray-300 dark:border-white text-gray-800 dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span className="text-lg">←</span>
            <span>Back to Assignments</span>
          </button>

          {/* Sidebar content */}
          <div className="mb-4">
            <h2 className="font-semibold text-sm text-gray-500">Civil War</h2>
            <p>{assignment.civilwar}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold text-sm text-gray-500">Authors</h2>
            <p>{assignment.authors}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold text-sm text-gray-500">Type</h2>
            <p>{assignment.type}</p>
          </div>

          <button
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="ml-4 text-sm px-3 py-1 border border-gray text-gray dark:text-white dark:border-white rounded transition"
          >
            🌓 Toggle Theme
          </button>
        </aside>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
            {ListComponent(links, assignment)}
        </main>
      </div>
    </div>
  );
}