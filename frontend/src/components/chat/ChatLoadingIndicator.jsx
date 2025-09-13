const ChatLoadingIndicator = () => {
  return (
    <div className="flex items-start justify-start mt-1">
      <img src="/images/chatbot.png" alt="Bot" className="w-12 h-12 rounded-full mr-2" />
      <div className="px-4 py-2 text-sm rounded-xl bg-[#ffcb8c] text-[#7a3e0d] rounded-tl-none mt-1.5">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#7a3e0d] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#7a3e0d] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[#7a3e0d] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-xs ml-2">답변을 준비하고 있어요...</span>
        </div>
      </div>
    </div>
  );
};

export default ChatLoadingIndicator;