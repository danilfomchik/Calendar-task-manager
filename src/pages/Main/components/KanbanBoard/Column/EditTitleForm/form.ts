import { object, string } from "yup";

export const validation = object().shape({
  title: string().required("Title is required"),
});
