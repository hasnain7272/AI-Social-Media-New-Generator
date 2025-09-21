
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">Oops! Something went wrong.</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default ErrorDisplay;
