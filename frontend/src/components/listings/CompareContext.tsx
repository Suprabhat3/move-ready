import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CompareContextValue = {
  compareIds: string[];
  toggleCompare: (listingId: string) => boolean;
  clearCompare: () => void;
  isCompared: (listingId: string) => boolean;
};

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

const STORAGE_KEY = "move-ready-compare";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue) as string[];
        setCompareIds(parsed.slice(0, 3));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const value = useMemo<CompareContextValue>(
    () => ({
      compareIds,
      toggleCompare: (listingId) => {
        let nextAdded = false;
        setCompareIds((current) => {
          if (current.includes(listingId)) {
            return current.filter((id) => id !== listingId);
          }

          if (current.length >= 3) {
            return current;
          }

          nextAdded = true;
          return [...current, listingId];
        });
        return nextAdded;
      },
      clearCompare: () => setCompareIds([]),
      isCompared: (listingId) => compareIds.includes(listingId),
    }),
    [compareIds],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }

  return context;
}
