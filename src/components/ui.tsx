import React from "react";

export const cx = (...xs: (string | false | null | undefined)[]): string =>
  xs.filter(Boolean).join(" ");

export function Card({
  children,
  selected = false,
  onClick,
  hoverColor = "hover:bg-red-100",
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  hoverColor?: string;
  className?: string;
}) {
  return (
    // <div className="border border-black">
    <div className={cx("h-full", className)}>
      <button
        onClick={onClick}
        className={cx(
          "text-left w-full h-full border border-red-300 bg-red transition appearance-none focus:outline-none hover:cursor-pointer",
          selected ? "bg-gray-200" : hoverColor
        )}
      >
        {children}
      </button>
    </div>
  );
}
