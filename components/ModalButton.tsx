interface Props {
  onClick: React.Dispatch<void>;
  title: string;
  disabled?: boolean;
}
export const ModalButton: React.FC<Props> = ({ onClick, title, disabled }) => {
  return (
    <button
      onClick={() => onClick()}
      disabled={disabled}
      className="bg-[#5354D1] hover:bg-[#6b6bd8] text-white text-[16px] rounded-md w-full py-3 flex justify-center items-center disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {title}
    </button>
  );
};
