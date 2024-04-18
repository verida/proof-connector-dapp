"use client";
interface Props {
  handleClick: React.Dispatch<void>,
  title: string,
  disabled: boolean
}
export const Header: React.FC<Props> = ({handleClick, title, disabled}) => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-4 md:px-24 bg-[#ffffff22]">
      <img src="/logo.svg" className="cursor-pointer"/>
      <button
        className="border-1 px-3 py-2 md:px-5 md:py-3 cursor-pointer text-[18px] bg-white rounded-md text-[#19193d] hover:bg-[#eee]"
        onClick={() => handleClick()}
        disabled={disabled}
      >
        {title}
      </button>
    </div>
  );
};
