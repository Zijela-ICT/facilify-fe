"use client";

import PermissionGuardApi from "@/components/auth/permission-protected-api";
import PermissionGuard from "@/components/auth/permission-protected-components";
import DashboardLayout from "@/components/dashboard-layout-component";
import DashboardSection from "@/components/dashboard/dashboard-box";
import MyLoader from "@/components/loader-components";
import ModalCompoenent, {
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateWorkOrder from "@/components/work-order/create-work-order";
import CreateWorkRequest from "@/components/work-request/create-work-request";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import formatCurrency from "@/utils/formatCurrency";
import { BarChartIcon } from "@/utils/svg";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";

function Dashboard() {
  const axiosInstance = createAxiosInstance();
  const { callGuardedEndpoint } = PermissionGuardApi();
  const router = useRouter();
  const {
    user,
    setUser,
    userPermissions,
    userRoles,
    userCompanies,
    setUserPermissions,
    setCompanyPermissions,
    setUserRoles,
    setUserCompanies,
    setCompanyStateId,
    companyStateId,
  } = useDataPermission();

  const [selectedWallet, setSelectedWallet] = useState<any>();
  useEffect(() => {
    setSelectedWallet(user?.wallets[0]?.id);
  }, [user?.wallets]);

  const handleWalletChange = (event) => {
    setSelectedWallet(parseInt(event.target.value));
  };

  const hasNoTenantRole = userRoles.some(
    (role: Role) => role.name !== "TENANT_ROLE"
  );

  const [workRequests, setWorkRequests] = useState<any>();
  const [workOrders, setWorkOrders] = useState<any[]>();
  const [centralState, setCentralState] = useState<string>();
  const [tempcentralState, setTmpCentralState] = useState<string>();
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
    const roles = response.data.data?.user?.roles || [];
    setUserRoles(roles);
    setUserCompanies(response.data.data?.userCompanies);

    const allPermissions = roles
      .map((role: any) => role.permissions || []) // Extract permissions from each role
      .flat(); // Flatten the array of arrays
    // Remove duplicate permissions using a Set
    const uniquePermissions: Permission[] = Array.from(new Set(allPermissions));
    setUserPermissions(uniquePermissions);
  };

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("selectedCompany");

    if (userCompanies.length > 0 && !companyStateId) {
      const company = userCompanies;
      const companyId = company && company[0].companyId;
      setCompanyStateId(companyId);
      localStorage.setItem("selectedCompany", companyId);
    }
  }, [userCompanies]);

  const loading = !(user && userPermissions && userCompanies);

  const [purchaseOrders, setPurchaseOrders] = useState<any>();
  const [overdueWorkOrders, setOverdueWorkOrders] = useState<any>();
  const [pendingWorkOrders, setPendingWorkOrders] = useState<any>();
  const [overdueWorkRequests, setOverdueWorkRequests] = useState<any>();
  const [pendingWorkRequests, setPendingWorkRequests] = useState<any>();
  const [initiatedWorkRequests, setInitiatedWorkRequests] = useState<any>();
  const [requestForQuotationSubmitted, setRequestForQuotationSubmitted] =
    useState<any>();
  const [
    requestForQuotationAwaitingApproval,
    setRequestForQuotationAwaitingApproval,
  ] = useState<any>();
  const [procurementRequestSubmitted, setProcurementRequestSubmitted] =
    useState<any>();
  const [procurementRequestApproved, setProcurementRequestApproved] =
    useState<any>();
  const [procurementRequestAwaitingPoRfq, setProcurementRequestAwaitingPoRfq] =
    useState<any>();
  const [purchaseOrdersTotalCost, setPurchaseOrdersTotalCost] = useState<any>();
  const [workOrdersNew, setWorkOrdersNew] = useState<any>();
  const [workOrdersAwaitingApproval, setWorkOrdersAwaitingApproval] =
    useState<any>();

  const getPurchaseOrders = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/purchase-orders-raised",
      requiredPermissions: ["read_dashboards:purchase-orders-raised"],
    });
    setPurchaseOrders(response?.data);
  };
  const getOverdueWorkOrders = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/overdue-work-order",
      requiredPermissions: ["read_dashboards:overdue-work-order"],
    });
    setOverdueWorkOrders(response?.data);
  };
  const getPendingWorkOrders = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/pending-work-order",
      requiredPermissions: ["read_dashboards:pending-work-order"],
    });
    setPendingWorkOrders(response?.data);
  };
  const getOverdueWorkRequests = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/overdue-work-request",
      requiredPermissions: ["read_dashboards:overdue-work-request"],
    });
    setOverdueWorkRequests(response?.data);
  };
  const getPendingWorkRequests = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/pending-work-request",
      requiredPermissions: ["read_dashboards:pending-work-request"],
    });
    setPendingWorkRequests(response?.data);
  };
  const getInitiatedWorkRequests = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/initiated-work-request",
      requiredPermissions: ["read_dashboards:initiated-work-request"],
    });
    setInitiatedWorkRequests(response?.data);
  };

  const getRequestForQuotationSubmitted = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-work-order-quotation-uploaded",
      requiredPermissions: [
        "read_dashboards:total-work-order-quotation-uploaded",
      ],
    });
    setRequestForQuotationSubmitted(response?.data);
  };

  const getRequestForQuotationAwaitingApproval = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-work-order-awaiting-approval",
      requiredPermissions: [
        "read_dashboards:total-work-order-awaiting-approval",
      ],
    });
    setRequestForQuotationAwaitingApproval(response?.data);
  };

  // GET function for Procurement Request (Submitted)
  const getProcurementRequestSubmitted = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-work-order",
      requiredPermissions: ["read_dashboards:total-work-order"],
    });
    setProcurementRequestSubmitted(response?.data);
  };

  // GET function for Procurement Request (Approved)
  const getProcurementRequestApproved = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-work-order-quotation-selected",
      requiredPermissions: [
        "read_dashboards:total-work-order-quotation-selected",
      ],
    });
    setProcurementRequestApproved(response?.data);
  };

  // GET function for Procurement Request (Awaiting PO/RFQ)
  const getProcurementRequestAwaitingPoRfq = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-work-order-awaiting-quotation",
      requiredPermissions: [
        "read_dashboards:total-work-order-awaiting-quotation",
      ],
    });
    setProcurementRequestAwaitingPoRfq(response?.data);
  };

  // GET function for Purchase Orders (Total Cost Value)
  const getPurchaseOrdersTotalCost = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-cost-value",
      requiredPermissions: ["read_dashboards:total-cost-value"],
    });
    setPurchaseOrdersTotalCost(response?.data);
  };

  // GET function for Work Orders (New)
  const getWorkOrdersNew = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/initiated-work-request",
      requiredPermissions: ["read_dashboards:initiated-work-request"],
    });
    setWorkOrdersNew(response?.data);
  };

  // GET function for Work Orders (Awaiting Approval)
  const getWorkOrdersAwaitingApproval = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/total-work-order-awaiting-approval",
      requiredPermissions: [
        "read_dashboards:total-work-order-awaiting-approval",
      ],
    });
    setWorkOrdersAwaitingApproval(response?.data);
  };

  //for flow
  const [notClosedByCat, setClosedByCat] = useState<any>();
  const [overDueByDate, setOverdueByDate] = useState<any>();
  const getWorkOrdersNotClosedByCat = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/work-order-not-closed-by-cat",
      requiredPermissions: ["read_dashboards:work-order-not-closed-by-cat"],
    });
    setClosedByCat(response?.data);
  };

  const getWorkOrdersOverdueByDate = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/dashboards/workorder-overdue-by-daterange",
      requiredPermissions: ["read_dashboards:workorder-overdue-by-daterange"],
    });
    setOverdueByDate(response?.data);
  };

  const data = [
    {
      title: "Initiated Work Requests",
      number: initiatedWorkRequests?.initiatedWorkRequest,
      permisssion: ["read_dashboards:initiated-work-request"],
      path: "/dashboard",
    },
    {
      title: "Pending Work Requests",
      number: pendingWorkRequests?.pendingWorkRequest,
      permisssion: ["read_dashboards:pending-work-request"],
      path: "/dashboard",
    },
    {
      title: "OverDue Work Requests",
      number: overdueWorkRequests?.overdueWorkRequest,
      permisssion: ["read_dashboards:overdue-work-request"],
      path: "/dashboard",
    },
    {
      title: "Pending Work Orders",
      number: pendingWorkOrders?.pendingWorkOrder,
      permisssion: ["read_dashboards:pending-work-order"],
      path: "/dashboard",
    },
    {
      title: "Overdue Work Orders",
      number: overdueWorkOrders?.overdueWorkOrder,
      permisssion: ["read_dashboards:overdue-work-order"],
      path: "/dashboard",
    },
    {
      title: "Purchase Orders Raised",
      number: purchaseOrders?.purchaseOrdersRaised,
      permisssion: ["read_dashboards:purchase-orders-raised"],
      path: "/dashboard",
    },
    {
      title: "Request for Quotation (Submitted)",
      number: requestForQuotationSubmitted?.totalWorkOrderWithUploadedQuotation,
      permisssion: ["read_dashboards:total-work-order-quotation-uploaded"],
      path: "/dashboard",
    },
    {
      title: "Request for Quotation (Awaiting Approval)",
      number:
        requestForQuotationAwaitingApproval?.totalWorkOrderAwaitingApproval,
      permisssion: ["read_dashboards:total-work-order-awaiting-approval"],
      path: "/dashboard",
    },
    {
      title: "Procurement Request (Submitted)",
      number: procurementRequestSubmitted?.totalWorkOrder,
      permisssion: ["read_dashboards:total-work-order"],
      path: "/dashboard",
    },
    {
      title: "Procurement Request (Approved)",
      number: procurementRequestApproved?.totalWorkOrderWithQuotationSelected,
      permisssion: ["read_dashboards:total-work-order-quotation-selected"],
      path: "/dashboard",
    },
    {
      title: "Procurement Request (Awaiting PO/RFQ)",
      number: procurementRequestAwaitingPoRfq?.totalWorkOrderAwaitingQuotation,
      permisssion: ["read_dashboards:total-work-order-awaiting-quotation"],
      path: "/dashboard",
    },
    {
      title: "Purchase Orders (Total Cost Value)",
      number: purchaseOrdersTotalCost?.totalAmount,
      permisssion: ["read_dashboards:total-cost-value"],
      path: "/dashboard",
    },
    {
      title: "Work Orders (New)",
      number: workOrdersNew?.initiatedWorkRequest,
      permisssion: ["read_dashboards:initiated-work-request"],
      path: "/dashboard",
    },
    {
      title: "Work Orders (Awaiting Approval)",
      number: workOrdersAwaitingApproval?.totalWorkOrderAwaitingApproval,
      permisssion: ["read_dashboards:total-work-order-awaiting-approval"],
      path: "/dashboard",
    },
    { title: "Wallet Balance", number: 0, permisssion: [], path: null },
  ];

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createWorkOrder: (
      <CreateWorkOrder
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createWorkRequest: (
      <CreateWorkRequest
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createWorkOrder":
        return "Create Work Order";
      case "createWorkRequest":
        return "Create Work Request";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkOrder":
        return "You can create and manage work order here.";
      case "createWorkRequest":
        return "You can create and manage work request here.";
    }
    return "Zijela";
  };
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    getMe();
    const interval = setInterval(() => {
      getMe();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userPermissions) {
      const fetchAllData = async () => {
        await Promise.all([
          getPurchaseOrders(),
          getOverdueWorkOrders(),
          getPendingWorkOrders(),
          getOverdueWorkRequests(),
          getPendingWorkRequests(),
          getInitiatedWorkRequests(),
          getRequestForQuotationSubmitted(),
          getRequestForQuotationAwaitingApproval(),
          getProcurementRequestSubmitted(),
          getProcurementRequestApproved(),
          getProcurementRequestAwaitingPoRfq(),
          getPurchaseOrdersTotalCost(),
          getWorkOrdersNew(),
          getWorkOrdersAwaitingApproval(),
          getWorkOrdersNotClosedByCat(),
          getWorkOrdersOverdueByDate(),
        ]).then(() => {
          console.log(data);
        });
      };

      fetchAllData();
    }
  }, [userPermissions, companyStateId]);

  return (
    <>
      {!loading ? (
        <>
          <DashboardLayout
            title="Dashboard"
            detail="Manage all users and their roles."
          >
            <SuccessModalCompoenent
              title={successState.title}
              detail={successState.detail}
              modalState={successState.status}
              setModalState={(state: boolean) => {
                if (tempcentralState === "createWorkRequest") {
                  router.push("/work-requests");
                } else {
                  setSuccessState((prevState) => ({
                    ...prevState,
                    status: state,
                  }));
                }
              }}
            ></SuccessModalCompoenent>
            <ModalCompoenent
              title={getTitle()}
              detail={getDetail()}
              modalState={centralState}
              setModalState={() => {
                setCentralState("");
              }}
            >
              {componentMap[centralState]}
            </ModalCompoenent>
            <DashboardSection
              notClosedByCat={notClosedByCat}
              overDueByDate={overDueByDate}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {data?.map((item, index) =>
                (item.title === "Wallet Balance" &&
                  user?.wallets?.length > 0) ||
                item.title !== "Wallet Balance" ? (
                  <PermissionGuard
                    key={index}
                    requiredPermissions={item.permisssion}
                  >
                    <div
                      onClick={() => item?.path && router.push(item?.path)}
                      className={`${
                        item.title === "Wallet Balance"
                          ? "bg-[#FBC2B6]"
                          : "bg-white"
                      } py-5 px-4 rounded-lg flex items-center justify-between cursor-pointe`}
                    >
                      {/* Left Content */}
                      <div className="relative">
                        {item.title !== "Wallet Balance" && (
                          <h3 className="text-sm font-semibold text-gray-500 mb-1">
                            {item.title}
                          </h3>
                        )}

                        {item.title === "Wallet Balance" &&
                        user?.wallets?.length > 0 ? (
                          <div>
                            {/* Dropdown for Wallet Balance */}
                            <select
                              value={selectedWallet}
                              onChange={handleWalletChange}
                              className="text-sm font-semibold text-gray-500 mb-1"
                            >
                              {user.wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>
                                  {wallet.walletType}
                                </option>
                              ))}
                            </select>
                            <p
                              title={
                                showBalance
                                  ? `₦${formatCurrency(
                                      user.wallets.find(
                                        (wallet) => wallet.id === selectedWallet
                                      )?.balance || 0
                                    )}`
                                  : "****"
                              }
                              className="text-xl font-bold text-[#A8353A] mb-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]"
                            >
                              {showBalance ? (
                                <>
                                  ₦
                                  {formatCurrency(
                                    user.wallets.find(
                                      (wallet) => wallet.id === selectedWallet
                                    )?.balance || 0
                                  )}
                                </>
                              ) : (
                                "****"
                              )}
                            </p>
                            <div className="relative group"></div>

                            <div className="flex items-center gap-2 h-6"></div>
                          </div>
                        ) : item.title !== "Wallet Balance" ? (
                          <div>
                            <p className="text-3xl font-bold text-gray-800 mb-3">
                              {item.number === undefined ||
                              item.number === null ? (
                                <span className="animate-pulse text-sm text-gray-500">
                                  Loading...
                                </span>
                              ) : (
                                <>
                                  {item.title ===
                                    "Purchase Orders (Total Cost Value)" &&
                                    "₦"}{" "}
                                  {item.title ===
                                  "Purchase Orders (Total Cost Value)"
                                    ? formatCurrency(item.number)
                                    : item.number}
                                </>
                              )}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500"></span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {item.title === "Wallet Balance" ? (
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
                      ) : (
                        <BarChartIcon />
                      )}
                      {/* Right Icon */}
                    </div>
                  </PermissionGuard>
                ) : null
              )}
            </div>

            {/* {workOrders?.length < 1 ? (
              <div className=" w-full rounded-lg bg-white my-8 flex flex-col items-center justify-center px-6 py-10">
                <WorkIcon />
                <h1 className="text-2xl font-semibold text-black">
                  No Request/order created yet
                </h1>
                <h1 className="text-base">
                  Your active reuests and order will appear here
                </h1>
                <div className="flex space-x-4 my-4 w-2/4">
                  <ButtonComponent
                    text={"Create Work Order"}
                    onClick={() => {
                      setCentralState("createWorkOrder");
                    }}
                    className={
                      "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]"
                    }
                    permissions={["create_work-orders:/work-order"]}
                  />
                  <ButtonComponent
                    text={"Create Work Request"}
                    onClick={() => {
                      setCentralState("createWorkRequest");
                      setTmpCentralState("createWorkRequest");
                    }}
                    className={"flex-1 px-4 py-3 text-white bg-[#A8353A]"}
                    permissions={["create_work-requests"]}
                  />
                </div>
              </div>
            ) : (
              <>
                {hasNoTenantRole ? (
                  <WorkOrders nowrap={true} />
                ) : (
                  <WorkRequests nowrap={true} />
                )}
              </>
            )} */}
          </DashboardLayout>
        </>
      ) : (
        <MyLoader />
      )}
    </>
  );
}

export default Dashboard;
