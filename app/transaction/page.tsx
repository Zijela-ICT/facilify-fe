"use client";

import PermissionGuardApi from "@/components/auth/permission-protected-api";
import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import { MyLoaderFinite } from "@/components/loader-components";
import ModalCompoenent from "@/components/modal-component";
import ManagePin from "@/components/transaction/create-pin";
import FundOtherWallet from "@/components/transaction/fund-other-wallet";
import FundWallet from "@/components/transaction/fund-wallet";
import Payouts from "@/components/transaction/payout";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import formatCurrency from "@/utils/formatCurrency";
import { chartOptions, multiSelectStyle } from "@/utils/ojects";
import {
  ArrowLeft,
  IncomingIcon,
  OutgoingIcon,
  RefreshIcon,
  TransactionIcon,
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
import moment from "moment";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
    companyStateId,
  } = useDataPermission();
  const [filters, setFilters] = useState({
    User: "",
    Facility: "",
    Vendor: "",
    Technician: "",
  });

  const [code, setCode] = useState(Array(4).fill("")); // Array to hold each digit
  const [loading, setLoading] = useState<boolean>();
  const [transactionId, setTransactionId] = useState<any>();
  const [entity, setEntity] = useState<any>();

  const [vendors, setVendors] = useState<Vendor[]>();
  const [technicians, setTechnicians] = useState<Technician[]>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [users, setUsers] = useState<User[]>();

  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>();

  const filterOptions = [
    {
      label: "User",
      options: users,
    },
    { label: "Facility", options: facilities },
    // { label: "Unit", options: [] },
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

  // Handle changes for each input box
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
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

  const getMyTransactions = async () => {
    const response = await callGuardedEndpoint({
      endpoint: `/transactions/my-transactions/all`,
      requiredPermissions: ["read_transactions:my-transactions/all"],
    });

    setFilteredTransactions(response?.data);
  };

  const getAUserTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.User}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getAVendorTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Vendor}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getATechnicianTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Technician}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getAFacilityTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/facility-transactions/all/${filters.Facility}`
    );
    setFilteredTransactions(response.data.data);
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
      setLoading(true);
      await getMyTransactions();
      setLoading(false);
    };

    //doesnt have wallet, so no call for transactions
    if (user.wallets.length > 0) {
      fetchTransactions();
    } else {
      setFilteredTransactions([]);
    }
  }, [   companyStateId,]);

  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      setLoading(true);

      if (filters.User) {
        await getAUserTransactions();
      } else if (filters.Vendor) {
        await getAVendorTransactions();
      } else if (filters.Technician) {
        await getATechnicianTransactions();
      } else if (filters.Facility) {
        await getAFacilityTransactions();
      }

      setTimeout(() => setLoading(false), 1500);
    };

    fetchFilteredTransactions();
  }, [filters,   companyStateId,]);

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

  // Prepare the final chart data
  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Inflow",
        data: monthlyData.INFLOW, // Cumulative inflow values per month
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        pointRadius: 0,
        pointBackgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Outflow",
        data: monthlyData.OUTFLOW, // Cumulative outflow values per month
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        pointRadius: 0,
        pointBackgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const [PINState, setPINState] = useState<string>();
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  // Component mapping
  const componentMap: Record<string, JSX.Element> = {
    fundWallet: (
      <FundWallet
        activeRowId={user.wallets[selectedWalletIndex]?.id}
        setModalState={setCentralState}
        type={"User"}
      />
    ),
    fundOtherWallet: (
      <FundOtherWallet
        activeRowId={user.wallets[selectedWalletIndex]?.id}
        setModalState={setCentralState}
        setPINState={setPINState}
        code={code}
        setCode={setCode}
        setSuccessState={setSuccessState}
        type={"User"}
      />
    ),
    payout: (
      <Payouts
        activeRowId={user.wallets[selectedWalletIndex]?.id}
        setModalState={setCentralState}
        setPINState={setPINState}
        code={code}
        setCode={setCode}
        setSuccessState={setSuccessState}
        type={"User"}
      />
    ),
    managePin: (
      <>
        <ManagePin
          activeRowId={user.wallets[selectedWalletIndex]?.id}
          setModalState={setCentralState}
          setSuccessState={setSuccessState}
        />
      </>
    ),
    enterPIN: (
      <div className="flex gap-1 justify-between pt-6 pb-8 px-10 ">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className="w-12 h-12 text-center bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
    ),
  };

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
      getTitle={() =>
        centralState === "fundWallet"
          ? "Fund Wallet"
          : centralState === "managePin"
          ? "Manage Pin"
          : "Transfer"
      }
      getDetail={() => ""}
      componentMap={componentMap}
      takeAction={null}
    >
      {/* special modal and states */}
      <ModalCompoenent
        width="max-w-sm"
        title={"Enter your PIN"}
        detail={""}
        modalState={PINState}
        setModalState={() => {
          setPINState("");
          setCode(Array(4).fill(""));
        }}
      >
        {componentMap[PINState]}
      </ModalCompoenent>
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
            <div className=" whitespace-nowrap pb-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
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
                      <p>Refresh my transactions : </p>
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
                            setTransactionId(selected?.value);
                            setEntity(filter.label);
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
          </div>
        </PermissionGuard>

        {user.wallets.length > 0 && (
          <div
            className="relative bg-cover bg-center bg-no-repeat rounded-2xl px-4 py-4 "
            style={{
              backgroundImage: "url('/assets/wallet-bg.jpeg')",
            }}
          >
            {user.wallets.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                <select
                  value={selectedWalletIndex}
                  onChange={(e) =>
                    setSelectedWalletIndex(Number(e.target.value))
                  }
                  className=" rounded px-3 py-1 border border-gray-300 focus:outline-none focus:border-[#A8353A]"
                >
                  {user.wallets.map((wallet, index) => (
                    <option key={wallet.id || index} value={index}>
                      {wallet.walletType}
                      {wallet.hash && ` - ${wallet.hash.slice(0, 6)}...`}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setCentralState("fundWallet")}
                  className="px-3 py-1 rounded bg-white text-black"
                >
                  Fund Wallet
                </button>
                <button
                  onClick={() => setCentralState("fundOtherWallet")}
                  className="px-3 py-1 rounded bg-white text-black"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setCentralState("payout")}
                  className="px-3 py-1 rounded bg-white text-black"
                >
                  Payout
                </button>
                {/* <button
                  onClick={() => setCentralState("managePin")}
                  className="px-3 py-1 rounded bg-white text-black"
                >
                  Manage PIN
                </button> */}
              </div>
            )}
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-200 ">Account Balance</span>
              <div className="text-white py-2 flex items-center space-x-1">
                <RefreshIcon /> <p>Refresh </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-2xl">
                {showBalance ? (
                  <>
                    ₦{" "}
                    {formatCurrency(user.wallets[selectedWalletIndex]?.balance)}
                  </>
                ) : (
                  "****"
                )}{" "}
                -
                {showBalance ? (
                  <span className="mx-2 inline-flex items-center">
                    {user.wallets[selectedWalletIndex]?.walletID}
                    <span
                      className="ml-2 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          user.wallets[selectedWalletIndex]?.walletID
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </span>
                  </span>
                ) : (
                  "****"
                )}
              </div>
              <svg
                onClick={() => setShowBalance(!showBalance)}
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        )}

        {!filteredTransactions ? (
          // Loading state
          <div className="flex flex-col items-center justify-center h-64 bg-white mt-4">
            <MyLoaderFinite />
          </div>
        ) : filteredTransactions.length < 1 ? (
          // No transactions state
          <div className="flex flex-col items-center justify-center h-64 bg-white mt-4">
            <TransactionIcon width="71" height="71" />
            <p className="mt-4 text-gray-600 text-lg font-medium">
              No Transactions Found
            </p>
            <p className="text-sm text-gray-500">
              You haven't made any transactions yet.
            </p>
          </div>
        ) : (
          // Transactions exist: render Graph and Transactions List
          <div className="flex flex-col md:flex-row w-full h-auto space-y-4 md:space-y-0 md:space-x-4 mt-4">
            {/* Left Section (Graph) */}
            <div className="w-full md:w-3/5 bg-white rounded-lg p-6">
              <h2 className="text-base font-semibold mb-4 text-black">
                Transaction Trend
              </h2>
              <div className="h-full">
                {/* Graph Placeholder */}
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Right Section (Simple List) */}
            <div className="w-full md:w-2/5 bg-white p-4 rounded-lg">
              <div className="flex items-baseline text-base justify-between mb-6">
                <h2 className="font-semibold text-black">
                  Recent Transactions
                </h2>
                <h2 className="font-medium text-[#A8353A] flex items-center space-x-1 cursor-pointer">
                  <Link
                    href={`/transactions/${transactionId || "*"}/${
                      entity || "*"
                    }`}
                  >
                    See all
                  </Link>
                  <div className="rotate-180">
                    <ArrowLeft />
                  </div>
                </h2>
              </div>
              <ul>
                {filteredTransactions.slice(0, 6).map((log) => (
                  <li
                    key={log.id}
                    className="flex justify-between items-start mb-4 border-b text-sm border-gray-100 last:border-b-0 pb-4"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {log.category === "INFLOW" ? (
                          <IncomingIcon />
                        ) : (
                          <OutgoingIcon />
                        )}
                      </div>
                      <div className="ml-4 flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            {log.description}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1 font-thin">
                          {moment.utc(log.createdAt).format("ll")}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-600 font-medium whitespace-nowrap">
                      ₦ {formatCurrency(log.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
}

export default withPermissions(Transactions, ["transactions", "wallets"]);
