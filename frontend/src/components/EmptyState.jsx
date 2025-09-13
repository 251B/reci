import { useNavigate } from "react-router-dom";

export default function EmptyState({
  icon = "💔",
  title = "데이터가 없어요",
  description = "아직 저장된 내용이 없습니다.",
  buttonText = "둘러보기",
  buttonPath = "/",
  onButtonClick
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate(buttonPath);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
        {description}
      </p>
      <button
        onClick={handleClick}
        className="bg-[#FDA177] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#fc5305] transition"
      >
        {buttonText}
      </button>
    </div>
  );
}