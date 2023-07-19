import { type ReactNode } from "react";

export type Button = {
  title: string;
  onClick: () => void;
  modal?: ReactNode;
} & (
  | {
      icon: ReactNode;
      customButton?: never;
    }
  | {
      icon?: ReactNode;
      customButton: (props: CustomButtonProps) => ReactNode;
    }
);

export type CustomButtonProps = {
  btnClassName: string;
  children: ReactNode;
};
