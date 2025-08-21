"use client";
import { useEffect, useState } from "react";
import { Folder, FileText } from "lucide-react";

export type NavItem = {
  title: string;
  url?: string;
  icon?: any;
  items?: NavItem[];
};
export type NavSection = { label: string; items: NavItem[] };

export function useNavData() {
  const [navData, setNavData] = useState<NavSection[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userRole = storedUser ? JSON.parse(storedUser)?.role : null;

    setNavData([
      {
        label: "MAIN MENU",
        items:
          userRole === "Admin"
            ? [
                {
                  title: "Category",
                  url: "/category",
                  icon: Folder,
                  items: [],
                },
                {
                  title: "Articles",
                  url: "/article",
                  icon: FileText,
                  items: [],
                },
              ]
            : [
                {
                  title: "Articles",
                  url: "/article",
                  icon: FileText,
                  items: [],
                },
              ],
      },
    ]);
  }, []);

  return navData;
}
