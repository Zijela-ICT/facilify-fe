"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import { JSX, useEffect, useState } from "react";

import PermissionGuard from "@/components/auth/permission-protected-components";
import withPermissions from "@/components/auth/permission-protected-routes";
import DynamicCreateForm from "@/components/dynamic-create-form";
import FacilityDetails from "@/components/facility-management/view-facility";
import AcceptQuotation from "@/components/work-order/acceptQuotation";
import CreateWorkOrder from "@/components/work-order/create-work-order";
import UpdateWorkOrder from "@/components/work-order/update-work-order";
import { useDataPermission } from "@/context";

import ButtonComponent from "@/components/button-component";
import CreateBulk from "@/components/user-management/create-bulk";
import RequestQuotationApproval from "@/components/work-order/request-quotation-approval";
import CommentWorkRequestOrder from "@/components/work-request/comment-request-order";
import Rate from "@/components/work-request/rate";
import createAxiosInstance from "@/utils/api";
import exportToCSV from "@/utils/exportCSV";

interface Props {
  nowrap: boolean;
}

function WorkOrders({ nowrap }: Props) {
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
  const tabs = ["All Work Order", "My Work Order"];

  const [assignedworkOrders, setAssignedWorkOrders] = useState<any[]>();
  const [workOrders, setWorkOrders] = useState<any[]>();
  const [workOrder, setWorkOrder] = useState<any>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [vendors, setVendors] = useState<Vendor[]>();
  const [technician, setTechnicians] = useState<Technician[]>();

  // Fetch data functions
  const getWorkOrdersUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/work-orders/work-order/all?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "work_orders");
  };

  const getWorkOrders = async () => {
    const response = await axiosInstance.get(
      `/work-orders/work-order/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setWorkOrders(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAssignedWorkOrdersUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/work-orders/my-work-orders/all?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(
      response.data.data,
      `${user.firstName}_${user.lastName}_work_orders`
    );
  };

  const getAssignedWorkOrders = async () => {
    const response = await axiosInstance.get(
      `/work-orders/my-work-orders/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setAssignedWorkOrders(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getVendors = async () => {
    const response = await axiosInstance.get("/vendors");
    setVendors(response.data.data);
  };

  const getTechnicians = async () => {
    const response = await axiosInstance.get("/technicians");
    setTechnicians(response.data.data);
  };

  const getAWorkOrder = async () => {
    const response = await axiosInstance.get(`/work-orders/${activeRowId}`);
    setWorkOrder(response.data.data);
  };

  // Delete functions
  const deleteWorkOrders = async () => {
    await axiosInstance.delete(`/work-orders/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this work order",
      status: true,
    });
  };

  // Delete functions
  const closeWorkOrder = async () => {
    await axiosInstance.patch(`/work-orders/${activeRowId}/status/close`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully closed work order",
      status: true,
    });
  };

  const approveQuotation = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/approve-quotation`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved quotation",
      status: true,
    });
  };

  const approveQuotationTenant = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/approve-quotation/tenant`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved quotation",
      status: true,
    });
  };

  const rejectQuotation = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/reject-quotation`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully rejected quotation",
      status: true,
    });
  };

  const rejectQuotationTenant = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/reject-quotation/tenant`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully rejected quotation",
      status: true,
    });
  };

  const acceptWorkOrder = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/accept/work-order-by-procurement`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully accepted work order",
      status: true,
    });
  };

  const raisePaymentOrder = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/raise-payment-order`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully raised payment order",
      status: true,
    });
  };

  const requestQuotationSelection = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/request-quotation-selection`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully requested quotation to be selected",
      status: true,
    });
  };

  const apportionServiceCharge = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/apportion/service-charge`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully apportion cost",
      status: true,
    });
  };

  const approveApportionServiceCharge = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/apportion/service-charge/approve`
    );
    setCentralState("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved apportion cost",
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
      case "createWorkOrder":
      case "createWorkOrderforUser":
        return activeRowId ? "Edit Work Order" : "Create Work Order";
      case "createBulkWorkOrder":
        return "Upload Bulk Work Order";
      case "viewWorkOrder":
        return "Work Order Details";
      case "viewServiceCharge":
        return "Apportionment Details";
      case "commentWorkOrder":
        return "Add comment";
      case "attatchmentWorkOrder":
        return "Add attatchment";
      case "quotationsWorkOrder":
        return "Add quotation";
      case "updateStatusWorkOrder":
        return "Update Status";
      case "assignTechnicianWorkOrder":
        return "Assign Technician";
      case "acceptQuotation":
        return "Accept Quotation";
      case "closeWorkOrder":
        return "Close Work Order ";
      case "requestquotationsapproval":
        return "Request quotation approval";
      case "attachFile":
        return "Upload File";
      case "rateWorkOrder":
        return "Rate Work Order";
    }
    switch (centralStateDelete) {
      case "deactivateWorkOrder":
        return "De-activate Work Order ";
      case "activateWorkOrder":
        return "Re-activate Work Order";
      case "deactivateWorkOrder":
        return "De-activate Work Order ";
      case "activateWorkOrder":
        return "Re-activate Work Order";
      case "apportionServiceCharge":
        return "Apportion Cost";
      case "approveQuotation":
      case "approveQuotationTenant":
        return "Approve Quotation";
      case "rejectQuotation":
      case "rejectQuotationTenant":
        return "Reject Quotation";
      case "acceptWorkOrder":
        return "Accept Work Order";
      case "requestquotationsselection":
        return "Request quotation selection";
      case "raisePaymentOrder":
        return "Raise Purchase Order";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkOrder":
      case "createWorkOrderforUser":
        return activeRowId
          ? "You can edit work order details here."
          : "You can create and manage work order here.";
      case "createBulkWorkOrder":
        return "Import CSV/Excel file";
      case "viewWorkOrder":
        return "";
      case "viewServiceCharge":
        return "";
      case "commentWorkOrder":
        return "";
      case "attatchmentWorkOrder":
        return "";
      case "quotationsWorkOrder":
        return "";
      case "updateStatusWorkOrder":
        return "";
      case "assignTechnicianWorkOrder":
        return "";
      case "acceptQuotation":
        return "";
      case "requestquotationsapproval":
        return "";
      case "closeWorkOrder":
        return "";
      case "attachFile":
        return "Upload a file here";
      case "rateWorkOrder":
        return "Rate Work Order here";
    }
    switch (centralStateDelete) {
      case "activateWorkOrder":
        return "Are you sure you want to Re-activate this work order";
      case "deactivateWorkOrder":
        return "Are you sure you want to de-activate this work order";
      case "activateWorkOrder":
        return "Are you sure you want to Re-activate this work order";
      case "deactivateWorkOrder":
        return "Are you sure you want to de-activate this work order";
      case "apportionServiceCharge":
        return "You want to apportion cost for this work order";
      case "requestquotationsselection":
        return "You want to request this quotation for selection";
      case "approveQuotation":
      case "approveQuotationTenant":
        return "You want to approve this quuotation";
      case "rejectQuotation":
      case "rejectQuotationTenant":
        return "You want to reject this quuotation";
      case "acceptWorkOrder":
        return "Are you sure you want to accept this work order";
      case "raisePaymentOrder":
        return "Are you sure you want to raise purchase order";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createWorkOrder: (
      <CreateWorkOrder
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkWorkOrder: (
      <CreateBulk
        type="Work Orders"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    commentWorkOrder: (
      <CommentWorkRequestOrder
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        type="orders"
      />
    ),
    attachFile: (
      <DynamicCreateForm
        inputs={[
          { name: "title", label: "Title", type: "text" },
          { name: "file", label: "File", type: "file" },
        ]}
        selects={[]}
        title="Attach File"
        apiEndpoint={`/work-orders/${activeRowId}/upload-attachment`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    attatchmentWorkOrder: (
      <DynamicCreateForm
        inputs={[
          { name: "title", label: "Title", type: "text" },
          { name: "file", label: "File", type: "file" },
        ]}
        selects={[]}
        title="Add Attachment"
        apiEndpoint={`/work-orders/${activeRowId}/upload-attachment`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    quotationsWorkOrder: (
      <DynamicCreateForm
        selects={[
          {
            name: "entity",
            label: "Select",
            placeholder: "Assign ",
            options: [
              { value: "Technician", label: "Technician" },
              { value: "Vendor", label: "Vendor" },
            ],
          },
          {
            name: "id",
            label: "Vendor",
            placeholder: "Select Vendor",
            options: vendors?.map((unit: Vendor) => ({
              value: Number(unit?.id),
              label: unit.vendorName,
            })),
          },
          {
            name: "id",
            label: "Technician",
            placeholder: "Select Technician",
            options: technician?.map((tech: Technician) => ({
              value: Number(tech?.id),
              label: `${tech.firstName} ${tech.surname}`,
            })),
          },
        ]}
        inputs={[
          { name: "title", label: "Title", type: "text" },
          { name: "file", label: "Quotation", type: "file" },
          { name: "invoice", label: "Invoice", type: "file" },
          { name: "amount", label: "Amount", type: "number" },
          { name: "dueDate", label: "Due Date", type: "date" },
        ]}
        title="Add Quotation"
        apiEndpoint={`/work-orders/${activeRowId}/upload-quotation`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    updateStatusWorkOrder: (
      <UpdateWorkOrder
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    closeWorkOrder: (
      <DynamicCreateForm
        selects={[]}
        inputs={[
          { name: "comment", label: "Comment", type: "textarea" },
          { name: "file", label: "Attachment", type: "file" },
        ]}
        title="Close Work Order"
        apiEndpoint={`/work-orders/${activeRowId}/status/close`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    assignTechnicianWorkOrder: (
      <DynamicCreateForm
        selects={[
          {
            name: "entity",
            label: "Select",
            placeholder: "Assign ",
            options: [
              { value: "Technician", label: "Technician" },
              { value: "Vendor", label: "Vendor" },
            ],
          },
          {
            name: "id",
            label: "Vendor",
            placeholder: "Select Vendor",
            options: vendors?.map((unit: Vendor) => ({
              value: Number(unit?.id),
              label: unit.vendorName,
            })),
          },
          {
            name: "id",
            label: "Technician",
            placeholder: "Select Technician",
            options: technician?.map((tech: Technician) => ({
              value: Number(tech?.id),
              label: `${tech.firstName} ${tech.surname}`,
            })),
          },
        ]}
        inputs={[]}
        title="Assign Technician"
        apiEndpoint={`/work-orders/${activeRowId}/assign`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    requestquotationsapproval: (
      <RequestQuotationApproval
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    acceptQuotation: (
      <AcceptQuotation
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),

    viewWorkOrder: (
      <div className="p-4">
        <FacilityDetails facility={workOrder} title="Work Order" />
      </div>
    ),
    viewServiceCharge: (
      <div className="p-4">
        <TableComponent
          data={workOrder?.apportionmentDetails}
          type="apportionmentDetails"
          setModalState={setCentralState}
          setModalStateDelete={setCentralStateDelete}
          toggleActions={toggleActions}
          activeRowId={activeRowId}
          setActiveRowId={setActiveRowId}
          deleteAction={setCentralStateDelete}
          noSearch
        />
        <ButtonComponent
          text={"Approve"}
          onClick={() => approveApportionServiceCharge()}
          className="text-white my-8"
        />
      </div>
    ),
    rateWorkOrder: (
      <Rate
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
  };

  useEffect(() => {
    if (
      centralState === "viewWorkOrder" ||
      centralState === "viewServiceCharge"
    ) {
      getAWorkOrder();
    }
    if (centralState === "quotationsWorkOrder") {
      getVendors();
      getTechnicians();
    }
    if (centralState === "assignTechnicianWorkOrder") {
      getTechnicians();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "My Work Order": [
      "read_work-orders:my-work-orders/all",
      "read_work-orders:my-work-orders/vendor/all",
      "read_work-orders:my-work-orders/technician/all",
    ],
    "All Work Order": ["read_work-orders:work-order/all"],
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
    if (selectedTab === "All Work Order") {
      const fetchData = async () => {
        await Promise.all([getWorkOrders()]);
      };
      fetchData();
    } else {
      getAssignedWorkOrders();
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
      if (selectedTab === "All Work Order") {
        getWorkOrdersUnPaginated();
      } else {
        getAssignedWorkOrdersUnPaginated();
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
      title="Work Order"
      detail="Submit work order here and view created work orders"
      nowrap={nowrap}
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={
        centralStateDelete === "deactivateWorkOrder" ||
        centralStateDelete === "activateWorkOrder"
          ? deleteWorkOrders
          : centralStateDelete === "apportionServiceCharge"
          ? apportionServiceCharge
          : centralStateDelete === "closeWorkOrder"
          ? closeWorkOrder
          : centralStateDelete === "requestquotationsselection"
          ? requestQuotationSelection
          : centralStateDelete === "approveQuotation"
          ? approveQuotation
          : centralStateDelete === "approveQuotationTenant"
          ? approveQuotationTenant
          : centralStateDelete === "rejectQuotationTenant"
          ? rejectQuotationTenant
          : centralStateDelete === "rejectQuotation"
          ? rejectQuotation
          : centralStateDelete === "acceptWorkOrder"
          ? acceptWorkOrder
          : centralStateDelete === "raisePaymentOrder"
          ? raisePaymentOrder
          : deleteWorkOrders
      }
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard
        requiredPermissions={[
          "read_work-orders:my-work-orders/all",
          "read_work-orders:work-order/all",
        ]}
      >
        <div
          className={`relative ${nowrap && "hidden"} bg-white rounded-2xl p-4`}
        >
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
          "read_work-orders:my-work-orders/all",
          "read_work-orders:work-order/all",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "My Work Order" && (
            <TableComponent
              data={assignedworkOrders}
              type="workorders"
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
          {selectedTab === "All Work Order" && (
            <TableComponent
              data={workOrders}
              type="workorders"
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

export default withPermissions(WorkOrders, ["work-orders"]);
