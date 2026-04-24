export interface IApiError {
  message: string;
  errors?: Record<string, string[]>;
}
