import React from "react";

import { FieldError } from "react-hook-form";

interface ErrorMessageProps {
  error?: FieldError | { message: string } | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return <p className="text-red-500 text-sm mt-1">{error.message}</p>;
};

export default ErrorMessage;
