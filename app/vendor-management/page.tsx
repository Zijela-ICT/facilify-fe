"use client";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import DynamicCreateForm from "@/components/dynamic-create-form";
import TableComponent from "@/components/table-component";
import CreateBulk from "@/components/user-management/create-bulk";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";
import { JSX, useEffect, useState } from "react";

function VendorManagement() {
  const axiosInstance = createAxiosInstance();
  const {
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
  const tabs = ["Vendors", "Technicians"];

  const [vendors, setVendors] = useState<Vendor[]>();
  const [technicians, setTechnicians] = useState<Technician[]>();
  const [vendor, setVendor] = useState<Vendor>();
  const [technician, setTechnician] = useState<Technician>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  // Fetch data functions

  const getVendorsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/vendors?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "vendors");
  };

  const getVendors = async () => {
    const response = await axiosInstance.get(
      `/vendors?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setVendors(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getTechniciansUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/technicians?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "technicians");
  };

  const getTechnicians = async () => {
    const response = await axiosInstance.get(
      `/technicians?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setTechnicians(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAVendor = async () => {
    const response = await axiosInstance.get(`/vendors/${activeRowId}`);
    setVendor(response.data.data);
  };
  const getATechnician = async () => {
    const response = await axiosInstance.get(`/technicians/${activeRowId}`);
    setTechnician(response.data.data);
  };

  // Delete functions
  const deleteVendor = async () => {
    await axiosInstance.delete(`/vendors/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this vendor",
      status: true,
    });
  };

  const deleteTechnician = async () => {
    await axiosInstance.delete(`/technicians/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this technician",
      status: true,
    });
  };

  const deactivateVendor = async () => {
    await axiosInstance.patch(`/vendors/${activeRowId}`, {
      isDeactivated: !vendor.isDeactivated,
    });
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this vendor",
      status: true,
    });
  };

  const deactivateTechnician = async () => {
    await axiosInstance.patch(`/technicians/${activeRowId}`, {
      isDeactivated: !technician.isDeactivated,
    });
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this technician",
      status: true,
    });
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    if (selectedTab === "Vendors" || selectedTab === "Technicians") {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    } else {
      setActiveRowId(rowId);
    }
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createVendor":
        return activeRowId ? "Edit Vendor" : "Create Vendor";
      case "createTechnician":
        return activeRowId ? "Edit Technician" : "Create Technician";
      case "createBulkVendor":
        return "Upload Bulk Vendors";
      case "createBulkTechnician":
        return "Upload Bulk Technicians";
    }
    switch (centralStateDelete) {
      case "deactivateVendor":
        return "De-activate Vendor";
      case "activateVendor":
        return "Re-activate Vendor";
      case "deleteVendor":
        return "Delete Vendor";
      case "deactivateTechnician":
        return "De-activate Technician";
      case "activateTechnician":
        return "Re-activate Technician";
      case "deleteTechnician":
        return "Delete Technician";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createVendor":
        return activeRowId
          ? "You can edit vendor details here."
          : "You can create and manage vendor here.";
      case "createBulkVendor":
        return "Import CSV/Excel file";
      case "createTechnician":
        return activeRowId
          ? "You can edit technician details here."
          : "You can manage technicians here.";
      case "createBulkTechnician":
        return "Import CSV/Excel file";
      case "viewPermissions":
        return "All permissions available for this role";
    }
    switch (centralStateDelete) {
      case "activateVendor":
        return "Are you sure you want to Re-activate this vendor";
      case "deactivateVendor":
        return "Are you sure you want to de-activate this vendor";
      case "deleteVendor":
        return "Are you sure you want to delete this vendor";
      case "activateTechnician":
        return "Are you sure you want to Re-activate this technician";
      case "deactivateTechnician":
        return "Are you sure you want to de-activate this technician";
      case "deleteTechnician":
        return "Are you sure you want to delete this technician";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createVendor: (
      <DynamicCreateForm
        inputs={[
          { name: "vendorName", label: "Vendor Name", type: "text" },
          { name: "vendorCode", label: "Vendor Code", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phoneNumber", label: "Phone Number", type: "text" },
          { name: "email", label: "Email address", type: "text" },
        ]}
        selects={[
          {
            name: "vendorType",
            label: "Vendor Type",
            placeholder: "Select Vendor Type",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
          {
            name: "category",
            label: "Vendor Category",
            placeholder: "Select Category",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
        ]}
        title="Vendor"
        apiEndpoint="/vendors"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/vendors/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createBulkVendor: (
      <CreateBulk
        type="Vendors"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createTechnician: (
      <DynamicCreateForm
        inputs={[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "surname", label: "Surname", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phoneNumber", label: "Phone Number", type: "text" },
          { name: "email", label: "Email address", type: "text" },
        ]}
        selects={[
          {
            name: "serviceCategory",
            label: "Service Category",
            placeholder: "Select Category",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Private" },
            ],
          },
        ]}
        title="Technician"
        apiEndpoint="/technicians"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/technicians/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createBulkTechnician: (
      <CreateBulk
        type="Technicians"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
  };

  useEffect(() => {
    if (
      centralStateDelete === "deactivateVendor" ||
      centralStateDelete === "activateVendor"
    ) {
      getAVendor();
    } else if (
      centralStateDelete === "deactivateTechnician" ||
      centralStateDelete === "activateTechnician"
    ) {
      getATechnician();
    }
  }, [centralStateDelete]);

  const tabPermissions: { [key: string]: string[] } = {
    Vendors: ["read_vendors"],
    Technicians: ["read_technicians"],
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
    if (selectedTab === "Technicians") {
      getTechnicians();
    } else {
      const fetchData = async () => {
        await Promise.all([getVendors()]);
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
      if (selectedTab === "Technicians") {
        getTechniciansUnPaginated();
      } else {
        getVendorsUnPaginated();
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
      title="Vendor Management"
      detail="Manage all vendors and technicians here"
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={
        centralStateDelete === "deactivateTechnician" ||
        centralStateDelete === "activateTechnician"
          ? deactivateTechnician
          : centralStateDelete === "deleteTechnician"
          ? deleteTechnician
          : centralStateDelete === "deactivateVendor" ||
            centralStateDelete === "activateVendor"
          ? deactivateVendor
          : centralStateDelete === "deleteVendor"
          ? deleteVendor
          : undefined
      }
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard
        requiredPermissions={["read_vendors", "read_technicians"]}
      >
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
        requiredPermissions={["read_vendors", "read_technicians"]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "Vendors" && (
            <TableComponent
              data={vendors}
              type="vendors"
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
          {selectedTab === "Technicians" && (
            <TableComponent
              data={technicians}
              type="technicians"
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

export default withPermissions(VendorManagement, ["vendors"]);
