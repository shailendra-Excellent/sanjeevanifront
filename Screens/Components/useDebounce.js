import { useCallback, useEffect, useRef } from "react";

// Returns a debounced version of fn that always calls the latest fn.
// Keeps typing smooth by running heavy filtering only after the user pauses.
export const useDebouncedCallback = (fn, delay = 250) => {
  const fnRef = useRef(fn);
  const timer = useRef(null);
  fnRef.current = fn;

  useEffect(() => () => clearTimeout(timer.current), []);

  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);
};

// Case-insensitive "contains" filter. Upper-cases the search text only once.
export const filterByText = (list, text, getValue) => {
  if (!Array.isArray(list)) return [];
  const textData = (text || '').trim().toUpperCase();
  if (!textData) return list;
  return list.filter((item) => {
    const value = getValue(item);
    return value ? String(value).toUpperCase().indexOf(textData) > -1 : false;
  });
};

const stripSymbols = (text) => text.replace(/[^0-9A-Z]/g, '');

// Wild search: every word typed (split on space, * or %) must appear somewhere in the value, in any order.
// Symbols are ignored too, so "indo 9118", "9118 indo" and "indo*9118" all find "Indo,-9118".
export const wildFilterByText = (list, text, getValue) => {
  if (!Array.isArray(list)) return [];
  const words = (text || '').toUpperCase().split(/[\s*%]+/).filter(Boolean);
  if (words.length === 0) return list;
  const plainWords = words.map(stripSymbols);
  return list.filter((item) => {
    const raw = getValue(item);
    if (!raw) return false;
    const value = String(raw).toUpperCase();
    const plainValue = stripSymbols(value);
    return words.every((word, i) =>
      value.indexOf(word) > -1 || (plainWords[i] !== '' && plainValue.indexOf(plainWords[i]) > -1));
  });
};
