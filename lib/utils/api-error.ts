export type ApiLikeError = {
  response?: {
    data?: {
      message?: string;
      error?: {
        code?: string;
        message?: string;
        userMessage?: string;
      };
    };
  };
  message?: string;
};

export function getApiErrorCode(error: unknown): string {
  return (error as ApiLikeError)?.response?.data?.error?.code ?? '';
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as ApiLikeError;

  return (
    apiError?.response?.data?.error?.userMessage ||
    apiError?.response?.data?.error?.message ||
    apiError?.response?.data?.message ||
    apiError?.message ||
    fallback
  );
}
