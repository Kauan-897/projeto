"use client";

import { useRouter } from "next/navigation";

export default function NavigationButton() {
  const router = useRouter();

  return (
    <button
      className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
      onClick={() => router.push("/dashboard")}
    >
      Página Inicial
    </button>
  );
}
