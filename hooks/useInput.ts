import { Dispatch, SetStateAction, useCallback, useState } from 'react';

const useInput = <T = any>(initialData: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>] => {
  // 제너릭 공부 = 타입을 변수로 만들 수 있음
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};
export default useInput;
