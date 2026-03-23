import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "./DashboardLayout";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <DashboardLayout
      user={{ name: session.user?.name ?? "", email: session.user?.email ?? "" }}
      userName={session.user?.name ?? ""}
    />
  );
}
