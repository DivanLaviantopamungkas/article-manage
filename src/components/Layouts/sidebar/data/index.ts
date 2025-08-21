// src/components/Layouts/sidebar/data/index.ts

import { Folder, FileText } from "lucide-react";

export type NavItem = {
  title: string;
  url?: string;
  icon?: any;
  items?: NavItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

// Bisa tambahkan helper function di sini, tapi jangan pakai useState/useEffect
export const generateUrlFromTitle = (title: string) =>
  "/" + title.toLowerCase().replace(/ /g, "-");
