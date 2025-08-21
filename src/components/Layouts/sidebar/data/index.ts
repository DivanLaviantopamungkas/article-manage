import { Folder, FileText } from "lucide-react";

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

const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

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
