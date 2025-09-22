import { useState, useEffect, useRef } from "react";
import { ArrowRight, Play, Pause, RotateCcw, SkipBack } from "lucide-react";

export default function RecipeTTS({ steps, currentStepIndex, onStepChange }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null); // 현재 발화를 저장하는 참조

  const speakSteps = (step) => {
    // 이전 발화 취소
    speechSynthesis.cancel();

    // 새로운 발화 생성
    const utterance = new SpeechSynthesisUtterance(step);
    utterance.lang = "ko-KR";

    // 이벤트 핸들러 등록
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onpause = () => {
      setIsPaused(true);
    };
    utterance.onresume = () => {
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // 발화 시작
    speechSynthesis.speak(utterance);
    utteranceRef.current = utterance; // 현재 발화를 참조로 저장
  };

  const pauseResumeSpeaking = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else {
      speakSteps(steps[currentStepIndex]);
    }
  };

  const restartCurrentStep = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setTimeout(() => {
      speakSteps(steps[currentStepIndex]);
    }, 100);
  };

  const goToFirstStep = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    onStepChange(0);

    // 1단계로 이동 후 읽기 시작
    setTimeout(() => {
      speakSteps(steps[0]);
    }, 100);
  };

  const handleNextStep = () => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    onStepChange(nextIndex);

    // 다음 단계로 이동 후 읽기 시작
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);

    if (nextIndex < steps.length) {
      setTimeout(() => {
        speakSteps(steps[nextIndex]);
      }, 100);
    }
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 발화 취소
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {/* 재생/일시정지 버튼 */}
      <button
        onClick={pauseResumeSpeaking}
        className={`p-1 rounded-full transition ${
          isSpeaking && !isPaused
            ? "hover:bg-orange-100"
            : "hover:bg-green-100"
        }`}
        title={
          isSpeaking && !isPaused
            ? "일시정지"
            : isPaused
            ? "재생 계속"
            : "재생 시작"
        }
      >
        {isSpeaking && !isPaused ? (
          <Pause size={20} className="text-orange-500" />
        ) : (
          <Play size={20} className="text-green-500" />
        )}
      </button>

      {/* 처음부터 버튼 */}
      <button
        onClick={restartCurrentStep}
        className="p-1 rounded-full hover:bg-blue-100 transition"
        title="현재 단계 처음부터"
      >
        <RotateCcw size={20} className="text-blue-500" />
      </button>

      {/* 1단계로 돌아가기 버튼 */}
      <button
        onClick={goToFirstStep}
        className="p-1 rounded-full hover:bg-purple-100 transition"
        title="1단계로 돌아가기"
        disabled={currentStepIndex === 0}
      >
        <SkipBack
          size={20}
          className={`${
            currentStepIndex === 0 ? "text-gray-300" : "text-purple-500"
          }`}
        />
      </button>

      {/* 다음 단계 버튼 */}
      <button
        onClick={handleNextStep}
        className="p-1 rounded-full hover:bg-yellow-100 transition"
        title="다음 단계"
        disabled={currentStepIndex >= steps.length - 1}
      >
        <ArrowRight
          size={20}
          className={`${
            currentStepIndex >= steps.length - 1
              ? "text-gray-300"
              : "text-yellow-500"
          }`}
        />
      </button>
    </div>
  );
}