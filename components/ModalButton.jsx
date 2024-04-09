export const ModalButton = ({onClick, title}) => {
    return (
        <button onClick={onClick} className="bg-[#5354D1] text-white text-[16px] rounded-md w-full py-3 flex justify-center items-center">{title}</button>
    )
}