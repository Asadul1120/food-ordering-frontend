export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;

    if (data?.message) return data.message;
  }

  return error instanceof Error ? error.message : "Something went wrong";
}

export function getFieldError(errors: readonly unknown[]): string | undefined {
  const error = errors[0];

  if (!error) return undefined;

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Invalid value";
}

export const roleRoutes = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "dashboard/admin";
    case "STAFF":
      return "dashboard/staff";
    case "CUSTOMER":
      return "/";
    default:
      return "/";
  }
};
