"use client";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import DynamicCreateForm from "@/components/dynamic-create-form";
import TableComponent from "@/components/table-component";
import PermissionList from "@/components/user-management/view-permissions";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";
import { JSX, useEffect, useState } from "react";

function Approvers() {
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

  const [roles, setRoles] = useState<Role[]>();
  const [approvers, setApprovers] = useState<any[]>();

  const [approver, setApprover] = useState<any[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  // Fetch data functions

  const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    setRoles(response.data.data);
  };

  const getApproversUnPaginated = async () => {
    const APPROVAL_ROLE = roles.find(
      (role: Role) => role.name === "APPROVAL_ROLE"
    );
    if (APPROVAL_ROLE) {
      const response = await axiosInstance.get(
        `/roles/${APPROVAL_ROLE.id}?search=${searchQuery}&&${filterQuery}`
      );
      exportToCSV(response.data.data?.users, "approvers");
    }
  };

  const getApprovers = async () => {
    const APPROVAL_ROLE = roles.find(
      (role: Role) => role.name === "APPROVAL_ROLE"
    );
    if (APPROVAL_ROLE) {
      const response = await axiosInstance.get(
        `/roles/${APPROVAL_ROLE.id}?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
      );
      setApprovers(response.data.data?.users);

      const extra = response.data.extra;
      if (extra) {
        setPagination({
          currentPage: extra.page,
          pageSize: extra.pageSize,
          total: extra.total,
          totalPages: extra.totalPages,
        });
      }
    }
  };

  const getAApprover = async () => {
    const response = await axiosInstance.get(`/users/${activeRowId}`);
    setApprover(response.data.data);
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "editApprover":
        return "Edit Approver";
      case "viewApprover":
        return "Role permissions";
    }
    switch (centralStateDelete) {
      case "deleteUser":
        return "De-activate User";
      case "activateUser":
        return "Re-activate User";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "editApprover":
        return "You can edit approval limits here.";
      case "viewApprover":
        return "";
    }
    switch (centralStateDelete) {
      case "activateUser":
        return "Are you sure you want to Re-activate this user";
      case "deleteUser":
        return "Are you sure you want to de-activate this user";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    editApprover: (
      <DynamicCreateForm
        inputs={[{ name: "limit", label: "Approval Limit", type: "number" }]}
        selects={[]}
        title="Edit Limit"
        apiEndpoint={`${
          activeRowId && `/users/${activeRowId}/update-approval-limit`
        }`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
        }
      />
    ),
    viewApprover: (
      <div className="p-4">
        <PermissionList groupedPermissions={[]} />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewApprover") {
      getAApprover();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    Approver: ["read_users"],
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
    getRoles();
  }, []);

  useEffect(() => {
    if (roles) {
      getApprovers();
    }
  }, [
    roles,
    centralState,
    centralStateDelete,
    pagination.currentPage,
    searchQuery,
    filterQuery,
    companyStateId,
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      getApproversUnPaginated();
      setShowFilter("");
    }
  }, [showFilter, filterQuery]);

  //new clear
  useEffect(() => {
    clearSearchAndPagination();
  }, [selectedTab]);

  return (
    <DashboardLayout
      title="Approvers"
      detail="Manage and track all appprovers here"
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={null}
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard requiredPermissions={["read_users"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={approvers}
            type="approvers"
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

export default withPermissions(Approvers, ["users"]);
