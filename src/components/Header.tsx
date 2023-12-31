import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShoppingCart from "./ShoppingCart";
import Link from "next/link";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";

const LINKS = [
  {
    name: "Items",
    href: "/items",
    restricted: true,
    roles: ["admin", "seller"],
    icon: <FaClipboardList className="inline-block w-4 h-4" />,
  },
  {
    name: "Orders",
    href: "/orders",
    restricted: true,
    roles: ["admin", "seller"],
    icon: <BiPackage className="inline-block w-4 h-4" />,
  },
];

function Header() {
  const { data, status } = useSession();
  return (
    <div className="flex px-2 justify-between w-full max-w-4xl mx-auto py-4">
      <Link className="flex items-center gap-2" href="/">
        <Image
          src="/logo.png"
          alt="Picture of the author"
          width={40}
          height={40}
        />
        <span className="font-bold text-2xl font-mono text-emerald-800">
          Grocery Store
        </span>
      </Link>
      <div className="flex gap-8 items-center">
        <ShoppingCart />
        {status !== "loading" && !data?.user && (
          <Link
            className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-2 shadow-md"
            href="/login"
          >
            <AiOutlineLogin className="inline-block w-4 h-4" />
            Login
          </Link>
        )}

        {data?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="shadow">
                <AvatarImage
                  src={`data:image/svg+xml;utf8,${data?.user?.image}`}
                />
                <AvatarFallback>
                  {data?.user?.name
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
              <DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
              {LINKS.filter(
                ({ restricted, roles }) =>
                  !restricted || roles.includes(data.user.role)
              ).map(({ name, href, icon }) => (
                <DropdownMenuItem key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-1 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    {icon}
                    {name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <button
                  className="flex items-center gap-1 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  role="menuitem"
                  onClick={() => signOut()}
                >
                  <AiOutlineLogout className="inline-block w-4 h-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default Header;
