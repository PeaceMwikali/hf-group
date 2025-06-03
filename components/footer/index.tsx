"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname();

  if (pathName === "/login") {
    return null; // Don't render footer on the login page
  }

  return (
    <footer className=" text-gray-800 bg-[#FF8904] text-white ">
      <div className=" px-4 py-6 flex flex-col md:flex-row items-center justify-center">
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} HF Group. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
