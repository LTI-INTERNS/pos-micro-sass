"use client";

import React from "react";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export default function LoadingState({ message = "Loading...", className = "py-16" }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center text-sm text-gray-400 ${className}`}>
      <svg className="animate-spin w-5 h-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      {message}
    </div>
  );
}
