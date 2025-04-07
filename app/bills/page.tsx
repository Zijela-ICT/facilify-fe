"use client";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import FacilityDetails from "@/components/facility-management/view-facility";
import TableComponent from "@/components/table-component";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";
import { JSX, useEffect, useState } from "react";

function VendorManagement() {
  const axiosInstance = createAxiosInstance();
  const {
    user,
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
    showFilter,
    setShowFilter,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
    companyStateId,
  } = useDataPermission();

  const tabs = ["My Bills", "All Bills"];

  const [bills, setBills] = useState<any[]>([]);
  const [mybills, setMyBills] = useState<any[]>([]);
  const [bill, setABill] = useState<any>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const getBillsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/bills?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "bills");
  };

  const getBills = async () => {
    const response = await axiosInstance.get(
      `/bills?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setBills(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getMyBillsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/bills/my-bills/all?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, `${user.firstName}_${user.lastName}_bills`);
  };

  const getMyBills = async () => {
    const response = await axiosInstance.get(
      `/bills/my-bills/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setMyBills(response.data.data);
    const extra = response.data.extra;
    if (extra) {
      setPagination({
        currentPage: extra.page,
        pageSize: extra.pageSize,
        total: extra.total,
        totalPages: extra.totalPages,
      });
    }
  };

  const getABill = async () => {
    const response = await axiosInstance.get(`/bills/${activeRowId}`);
    setABill(response.data.data);
  };

  const payBills = async () => {
    await axiosInstance.patch(`/bills/${activeRowId}/pay`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have paid for this bill",
      status: true,
    });
  };
  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "viewBills":
        return "Bills Details";
    }
    switch (centralStateDelete) {
      case "payBills":
        return "Pay bills";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "viewBills":
        return "";
    }
    switch (centralStateDelete) {
      case "payBills":
        return "Are you sure you want to pay for this bill";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    viewBills: (
      <div className="p-4">
        <FacilityDetails facility={(bill && bill[0]) || bill} title="Bills" />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewBills") {
      getABill();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "My Bills": ["read_bills:my-bills/all"],
    "All Bills": ["read_bills"],
  };

  const { userPermissions } = useDataPermission();

  const getDefaultTab = () => {
    const userPermissionStrings = userPermissions.map(
      (perm) => perm.permissionString
    );

    return tabs.find((tab) =>
      (tabPermissions[tab] || []).every((permission) =>
        userPermissionStrings.includes(permission)
      )
    );
  };

  const [selectedTab, setSelectedTab] = useState<string>(getDefaultTab() || "");

  useEffect(() => {
    if (selectedTab === "All Bills") {
      getBills();
    } else {
      const fetchData = async () => {
        await Promise.all([getMyBills()]);
      };
      fetchData();
    }
  }, [
    centralState,
    centralStateDelete,
    selectedTab,
    pagination.currentPage,
    searchQuery,
    filterQuery,
    companyStateId,
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      if (selectedTab === "All Bills") {
        getBillsUnPaginated();
      } else {
        getMyBillsUnPaginated();
      }
      setShowFilter("");
    }
  }, [showFilter, filterQuery]);

  //new clear
  useEffect(() => {
    clearSearchAndPagination();
  }, [selectedTab]);

  return (
    <DashboardLayout
      title="Bills"
      detail="Manage all bills here"
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={centralStateDelete === "payBills" ? payBills : undefined}
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard requiredPermissions={["read_bills"]}>
        <div className="relative bg-white rounded-2xl p-4">
          <div className="flex space-x-4 pb-2">
            {tabs.map((tab) => (
              <PermissionGuard
                key={tab}
                requiredPermissions={tabPermissions[tab] || []} // Match tab to permissions
              >
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 text-xs font-medium focus:outline-none group ${
                    selectedTab === tab
                      ? "text-[#A8353A] font-semibold" // Active tab styles
                      : ""
                  }`}
                >
                  {tab}
                  {selectedTab === tab && (
                    <span className="absolute left-0 bottom-[-5px] w-full h-[2px] bg-[#A8353A]"></span>
                  )}
                </button>
              </PermissionGuard>
            ))}
          </div>
        </div>
      </PermissionGuard>

      <PermissionGuard
        requiredPermissions={["read_bills", "read_bills:my-bills/all"]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "My Bills" && (
            <TableComponent
              data={mybills}
              type="bills"
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
          )}
          {selectedTab === "All Bills" && (
            <TableComponent
              data={bills}
              type="bills"
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
          )}
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(VendorManagement, ["bills"]);
