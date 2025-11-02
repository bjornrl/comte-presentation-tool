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
    // <div className="border border-black">
    <div>
      <button
        onClick={onClick}
        className={cx(
          "text-left w-full border border-red-300 bg-red transition appearance-none focus:outline-none hover:cursor-pointer",
          selected ? "bg-gray-200" : "hover:bg-gray-100"
        )}
      >
        {children}
      </button>
    </div>
  );
}
