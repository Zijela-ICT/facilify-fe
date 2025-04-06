"use client";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import DynamicCreateForm from "@/components/dynamic-create-form";
import TableComponent from "@/components/table-component";
import CreateBulk from "@/components/user-management/create-bulk";
import CreateRole from "@/components/user-management/create-role";
import ResetPassword from "@/components/user-management/reset-password";
import PermissionList from "@/components/user-management/view-permissions";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";
import { SearchIcon } from "@/utils/svg";
import { JSX, useEffect, useState } from "react";

function UserManagement() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
    showFilter,
    setShowFilter,
    companyStateId,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();
  const tabs = ["All Users", "Roles", "Permissions"];

  const [users, setUsers] = useState<User[]>();
  const [usersBulkExample, setUsersBulkExample] = useState<any>();
  const [roles, setRoles] = useState<Role[]>();
  const [role, setRole] = useState<RoleData>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  const getUsersUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/users?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "users");
  };
  // const getUsers = async () => {
  //   const response = await axiosInstance.get(
  //     `/users?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
  //   );
  //   setUsers(response.data.data);
  //   const extra = response.data.extra;
  //   setUsersBulkExample(response.data.extra);
  //   setPagination({
  //     currentPage: extra.page,
  //     pageSize: extra.pageSize,
  //     total: extra.total,
  //     totalPages: extra.totalPages,
  //   });
  // };

  const getUsers = async () => {
    const response = await axiosInstance.get(
      `/user-company-role/company-users?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setUsers(response.data.data);
    const extra = response.data.extra;

    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getRolesUnpaginated = async () => {
    try {
      // Fetch roles
      const response = await axiosInstance.get(
        `/roles?search=${searchQuery}&&${filterQuery}`
      );
      const roles = response.data.data;
      // Export roles with permissions to CSV
      exportToCSV(roles, "roles");
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const getRoles = async () => {
    const response = await axiosInstance.get(
      `/roles?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );

    const filteredRoles = response.data.data.map(
      ({ permissions, ...rest }) => rest
    );
    setRoles(filteredRoles);
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

  const getARole = async () => {
    const response = await axiosInstance.get(`/roles/${activeRowId}`);
    setRole(response.data.data);
  };

  const getPermissions = async () => {
    const response = await axiosInstance.get("/permissions");
    setPermissions(response.data.data);
  };

  // Delete functions
  const deleteUser = async () => {
    await axiosInstance.delete(`/users/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this user",
      status: true,
    });
  };

  const deleteRole = async (id: number) => {
    await axiosInstance.delete(`/roles/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this role",
      status: true,
    });
  };

  // Group permissions by category
  const groupPermissions = (permissions: Permission[]) => {
    return permissions?.reduce((groups, permission) => {
      const category = permission?.permissionString
        ?.split(":")[0]
        ?.split("_")[1];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  const groupedPermissions = groupPermissions(permissions);
  const groupedPermissionsByUser = groupPermissions(role?.permissions);

  // Toggle actions
  const toggleActions = (rowId: string) => {
    if (selectedTab === "All Users" || selectedTab === "Roles") {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    } else {
      setActiveRowId(rowId);
    }
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createUser":
        return activeRowId ? "Edit User" : "Create User";
      case "createRole":
        return activeRowId ? "Edit Role" : "Create Role";
      case "createBulkUser":
        return "Upload Bulk User";
      case "createBulkRole":
        return "Upload Bulk Role";
      case "resetPassword":
        return "Reset Password";
      case "viewPermissions":
        return "Role permissions";
    }
    switch (centralStateDelete) {
      case "deleteUser":
        return "De-activate User";
      case "activateUser":
        return "Re-activate User";
      case "deleteRole":
        return "Delete Role";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createUser":
        return activeRowId
          ? "You can edit user details here."
          : "You can create and manage users' access here.";
      case "createRole":
        return activeRowId
          ? "You can edit role details here."
          : "You can manage users' access here.";
      case "createBulkUser":
        return "Import CSV/Excel file";
      case "createBulkRole":
        return "Import CSV/Excel file";
      case "resetPassword":
        return "Change the password for this user";
      case "viewPermissions":
        return "All permissions available for this role";
    }
    switch (centralStateDelete) {
      case "activateUser":
        return "Are you sure you want to Re-activate this user";
      case "deleteUser":
        return "Are you sure you want to de-activate this user";
      case "deleteRole":
        return "Are you sure you want to delete this role";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createUser: (
      <DynamicCreateForm
        inputs={[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "email", label: "Email address", type: "email" },
        ]}
        selects={[
          {
            name: "roles",
            label: "Roles",
            placeholder: "Assign Roles",
            options: roles?.map((asset: Role) => ({
              value: asset.id,
              label: asset.name,
            })),
            isMulti: true,
          },
        ]}
        title="User"
        // apiEndpoint={`${activeRowId ? "/users" : "/users/pre-register"}`}
        apiEndpoint={`${activeRowId ? "/users" : "/users/create/company-user"}`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createBulkUser: (
      <CreateBulk
        type="Users"
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
        bulkExample={usersBulkExample?.bulkFile}
      />
    ),
    createRole: (
      <CreateRole
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
    createBulkRole: (
      <CreateBulk
        type="Roles"
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
    resetPassword: (
      <ResetPassword
        roles={roles}
        setModalState={setCentralState}
        activeRowId={activeRowId}
        setSuccessState={setSuccessState}
      />
    ),
    viewPermissions: (
      <div className="p-4">
        <PermissionList groupedPermissions={groupedPermissionsByUser || []} />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewPermissions") {
      getARole();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "All Users": ["read_users"], // Permission to view "All Users"
    Role: ["read_roles"], // Permission to view "Role"
    Permissions: ["read_permissions"], // Permission to view "Permissions"
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
    if (selectedTab === "Role") {
      getRoles();
    } else if (selectedTab === "Permissions") {
      getPermissions();
    } else {
      const fetchData = async () => {
        await Promise.all([getUsers(), getRoles()]);
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
      if (selectedTab === "All Users") {
        getUsersUnPaginated();
      } else {
        getRolesUnpaginated();
      }
      setShowFilter("");
    }
  }, [showFilter, filterQuery]);

  //new clear
  useEffect(() => {
    clearSearchAndPagination();
  }, [selectedTab]);

  const [searchData, setSearchQuery] = useState("");
  const filteredPermissions = Object.entries(groupedPermissions).reduce(
    (acc, [category, permissions]) => {
      const filtered = permissions.filter(({ permissionString }) =>
        permissionString.toLowerCase().includes(searchData.toLowerCase())
      );

      if (filtered.length > 0) {
        acc[category] = filtered;
      }

      return acc;
    },
    {} as typeof groupedPermissions
  );

  return (
    <DashboardLayout
      title="User Management"
      detail="Manage all users and their roles."
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={centralStateDelete === "deleteRole" ? deleteRole : deleteUser}
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard
        requiredPermissions={["read_users", "read_permission", "read_roles"]}
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
        requiredPermissions={["read_users", "read_permission", "read_roles"]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "All Users" && (
            <TableComponent
              data={users}
              type="users"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
              //new

              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
            />
          )}
          {selectedTab === "Roles" && (
            <TableComponent
              data={roles}
              type="roles"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
            />
          )}
          {selectedTab === "Permissions" && (
            <>
              <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0  font-semibold text-md mb-4">
                <div
                  className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 w-full`}
                >
                  {/* Search Icon */}
                  <span className="pl-3 text-gray-400 mt-2">
                    <SearchIcon />
                  </span>
                  <input
                    id="searchInput"
                    type="text"
                    placeholder="Search for permission..."
                    value={searchData}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-1 py-4 w-full focus:outline-none"
                  />
                </div>
              </div>
              <PermissionList groupedPermissions={filteredPermissions} />
            </>
          )}
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(UserManagement, ["users", "roles"]);
