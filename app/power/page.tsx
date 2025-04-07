"use client";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import FacilityDetails from "@/components/facility-management/view-facility";
import TableComponent from "@/components/table-component";
import CreateBulk from "@/components/user-management/create-bulk";
import ApportionPower from "@/components/work-request/apportionPower";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";
import { JSX, useEffect, useState } from "react";

function Power() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
    setShowFilter,
    showFilter,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
    companyStateId,
  } = useDataPermission();
  const tabs = ["Power Apportion"];

  const [powerCharges, setPowerCharges] = useState<any[]>();
  const [powerCharge, setAPowerCharge] = useState<any[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  // Fetch data functions
  const getPowerChargesUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/power-charges?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "power_charges");
  };

  const getPowerCharges = async () => {
    const response = await axiosInstance.get(
      `/power-charges?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setPowerCharges(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAPowerCharge = async () => {
    const response = await axiosInstance.get(`/power-charges/${activeRowId}`);
    setAPowerCharge(response.data.data);
  };

  // Delete functions
  const deletePowerCharge = async () => {
    await axiosInstance.delete(`/power-charges/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this vendor",
      status: true,
    });
  };

  const approvePowerCharge = async () => {
    await axiosInstance.patch(`/power-charges/${activeRowId}/status/approve`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved this power charge",
      status: true,
    });
  };

  const apportionPowerCharge = async () => {
    await axiosInstance.patch(`/power-charges/${activeRowId}/apportion`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully apportioned power charge",
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
      case "createPowerCharge":
        return "Create Power Charge";
      case "viewPowerCharge":
        return "View Power Charge";
      case "createBulkPowerCharge":
        return "Upload Bulk Power Charge";
    }
    switch (centralStateDelete) {
      case "approvePowerCharge":
        return "Approve Power Charge";
      case "apportionPowerCharge":
        return "Apportion Power Charge";
      case "deletePowerCharge":
        return "Delete Power Charge";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createPowerCharge":
        return "";
      case "viewPowerCharge":
        return "";
      case "createBulkPowerCharge":
        return "Import CSV/Excel file";
    }
    switch (centralStateDelete) {
      case "approvePowerCharge":
        return "Are you sure you want to approve the power charge";
      case "apportionPowerCharge":
        return "Are you sure you want to apportion the power charge";
      case "deletePowerCharge":
        return "Are you sure you want to delete the power charge";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createPowerCharge: (
      <ApportionPower
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkPowerCharge: (
      <CreateBulk
        type="Power Charges"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    viewPowerCharge: (
      <div className="p-4">
        <FacilityDetails facility={powerCharge} title="Power Charge" />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewPowerCharge") {
      getAPowerCharge();
    }
  }, [centralState]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getPowerCharges()]);
    };
    fetchData();
  }, [
    centralState,
    centralStateDelete,
    pagination.currentPage,
    searchQuery,
    filterQuery,
    companyStateId,
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      getPowerChargesUnPaginated();
      setShowFilter("");
    }
  }, [showFilter, filterQuery]);

  return (
    <DashboardLayout
      title="Power"
      detail="Manage and track all power apportionment here"
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={
        centralStateDelete === "approvePowerCharge"
          ? approvePowerCharge
          : centralStateDelete === "apportionPowerCharge"
          ? apportionPowerCharge
          : centralStateDelete === "deletePowerCharge"
          ? deletePowerCharge
          : null
      }
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard requiredPermissions={["read_power-charges"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={powerCharges}
            type="powers"
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
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(Power, ["power-charges"]);
