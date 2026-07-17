/** Server-side backend connection settings, shared by proxy-adjacent routes. */

const pickNonEmpty = (...values: Array<string | undefined>) =>
  values.find((v) => typeof v === "string" && v.trim().length > 0);

export const getBackendBaseUrl = () => {
  const devDefault = "http://127.0.0.1:3333/api/v1";
  const prodDefault = "https://api.onchainsuite.com/api/v1";
  const backendUrl = pickNonEmpty(
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NODE_ENV === "production" ? prodDefault : devDefault
  );
  return (backendUrl as string).replace(/\/$/, "");
};

export const getBackendApiKey = () =>
  pickNonEmpty(
    process.env.BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_API_KEY
  );
