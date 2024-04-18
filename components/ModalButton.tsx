import { MutableRefObject, forwardRef } from "react";

interface Props {
  onClick: React.Dispatch<void>;
  title: string;
  ref?: React.MutableRefObject<HTMLButtonElement>
}
export const ModalButton = forwardRef(({onClick, title}: Props, ref: MutableRefObject<HTMLButtonElement>) => {
  return (
    <button
      onClick={() => onClick()}
      ref={ref}
      className="bg-[#5354D1] hover:bg-[#6b6bd8] text-white text-[16px] rounded-md w-full py-3 flex justify-center items-center"
    >
      {title}
    </button>
  );
})