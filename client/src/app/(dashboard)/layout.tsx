"use client";

import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (pathname.includes("/courses/")) {
      const parts = pathname.split("/");
      const index = parts.indexOf("courses");
      if (index !== -1 && parts[index + 1]) {
        setCourseId(parts[index + 1]);
      }
    } else {
      setCourseId(null);
    }
  }, [pathname]);

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to access this page.</div>;

  const isCoursePage = pathname.includes("/courses");

  return (
    <SidebarProvider>
      <div className="dashboard">
        <AppSidebar />
        <div className="dashboard__content">
          <div
            className={cn(
              "dashboard__main",
              !isCoursePage && "dashboard__main--not-course"
            )}
            style={{ height: "100vh" }}
          >
            <main className="dashboard__body">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
