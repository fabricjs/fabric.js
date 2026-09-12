export const debounce = <T extends (...args: any[]) => ReturnType<T>>(
    fn: T,
    timeout: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: number | null = null;
  
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId as number);
      }
  
      timeoutId = setTimeout(() => {
        fn(...args);
      }, timeout) as unknown as number;
  
      return timeoutId;
    };
  };