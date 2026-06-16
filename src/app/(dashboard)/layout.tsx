// src/app/(dashboard)/layout.tsx
// Dashboard layout — sidebar + navbar shell

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { name, email, image } = session.user;

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      {/* Left Sidebar */}
      <Sidebar userName={name} userEmail={email} userImage={image} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar userName={name} userEmail={email} userImage={image} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
