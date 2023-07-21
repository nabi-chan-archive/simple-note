import { type ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-4 shadow-md">
      <h1 className="text-lg font-bold">{title}</h1>
      {children}
    </div>
  );
}
