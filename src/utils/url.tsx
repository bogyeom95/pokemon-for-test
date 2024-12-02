export const getSearchParamsValue = (url: string | null, key: string) => {
  if (!url) return null;

  const searchParams = new URL(url).searchParams;
  return searchParams.get(key);
};
