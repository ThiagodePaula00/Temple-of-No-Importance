type ApiRequestError = {
  errors: string[];
  success: false;
  status: number;
};

type ApiRequestSuccess<T> = {
  data: T;
  success: true;
  status: number;
};

export type ApiRequest<T> = ApiRequestError | ApiRequestSuccess<T>;

export const apiUrl = (
  process.env.POSTS_API_URL || 'http://localhost:3000'
).replace(
  /\/+$/,
  '',
).replace(/\/posts$/i, '');

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiRequest<T>> {
  const url = `${apiUrl}/${path.replace(/^\/+/, '')}`;

  try {
    const res = await fetch(url, options);
    const json: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        typeof json === 'object' && json !== null && 'message' in json
          ? json.message
          : undefined;
      const errors = Array.isArray(message)
        ? message.filter((item): item is string => typeof item === 'string')
        : [typeof message === 'string' ? message : 'Erro inesperado'];

      return {
        errors,
        success: false,
        status: res.status,
      };
    }

    return {
      success: true,
      data: json as T,
      status: res.status,
    };
  } catch (err) {
    console.error(`Falha ao consultar a API (${url})`, err);

    const errorMessage =
      err instanceof Error && err.name === 'TimeoutError'
        ? 'The API took too long to respond. Please try again.'
        : err instanceof Error
          ? `Failed to connect to the API: ${err.message}`
          : 'Failed to connect to the API';

    return {
      errors: [errorMessage],
      success: false,
      status: 500,
    };
  }
}