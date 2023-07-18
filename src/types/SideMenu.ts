import { type ReactNode } from "react";

export type Button = {
  title: string;
  icon: ReactNode;
  onClick: () => void;
};
