'use client';

import { Assignment } from "../../page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
      <header className="w-full bg-[#003B71] text-white py-6 px-8 shadow">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
      </header>

      {/* Main layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-800 border-r dark:border-gray-700 px-6 py-6 text-gray-900 dark:text-gray-200 overflow-y-auto">
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-sm px-4 py-2 border border-gray-300 dark:border-white text-gray-800 dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span className="text-lg">←</span>
            <span>Back to Assignments</span>
          </button>
          
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

          <div className="mb-4">
            <h2 className="font-semibold text-sm text-gray-500">Description</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {assignment.description}
            </p>
          </div>

          <button
            onClick={async () => {
              const html = document.documentElement;
              html.classList.toggle("dark");
            }}
            className="ml-4 text-sm px-3 py-1 border border-gray text-gray dark:text-white dark:border-white rounded transition"
          >
            🌓 Toggle Theme
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="rounded-lg overflow-hidden shadow">
            {assignment.link ? (
              <>
                {assignment.link.endsWith(".pdf") && (
                  <iframe
                    src={assignment.link}
                    className="w-full h-[80vh] border rounded"
                    title="Assignment PDF"
                  />
                )}

                {assignment.link.endsWith(".mp4") && (
                  <video controls className="w-full rounded h-[80vh]">
                    <source src={assignment.link} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {(assignment.link.endsWith(".jpg") ||
                  assignment.link.endsWith(".png")) && (
                  <img
                    src={assignment.link}
                    alt="Assignment Image"
                    className="w-full h-auto rounded shadow"
                  />
                )}

                {assignment.link.endsWith(".mp3") && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded">
                    <audio controls className="w-full">
                      <source src={assignment.link} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {assignment.link.endsWith(".txt") && (
                  <iframe
                    src={assignment.link}
                    className="w-full h-[80vh] border rounded bg-white text-sm"
                    title="Assignment Text"
                  />
                )}

                {![".pdf", ".mp4", ".jpg", ".png", ".mp3", ".txt"].some(ext =>
                  assignment.link.endsWith(ext)
                ) && (
                  <a
                    href={assignment.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open Assignment Link
                  </a>
                )}
              </>
            ) : (
              <p className="text-gray-500">No file provided for this assignment.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}