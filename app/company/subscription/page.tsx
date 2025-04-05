"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import { JSX, useEffect, useState } from "react";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DynamicCreateForm from "@/components/dynamic-create-form";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";

function Power() {
  const axiosInstance = createAxiosInstance();
  const {
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
  } = useDataPermission();

  const [payments, setPayments] = useState<any[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  const getPaymentsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/payments/?search=${searchQuery}&&filters[type]=MANUAL_FUNDING`
    );
    exportToCSV(response.data.data, "payments");
  };

  const getPayments = async () => {
    const response = await axiosInstance.get(
      `/payments/?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&filters[type]=MANUAL_FUNDING`
    );
    setPayments(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const approveFunding = async () => {
    await axiosInstance.patch(`/payments/manual-fund/${activeRowId}/verify`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved this power charge",
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
      case "rejectFunding":
        return "Reject";
    }
    switch (centralStateDelete) {
      case "approveFunding":
        return "Verify Funding";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "rejectFunding":
        return "Give reason for rejection";
    }
    switch (centralStateDelete) {
      case "approveFunding":
        return "Are you sure you want to verify this payment";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    rejectFunding: (
      <DynamicCreateForm
        inputs={[
          {
            name: "reasonForRejection",
            label: "Reason for rejection",
            type: "textarea",
          },
        ]}
        selects={[]}
        title="Reject fund"
        apiEndpoint={`/payments/manual-fund/${activeRowId}/reject`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/payments/${id}`).then((res) => res.data.data)
        }
      />
    ),
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getPayments()]);
    };
    fetchData();
  }, [
    centralState,
    centralStateDelete,
    pagination.currentPage,
    searchQuery,
    filterQuery,
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      getPaymentsUnPaginated();
      setShowFilter("");
    }
  }, [showFilter, filterQuery]);

  return (
    <DashboardLayout
      title="Mange Funding"
      detail="Manage and approve all pending fundings"
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={
        centralStateDelete === "approveFunding" ? approveFunding : null
      }
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard requiredPermissions={["read_payments"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={payments}
            type="approvefunding"
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

export default withPermissions(Power, ["companies"]);
