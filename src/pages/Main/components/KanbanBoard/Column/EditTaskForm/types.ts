import { Dispatch } from "react";

import { TTask } from "@/redux/columns/types";

export type TEditTaskFormProps = {
  task: TTask;
  setIsEditMode: Dispatch<React.SetStateAction<boolean>>;
  setIsHover: Dispatch<React.SetStateAction<boolean>>;
};
