import { useState, useEffect, useRef } from "react";
import { Timer } from "lucide-react";

export default function RecipeTimer() {
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState("");
  const [timerSeconds, setTimerSeconds] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerSet, setIsTimerSet] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const alarmSound = useRef(new Audio('/sounds/ring.mp3')).current;
  alarmSound.volume = 0.5;

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsTimerSet(false);
      setShowTimeUpModal(true);
      alarmSound.play();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, alarmSound]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    } else {
      const totalSeconds =
        (parseInt(timerMinutes, 10) || 0) * 60 +
        (parseInt(timerSeconds, 10) || 0);
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setIsRunning(true);
        setIsTimerSet(true);
      }
    }
  };

  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTimerMinutes("");
    setTimerSeconds("");
    setIsTimerSet(false);
  };

  return (
    <>
      {/* 타이머 버튼 */}
      <button
        onClick={() => setShowTimer(true)}
        className="flex items-center space-x-1 text-green-700 text-base font-bold px-3 py-2"
      >
        <span>타이머</span>
        <Timer size={24} />
      </button>

      {/* 타이머 모달 */}
      {showTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">타이머</h3>
              <button
                onClick={() => setShowTimer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {!isTimerSet ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="분"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="0"
                    max="99"
                  />
                  <span>분</span>
                  <input
                    type="number"
                    placeholder="초"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="0"
                    max="59"
                  />
                  <span>초</span>
                </div>
                <button
                  onClick={handleStart}
                  className="w-full py-2 bg-[#fc5305] text-white rounded-lg hover:bg-[#e04a04] transition"
                >
                  시작
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-[#fc5305] mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isRunning ? "진행중" : "일시정지"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={isRunning ? handlePause : handleStart}
                    className="flex-1 py-2 bg-[#fc5305] text-white rounded-lg hover:bg-[#e04a04] transition"
                  >
                    {isRunning ? "일시정지" : "재시작"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    리셋
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Timer className="mx-auto mb-4 text-[#fc5305]" size={48} />
            <h3 className="text-lg font-semibold mb-2">시간 종료!</h3>
            <p className="text-gray-600 mb-4">설정한 시간이 끝났습니다.</p>
            <button
              onClick={() => setShowTimeUpModal(false)}
              className="px-6 py-2 bg-[#fc5305] text-white rounded-lg hover:bg-[#e04a04] transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}