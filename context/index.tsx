"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the types
interface ContextType {
  user: AuthUser | null;
  userPermissions: Permission[];
  userRoles: any[];
  userCompanies: any[];
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setUserPermissions: (permissions: Permission[]) => void;
  setUserRoles: (roles: any[]) => void;
  setUserCompanies: (companies: any[]) => void;
  setLoading: (state: boolean) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      currentPage: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }>
  >;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterQuery: string;
  setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
  clearSearchAndPagination: () => void;

  showFilter: string;
  setShowFilter: React.Dispatch<React.SetStateAction<string>>;

  centralState: string;
  setCentralState: React.Dispatch<React.SetStateAction<string>>;

  centralStateDelete: string;
  setCentralStateDelete: React.Dispatch<React.SetStateAction<string>>;

  notificationState: any;
  setNotificationState: React.Dispatch<React.SetStateAction<any>>;

  companyStateId: any;
  setCompanyStateId: React.Dispatch<React.SetStateAction<any>>;

  successState: {
    title: string;
    detail: string;
    status: boolean;
  };
  setSuccessState: React.Dispatch<
    React.SetStateAction<{
      title: string;
      detail: string;
      status: boolean;
    }>
  >;
}

// Create context
const DataPermissionContext = createContext<ContextType | undefined>(undefined);

// Define initial pagination values
const initialPagination = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

// Provider component
export const DataPermissionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hydrated, setHydrated] = useState(false); // Prevent hydration mismatch
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [userCompanies, setUserCompanies] = useState<any[]>([]);
  const [notificationState, setNotificationState] = useState<any>();
  const [companyStateId, setCompanyStateId] = useState<any>();

  // Keep loading and pagination in memory (do not persist)
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [showFilter, setShowFilter] = useState("");

  //modal
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  // Load persisted data on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedPermissions = localStorage.getItem("userPermissions");
      const storedRoles = localStorage.getItem("userRoles");
      const storedCompanyId = localStorage.getItem("selectedCompany");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedPermissions) setUserPermissions(JSON.parse(storedPermissions));
      if (storedRoles) setUserRoles(JSON.parse(storedRoles));
      if (storedCompanyId) setCompanyStateId(storedCompanyId);

      setHydrated(true); // Mark hydration as complete
    }
  }, []);

  // Persist data in localStorage whenever state changes
  useEffect(() => {
    if (hydrated) {
      if (user !== null) localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("userPermissions", JSON.stringify(userPermissions));
    }
  }, [userPermissions, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("userRoles", JSON.stringify(userRoles));
    }
  }, [userRoles, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("selectedCompany", companyStateId);
    }
  }, [userRoles, hydrated]);

  if (!hydrated) return null; // Avoid SSR mismatch by skipping the initial render

  // Function to clear searchQuery and reset pagination
  const clearSearchAndPagination = () => {
    setSearchQuery("");
    setFilterQuery("");
    // setPagination(initialPagination);
  };

  return (
    <DataPermissionContext.Provider
      value={{
        user,
        userPermissions,
        userRoles,
        userCompanies,
        setUser,
        setUserPermissions,
        setUserRoles,
        setUserCompanies,
        loading,
        setLoading,
        pagination,
        setPagination,
        searchQuery,
        setSearchQuery,
        filterQuery,
        setFilterQuery,
        clearSearchAndPagination,

        showFilter,
        setShowFilter,

        successState,
        setSuccessState,

        centralState,
        setCentralState,

        centralStateDelete,
        setCentralStateDelete,

        notificationState,
        setNotificationState,

        companyStateId,
        setCompanyStateId,
      }}
    >
      {children}
    </DataPermissionContext.Provider>
  );
};

// Custom hook for consuming the context
export const useDataPermission = () => {
  const context = useContext(DataPermissionContext);
  if (!context) {
    throw new Error(
      "useDataPermission must be used within a DataPermissionProvider"
    );
  }
  return context;
};
