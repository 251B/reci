export default function LoadingSpinner({ message = "로딩 중..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDA177] mb-4"></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}