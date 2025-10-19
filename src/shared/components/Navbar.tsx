"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { Button } from "./Button";
import { useAuthState } from "@/features/auth/queries/authenticate";
import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenu, DropdownMenuContent } from "@/shared/components/Dropdown-Menu";
import { supabase } from "../queries/dbclient";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navigationItems: NavItem[] = [
  { href: "/listings", label: "Listings" },
  { href: "/messages", label: "Messages" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthState();
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-secondary dark:bg-secondary shadow-lg border-r border-stroke">
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="p-4 border-b border-stroke flex items-center justify-center">
          <Link 
            href="/" 
            className="text-4xl font-bold font-sans text-highlight hover:text-highlight/80 transition-colors">
            GPUTrust
          </Link>
        </header>
        
        {/* Navigation */}
        <nav className="flex-1 p-4" role="navigation" aria-label="Main navigation">
          <ul className="space-y-2">
            <Button variant="highlight" className="w-full" onClick={isAuthenticated ? () => router.push('/benchmark') : () => router.push('/auth/login')}>
              Sell your GPU
            </Button>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-lg font-semibold font-sans text-text-light transition-colors",
                      "hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20",
                      isActive
                        ? "bg-primary text-text-light"
                        : "text-text-light hover:text-text-light/80"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <footer className="p-4 border-t border-stroke">
          {loading ? (
            <div className="w-full h-10 bg-secondary animate-pulse rounded-md"></div>
          ) : isAuthenticated ? (
            <Button variant="white" className="w-full" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          ) : (
          <div className="flex gap-2">
            <Link
              href="/auth/login"
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-center transition-colors bg-highlight text-text-dark hover:bg-highlight/80 focus:outline-none focus:ring-2 focus:ring-highlight/20"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-center transition-colors bg-primary text-text-light border border-stroke hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              Register
            </Link>
          </div>
          )}
        </footer>
      </div>
    </aside>
  );
}