import { useState } from 'react';

type SetTimeoutReturnType = ReturnType<typeof setTimeout>;

export const useSetTimeout = (thread = 1) => {
  const [timeoutId, setTimeoutId] = useState<SetTimeoutReturnType>();

  function setTimeoutFn(ms: number) {
    timeoutId && clearTimeout(timeoutId);

    return new Promise<SetTimeoutReturnType>(resolve => {
      setTimeoutId(() => {
        const newTimeoutId: SetTimeoutReturnType = setTimeout(() => {
          resolve(newTimeoutId!);
        }, ms);

        return newTimeoutId;
      });
    });
  }

  return Array.from(new Array(thread)).map(() => setTimeoutFn);
};
