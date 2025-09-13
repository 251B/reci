import { Send } from "lucide-react";

const ChatInput = ({ 
  inputText, 
  setInputText, 
  onSend, 
  isLoading,
  placeholder = "메시지를 입력하세요..." 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && inputText.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 border-t bg-white flex items-center space-x-2">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isLoading}
        className={`flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none ${
          isLoading ? 'bg-gray-100 text-gray-400' : ''
        }`}
      />
      <button
        onClick={() => {
          if (inputText.trim() && !isLoading) {
            onSend();
          }
        }}
        disabled={isLoading || !inputText.trim()}
        className={`p-2 rounded-full ${
          isLoading || !inputText.trim()
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-[#fce1c8] text-[#7a3e0d] hover:bg-[#ffcb8c]'
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default ChatInput;