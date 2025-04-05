"use client";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import AvatarUploader from "@/components/company/upload-logo";
import DashboardLayout from "@/components/dashboard-layout-component";
import DynamicCreateForm from "@/components/dynamic-create-form";
import TableComponent from "@/components/table-component";
import CreateBulk from "@/components/user-management/create-bulk";
import ResetPassword from "@/components/user-management/reset-password";
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
    companyStateId,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();
  const tabs = ["Companies"];

  const [companies, setCompanies] = useState<any[]>();
  const [users, setUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  // Fetch data functions

  const getCompaniesUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/companies?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "companies");
  };

  const getCompanies = async () => {
    const response = await axiosInstance.get(
      `/companies?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setCompanies(response.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getUsersUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/user-company/company/${companyStateId}?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data, "company_users");
  };

  const getUsers = async () => {
    const response = await axiosInstance.get(
      `/user-company/company/${companyStateId}?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setUsers(response.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
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

  // Delete functions
  const deleteCompanies = async () => {
    await axiosInstance.delete(`/companies/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this company",
      status: true,
    });
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

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createCompany":
        return activeRowId ? "Edit Company" : "Create Company";
      case "createCompanyLogo":
        return "Edit Logo";
      case "assignOwner":
        return "Assign Owner";
      case "createUser":
        return activeRowId ? "Edit Users" : "Create Users";
      case "createBulkUser":
        return "Upload Bulk User";
      case "resetPassword":
        return "Reset Password";
    }
    switch (centralStateDelete) {
      case "deleteCompany":
        return "Delete Company";

      case "deleteUser":
        return "De-activate User";
      case "activateUser":
        return "Re-activate User";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createCompany":
        return activeRowId
          ? "You can edit company details here."
          : "You can create and manage company here.";
      case "createCompanyLogo":
        return "Edit your company Logo";
      case "createBulkCompany":
        return "Import CSV/Excel file";
      case "createUser":
        return activeRowId
          ? "You can edit user details here."
          : "You can manage users here.";
      case "assignOwner":
        return "";
      case "resetPassword":
        return "Change the password for this user";
      case "createBulkUser":
        return "Import CSV/Excel file";
      case "viewPermissions":
        return "All permissions available for this role";
    }
    switch (centralStateDelete) {
      case "activateUser":
        return "Are you sure you want to Re-activate this user";
      case "deleteUser":
        return "Are you sure you want to de-activate this user";
      case "deleteCompany":
        return "Are you sure you want to delete this company";
    }
    return "Zijela";
  };

  console.log(users);
  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createCompany: (
      <DynamicCreateForm
        inputs={[
          { name: "name", label: "Company Name", type: "text" },
          { name: "code", label: "Company Code", type: "text" },
          { name: "website", label: "Website", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phoneNumber", label: "Phone Number", type: "text" },
          { name: "email", label: "Email address", type: "text" },
        ]}
        selects={[]}
        title="Company"
        apiEndpoint="/companies"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/companies/${id}`).then((res) => res.data)
        }
      />
    ),
    createCompanyLogo: (
      <AvatarUploader
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    assignOwner: (
      <DynamicCreateForm
        inputs={[]}
        selects={[
          {
            name: "ownerId",
            label: "Company Owner",
            placeholder: "Assign Company to a Owner",
            options: users?.map((user: any) => ({
              value: user.id,
              label: `${user?.user.firstName} ${user?.user.lastName}`,
            })),
          },
        ]}
        title="Company"
        apiEndpoint={`/companies/${companyStateId}/owner`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/companies/${id}`).then((res) => res.data)
        }
      />
    ),
    createBulkCompany: (
      <CreateBulk
        type="Companies"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
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
        apiEndpoint={`${activeRowId ? "/users" : "/users/create-company-user"}`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
        }
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
    createBulkUser: (
      <CreateBulk
        type="Users"
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
        // bulkExample={usersBulkExample?.bulkFile}
      />
    ),
  };

  const tabPermissions: { [key: string]: string[] } = {
    Companies: ["read_companies"],
    // Users: ["read_user-company:user/userId"],
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
    if (selectedTab === "Companies") {
      getCompanies();
      getUsers();
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
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      if (selectedTab === "Companies") {
        getCompaniesUnPaginated();
      } else {
        getUsersUnPaginated();
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
      title="Company Management"
      detail="Manage all companies and users here"
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={
        centralStateDelete === "deleteCompany" ? deleteCompanies : deleteUser
      }
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard
        requiredPermissions={[
          "read_companies",
          "read_user-company:user/userId",
        ]}
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
        requiredPermissions={[
          "read_companies",
          "read_user-company:user/userId",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "Companies" && (
            <TableComponent
              data={companies}
              type="companies"
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
          {selectedTab === "Users" && (
            <TableComponent
              data={users}
              type="users"
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

export default withPermissions(VendorManagement, ["companies"]);
