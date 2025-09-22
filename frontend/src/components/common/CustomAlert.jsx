import { useState } from "react";

export default function CustomAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-md shadow-md text-center">
        <p className="text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-[#FDA177] text-white py-2 px-4 rounded-md"
        >
          확인
        </button>
      </div>
    </div>
  );
}