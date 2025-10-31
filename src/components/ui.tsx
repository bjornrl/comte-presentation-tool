import React from "react";

export const cx = (...xs: (string | false | null | undefined)[]): string =>
  xs.filter(Boolean).join(" ");

export function Card({
  children,
  selected = false,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "text-left w-full bg-white border rounded-xl p-5 md:p-6 transition border-red-500",
        selected ? "border-black" : "border-neutral-300 hover:border-black/50"
      )}
    >
      {children}
    </button>
  );
}
