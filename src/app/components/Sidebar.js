"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image';
export default function Sidebar() {
  const pathname = usePathname();
  const navLinks = [
    { href: "/", label: "Tableau de bord", icon: HomeIcon },
    { href: "/dashboard/def", label: "DEF", icon: UserGroupIcon },
    { href: "/Tableau/bac", label: "BACC", icon: DocumentTextIcon },
    { href: "/Tableau/Ajout", label: "Ajout de sujet", icon: PlusCircleIcon },
    { href: "/parametre", label: "Paramètres", icon: Cog6ToothIcon },
  ];

  return (
    <aside className="bg-red-700 text-white w-20 md:w-64 h-screen fixed left-0 top-0 border-r border-blue-800">
      <div className="p-4 h-full flex flex-col">
        <div className="mb-6 flex justify-center md:justify-start">
          <Link href="/dashboard">
      
            <Image src="/logoexamali.png" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <nav className="flex-1" aria-label="Navigation principale">
          <ul className="space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors mx-1
                    ${
                      pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-800 hover:text-blue-50"
                    }`}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 min-w-[20px]" />
                  <span className="hidden md:block text-sm truncate">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Separator */}
        <hr className="my-4 border-blue-700 -mx-4" />

        {/* Logout Button */}
        <div className="mt-auto">
          <Link
            href="/logout"
            className="flex items-center gap-3 p-3 rounded-lg transition-colors w-full hover:bg-red-800 hover:text-red-50"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 min-w-[20px]" />
            <span className="hidden md:block text-sm truncate">Déconnexion</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}