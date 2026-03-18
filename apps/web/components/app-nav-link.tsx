"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AppNavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function AppNavLink({ href, icon, label }: AppNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 py-1 px-3 transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
