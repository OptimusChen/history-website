import { notFound } from "next/navigation";
import { Assignment } from "../../page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentPage(props: PageProps) {
  const { id } = await props.params;
  const res = await fetch("http://localhost:3000/assignments.json"); // replace with full URL in prod
  const data = await res.json();

  const assignment = data.find((a: Assignment) => a.id === id);

  if (!assignment) return notFound();

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
      <p className="mb-2 text-gray-700">{assignment.description}</p>
      <p className="mb-2">Civil War: {assignment.civilwar}</p>
      <p className="mb-2">Authors: {assignment.authors}</p>
      <a
        href={assignment.link}
        className="text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Source
      </a>
    </div>
  );
}
