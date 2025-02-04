import { TButtonProps } from "./types";

const Button = ({
  icon = null,
  text = "",
  className,
  ...restProps
}: TButtonProps) => {
  return (
    <button
      className={`h-auto w-auto p-3 flex justify-center items-center gap-2 cursor-pointer border border-columnBackgroundColor rounded-lg bg-mainBackgroundColor transition hover:border-sky-500 hover:text-sky-500 ${
        className ?? ""
      }`}
      {...restProps}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
