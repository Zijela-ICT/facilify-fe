"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import { JSX, useEffect, useState } from "react";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
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

  const [auditLogs, setAuditLogs] = useState<any[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  const getPowerChargesUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/audit-logs?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "audit_logs");
  };

  const getAuditLogs = async () => {
    const response = await axiosInstance.get(
      `/audit-logs?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setAuditLogs(response.data.data);
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

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {};

  const { userPermissions } = useDataPermission();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAuditLogs()]);
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
      title="Audit Logs"
      detail="View all audit logs here"
      getTitle={() => ""}
      getDetail={() => ""}
      componentMap={componentMap}
      takeAction={null}
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard requiredPermissions={["read_audit-logs"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={auditLogs}
            type="auditlogs"
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

export default withPermissions(Power, ["audit-logs"]);
