"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { getCurrentUser, UserData } from "@/services/User";
import { logout } from "@/services/AuthService";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User tidak ditemukan</p>;

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      {/* Trigger */}
      <DropdownTrigger className="flex items-center gap-2 rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        {/* Avatar */}
        {/* Uncomment jika ada user image */}
        {/* <img
          src={user.img ?? "/images/user/user-03.png"}
          alt={`Avatar of ${user.username}`}
          className="w-10 h-10 rounded-full object-cover"
        /> */}

        {/* Username + Icon */}
        <div className="flex items-center gap-1">
          <span className="font-medium text-dark dark:text-dark-6">
            {user.username}
          </span>
          <ChevronUpIcon
            aria-hidden
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "rotate-0" : "rotate-180",
            )}
            strokeWidth={1.5}
          />
        </div>
      </DropdownTrigger>

      {/* Content */}
      <DropdownContent
        className="min-w-[220px] border border-stroke bg-white p-2 shadow-md dark:border-dark-3 dark:bg-gray-dark sm:min-w-[17.5rem]"
        align="end"
      >
        {/* User Info */}
        <div className="flex items-center gap-2.5 px-4 py-3.5">
          {/* Avatar */}
          {/* <img
            src={user.img ?? "/images/user/user-03.png"}
            alt={`Avatar of ${user.username}`}
            className="w-12 h-12 rounded-full object-cover"
          /> */}
          <div className="flex flex-col">
            <span className="font-medium text-dark dark:text-white">
              {user.username}
            </span>
            <span className="text-sm text-gray-500 dark:text-dark-6">
              {user.role}
            </span>
          </div>
        </div>

        <hr className="my-1 border-[#E8E8E8] dark:border-dark-3" />

        {/* Action Buttons */}
        <button
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-base font-medium hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5" />
          Log out
        </button>
      </DropdownContent>
    </Dropdown>
  );
}
