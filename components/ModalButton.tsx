interface Props {
  onClick: React.Dispatch<void>;
  title: string;
}
export const ModalButton: React.FC<Props> = ({ onClick, title }) => {
  return (
    <button
      onClick={() => onClick()}
      className="bg-[#5354D1] hover:bg-[#6b6bd8] text-white text-[16px] rounded-md w-full py-3 flex justify-center items-center"
    >
      {title}
    </button>
  );
};
