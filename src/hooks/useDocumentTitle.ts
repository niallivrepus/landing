import { useEffect } from "react";

export function useDocumentTitle(_title: string) {
  useEffect(() => {
    document.title = "Jokuh";
  }, []);
}
