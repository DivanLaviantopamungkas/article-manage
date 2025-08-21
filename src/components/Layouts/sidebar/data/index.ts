import * as Icons from "../icons";
import { Folder, FileText } from "lucide-react";

const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

export const NAV_DATA = [
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
