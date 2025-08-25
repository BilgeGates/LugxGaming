import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === "undefined") {
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(
            `Error parsing localStorage key "${key}" from storage event:`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  const updateObject = (updates) => {
    setValue((prevValue) => ({
      ...(typeof prevValue === "object" && prevValue !== null ? prevValue : {}),
      ...updates,
    }));
  };

  const updateArray = (updateFn) => {
    setValue((prevValue) => {
      const currentArray = Array.isArray(prevValue) ? prevValue : [];
      return updateFn(currentArray);
    });
  };

  return [
    storedValue,
    setValue,
    removeValue,
    {
      updateObject,
      updateArray,
      key,
      isInitialized: typeof window !== "undefined",
    },
  ];
}

export default useLocalStorage;
