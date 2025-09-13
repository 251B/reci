const ScrollToTopButton = ({ show, onClick }) => {
  if (!show) return null;

  return (
    <>
      {/* 데스크탑용 버튼 */}
      <button
        onClick={onClick}
        className="hidden md:fixed md:bottom-20 md:bg-[#FDA177] md:text-white md:rounded-full md:w-12 md:h-12 md:flex md:items-center md:justify-center md:shadow-lg md:z-50 md:transition md:hover:bg-[#fc5305]"
        style={{ right: "calc(50% - 245px)" }}
        aria-label="맨 위로 (PC)"
      >
        <span style={{ fontSize: "2rem", lineHeight: "2rem" }}>↑</span>
      </button>

      {/* 모바일용 버튼 */}
      <button
        onClick={onClick}
        className="fixed bottom-20 right-4 bg-[#FDA177] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition hover:bg-[#fc5305] md:hidden"
        aria-label="맨 위로 (모바일)"
      >
        <span style={{ fontSize: "2rem", lineHeight: "2rem" }}>↑</span>
      </button>
    </>
  );
};

export default ScrollToTopButton;