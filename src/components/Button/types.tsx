import { ButtonHTMLAttributes, ReactElement } from "react";

import { Nullable } from "@/services/types";

export type TButtonProps = {
  icon?: Nullable<ReactElement>;
  text?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;
