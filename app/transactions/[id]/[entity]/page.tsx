"use client";

import PermissionGuardApi from "@/components/auth/permission-protected-api";
import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import { MyLoaderFinite } from "@/components/loader-components";
import TableComponent from "@/components/table-component";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";
import { multiSelectStyle } from "@/utils/ojects";
import {
  RefreshIcon
} from "@/utils/svg";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

// Register required components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Transactions() {
  const axiosInstance = createAxiosInstance();
  const { callGuardedEndpoint } = PermissionGuardApi();
  const {
    user,
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    showFilter,
    setShowFilter,
    clearSearchAndPagination,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
    companyStateId,
  } = useDataPermission();
  const { id, entity } = useParams();
  const [filters, setFilters] = useState({
    User: "",
    Facility: "",
    Vendor: "",
    Technician: "",
  });

  const [loading, setLoading] = useState<boolean>();
  const [vendors, setVendors] = useState<Vendor[]>();
  const [technicians, setTechnicians] = useState<Technician[]>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [users, setUsers] = useState<User[]>();

  //for table
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>();

  const myFormattedTransactions = filteredTransactions?.map(
    ({ category, isProcessed, ...rest }) => ({ category, ...rest })
  );
  const filterOptions = [
    {
      label: "User",
      options: users,
    },
    { label: "Facility", options: facilities },
    { label: "Vendor", options: vendors },
    {
      label: "Technician",
      options: technicians,
    },
  ];

  const handleFilterChange = (label, value) => {
    setFilters({
      User: null,
      Facility: null,
      Vendor: null,
      Technician: null,
      [label]: value,
    });
  };

  const getUsers = async () => {
    const response = await callGuardedEndpoint({
      endpoint: `/users`,
      requiredPermissions: ["read_users"],
    });
    setUsers(response?.data);
  };
  const getVendors = async () => {
    const response = await callGuardedEndpoint({
      endpoint: `/users/vendor-users/all`,
      requiredPermissions: ["read_users:vendor-users/all"],
    });

    setVendors(response?.data);
  };
  const getTechnicians = async () => {
    const response = await callGuardedEndpoint({
      endpoint: `/users/technician-users/all`,
      requiredPermissions: ["read_users:technician-users/all"],
    });

    setTechnicians(response?.data);
  };
  const getFacilities = async () => {
    const response = await axiosInstance.get("/facilities");
    setFacilities(response.data.data);
  };

  const getMyTransactionsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/transactions/my-transactions/all?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(
      response.data.data,
      `${user.firstName}_${user.lastName}_transactions`
    );
  };

  const getMyTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/my-transactions/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setFilteredTransactions(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAUserTransactionsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${
        filters.User || id
      }?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "user_transactions");
  };

  const getAUserTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.User || id}?page=${
        pagination.currentPage
      }&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setFilteredTransactions(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAVendorTransactionsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${
        filters.Vendor || id
      }?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "vendor_transactions");
  };

  const getAVendorTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Vendor || id}?page=${
        pagination.currentPage
      }&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setFilteredTransactions(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getATechnicianTransactionsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${
        filters.Technician || id
      }?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "technician_transactions");
  };

  const getATechnicianTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Technician || id}?page=${
        pagination.currentPage
      }&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setFilteredTransactions(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAFacilityTransactionsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/transactions/facility-transactions/all/${
        filters.Facility || id
      }?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "facility_transactions");
  };

  const getAFacilityTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/facility-transactions/all/${filters.Facility || id}?page=${
        pagination.currentPage
      }&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setFilteredTransactions(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getUsers(),
        getFacilities(),
        getTechnicians(),
        getVendors(),
      ]);
    };
    fetchData();
  }, [   companyStateId,]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user.wallets.length > 0) {
        await getMyTransactions();
      } else {
        if (id && entity) {
          if (entity === "User") {
            await getAUserTransactions();
          } else if (entity === "Vendor") {
            await getAVendorTransactions();
          } else if (entity === "Technician") {
            await getATechnicianTransactions();
          } else if (entity === "Facility") {
            await getAFacilityTransactions();
          }
        }
      }

      setTimeout(() => setLoading(false), 1000);
    };

    setLoading(true);
    fetchTransactions();
  }, [
    id,
    entity,
    user.wallets,
    pagination.currentPage,
    searchQuery,
    filterQuery,
    companyStateId,
  ]);

  useEffect(() => {
    setShowFilter("");
  }, []);
  useEffect(() => {
    const fetchTransactions = async () => {
      if (showFilter === "export") {
        if (user.wallets.length > 0) {
          await getMyTransactionsUnPaginated();
        } else {
          if (id && entity) {
            if (entity === "User") {
              await getAUserTransactionsUnPaginated();
            } else if (entity === "Vendor") {
              await getAVendorTransactionsUnPaginated();
            } else if (entity === "Technician") {
              await getATechnicianTransactionsUnPaginated();
            } else if (entity === "Facility") {
              await getAFacilityTransactionsUnPaginated();
            }
          }
        }
      }
    };

    fetchTransactions();
    setShowFilter("");
  }, [id, entity, user.wallets, showFilter, filterQuery,    companyStateId,]);

  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      if (filters.User) {
        await getAUserTransactions();
      } else if (filters.Vendor) {
        await getAVendorTransactions();
      } else if (filters.Technician) {
        await getATechnicianTransactions();
      } else if (filters.Facility) {
        await getAFacilityTransactions();
      }

      setTimeout(() => setLoading(false), 1000);
    };

    setLoading(true);
    fetchFilteredTransactions();
  }, [filters,    companyStateId,]);


  const monthlyData = {
    INFLOW: Array(12).fill(0), // For January to December
    OUTFLOW: Array(12).fill(0), // For January to December
  };
  const formattedTransactions = filteredTransactions?.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount), // Convert amount from string to number
  }));
  // Iterate over each transaction
  formattedTransactions?.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const month = date.getMonth(); // Month is 0-based (January = 0, December = 11)
    // Add the amount to the respective category for that month
    if (transaction.category === "INFLOW") {
      monthlyData.INFLOW[month] += transaction.amount;
    } else if (transaction.category === "OUTFLOW") {
      monthlyData.OUTFLOW[month] += transaction.amount;
    }
  });

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
    >
      {loading && (
        <div className="flex items-center justify-center space-x-4">
          <div>
            <MyLoaderFinite />
          </div>
          <div>Hold on, getting transactions</div>
        </div>
      )}
      <>
        <PermissionGuard
          requiredPermissions={[
            "read_transactions:users-transactions/all",
            "read_transactions:my-transactions/all",
            "read_transactions:facilities-transactions/all",
          ]}
        >
          <div className="relative bg-white rounded-2xl p-4 mb-4">
            <div className="flex justify-end items-center space-x-4 pb-2">
              {user.wallets.length > 0 && (
                <PermissionGuard
                  requiredPermissions={[
                    "read_transactions:my-transactions/all",
                  ]}
                >
                  <div
                    onClick={() => getMyTransactions()}
                    className="text-black flex items-center space-x-1 cursor-pointer"
                  >
                    <p>Refresh my transactions : </p>{" "}
                    <RefreshIcon stroke="black" />
                  </div>
                </PermissionGuard>
              )}
              {filterOptions.map((filter, index) => {
                const permissionMap: Record<string, string[]> = {
                  User: ["read_transactions:users-transactions/all"],
                  Facility: ["read_transactions:facilities-transactions/all"],
                  Vendor: ["read_transactions:users-transactions/all"],
                  Technician: ["read_transactions:users-transactions/all"],
                };

                const requiredPermissions = permissionMap[filter.label] || [];

                // Map filter options to the format expected by react-select
                const mappedOptions =
                  filter?.options?.map((option) => ({
                    value: option.id,
                    label:
                      (option.firstName && option.lastName
                        ? `${option.firstName} ${option.lastName}`
                        : option.name) || "",
                  })) || [];

                // Find the selected option based on your current filters value
                const selectedOption = mappedOptions.find(
                  (option) => option.value === filters[filter.label]
                );

                return (
                  <PermissionGuard
                    key={index}
                    requiredPermissions={requiredPermissions}
                  >
                    <div className="relative w-full mt-6">
                      <Select
                        key={`${filter.label}-${
                          filters[filter.label] || "empty"
                        }`}
                        options={mappedOptions}
                        value={selectedOption}
                        onChange={(selected) => {
                          handleFilterChange(filter.label, selected?.value);
                        }}
                        placeholder={`Filter by ${filter.label}`}
                        styles={multiSelectStyle}
                        isClearable
                        required
                      />
                    </div>
                  </PermissionGuard>
                );
              })}
            </div>
          </div>
        </PermissionGuard>

        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={myFormattedTransactions}
            type="transactions"
            setModalState={setCentralState}
            setModalStateDelete={setCentralStateDelete}
            toggleActions={toggleActions}
            activeRowId={activeRowId}
            setActiveRowId={setActiveRowId}
            deleteAction={setCentralStateDelete}
            currentPage={pagination.currentPage}
            setCurrentPage={(page) =>
              setPagination({ ...pagination, currentPage: page })
            }
            itemsPerPage={pagination.pageSize}
            totalPages={pagination.totalPages}
          />
        </div>
      </>
    </DashboardLayout>
  );
}

export default withPermissions(Transactions, ["transactions", "wallets"]);
