import { Nav } from "@/components/nav";

export default function KanbanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}
