import React from "react";
import { SubcomponentPropsType } from "../commonTypes";

export interface ErrorBoundaryProps {
  hasError: boolean;
  errorText: string;
  errorCode: string;
  inputProps?: SubcomponentPropsType;
};

const ErrorBoundary = ({
  hasError,
  errorText,
  errorCode,
  inputProps,
}: ErrorBoundaryProps) => { 
  return (
    <div>
      -{hasError}-
    {hasError ? "Error" : "No Error"}
    </div>
  );
};


export default ErrorBoundary;