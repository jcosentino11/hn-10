// https://github.com/facebook/react-native/issues/42042#issuecomment-1983320486
export const fetch = async (
    url: string,
    { timeout = 5000, ...fetchOptions }: RequestInit & { timeout?: number } = {}
  ) => {
    const controller = new AbortController();
  
    const abort = setTimeout(() => {
      controller.abort();
    }, timeout);
  
    const response = await globalThis.fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
  
    clearTimeout(abort);
    return response;
  };
