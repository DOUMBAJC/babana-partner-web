import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

interface UseSupportFiltersProps {
  initialSearch: string;
  initialStatus: string;
  initialPriority: string;
}

export function useSupportFilters({
  initialSearch,
  initialStatus,
  initialPriority,
}: UseSupportFiltersProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus || "all");
  const [priorityFilter, setPriorityFilter] = useState(initialPriority || "all");

  // Synchroniser les états avec les données du loader
  useEffect(() => {
    setSearchInput(initialSearch);
    setStatusFilter(initialStatus || "all");
    setPriorityFilter(initialPriority || "all");
  }, [initialSearch, initialStatus, initialPriority]);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== initialSearch) {
        const params = new URLSearchParams(location.search);
        if (searchInput) {
          params.set("q", searchInput);
        } else {
          params.delete("q");
        }
        params.delete("page");
        navigate({ search: params.toString() });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, initialSearch, location.search, navigate]);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    navigate({ search: params.toString() });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setParam("status", value === "all" ? "" : value);
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value);
    setParam("priority", value === "all" ? "" : value);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    navigate({ search: params.toString() });
  };

  return {
    searchInput,
    statusFilter,
    priorityFilter,
    setSearchInput,
    handleStatusChange,
    handlePriorityChange,
    goToPage,
  };
}

