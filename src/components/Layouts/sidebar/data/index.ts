"use client";
import { Folder, FileText } from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = {
  title: string;
  url?: string; // bisa ada atau tidak
  icon?: any;
  items?: NavItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const [userRole, setUserRole] = useState<string | null>(null);
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  setUserRole(storedUser ? JSON.parse(storedUser)?.role : null);
}, []);

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      ...(userRole === "Admin"
        ? [
            { title: "Category", url: "/category", icon: Folder, items: [] },
            { title: "Articles", url: "/article", icon: FileText, items: [] },
          ]
        : [{ title: "Articles", url: "/article", icon: FileText, items: [] }]),
    ],
  },
];
