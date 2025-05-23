import React from "react";

interface ProfileAlertProps {
  error: string | null;
  successMessage: string;
}

const ProfileAlert = ({ error, successMessage }: ProfileAlertProps) => {
  if (!error && !successMessage) return null;

  return (
    <>
      {error && (
        <div className="alert alert-error mb-6 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error</h3>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mb-6 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Success</h3>
            <div className="text-sm">{successMessage}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ProfileAlert);
