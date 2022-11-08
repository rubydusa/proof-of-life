import { useEffect, useRef, useState } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const lastTimer = useRef();
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    lastTimer.current = timer;
    
    return () => {
      clearTimeout(timer);
    }
  }, [value, delay]);
  
  return [
    debouncedValue,
    (immediateValue) => {
      setDebouncedValue(immediateValue);
      clearTimeout(lastTimer.current);
    },
    () => {
      clearTimeout(lastTimer.current);
    }
  ]
}