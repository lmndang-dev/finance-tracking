import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={{ name: session.user?.name ?? "", email: session.user?.email ?? "" }} />

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Dashboard</h1>
        <p className="text-secondary text-sm">Welcome back, {session.user?.name}!</p>
      </main>
    </div>
  );
}
