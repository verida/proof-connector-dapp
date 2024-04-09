"use client";
export const Header = ({handleClick, title, disabled}) => {
  return (
    <div className="w-full flex items-center justify-between py-4 px-24 bg-[#ffffff22]">
      <img src="/logo.svg" className="cursor-pointer"/>
      <button
        className="border-1 px-5 py-3 cursor-pointer text-[18px] bg-white rounded-md text-[#19193d] hover:bg-[#eee]"
        onClick={handleClick}
        disabled={disabled}
      >
        {title}
      </button>
    </div>
  );
};
