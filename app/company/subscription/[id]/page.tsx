"use client";

import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import { JSX, useEffect, useState } from "react";

import { useDataPermission } from "@/context";

import PermissionGuard from "@/components/auth/permission-protected-components";
import ButtonComponent from "@/components/button-component";
import DynamicCreateForm from "@/components/dynamic-create-form";
import FacilityDetails from "@/components/facility-management/view-facility";
import createAxiosInstance from "@/utils/api";
import { useParams, useRouter } from "next/navigation";

function Funding() {
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
  } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [payment, setPayment] = useState<any>();


  const approveFunding = async () => {
    await axiosInstance.patch(`/payments/manual-fund/${id}/verify`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved thiis funding",
      status: true,
    });
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
        apiEndpoint={`/payments/manual-fund/${id}/reject`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/payments/${id}`).then((res) => res.data.data)
        }
      />
    ),
  };

  const getAPayment = async () => {
    const response = await axiosInstance.get(`/payments/${id}`);
    setPayment(response.data.data);
  };

  useEffect(() => {
    if (id) {
      getAPayment();
    }
  }, [id, centralState, centralStateDelete]);

  return (
    <DashboardLayout
      title={`Pending Funds`}
      detail="Pending Funds Details"
      dynamic
      onclick={() => router.back()}
      getTitle={() => getTitle()}
      getDetail={() => getDetail()}
      componentMap={componentMap}
      takeAction={
        centralStateDelete === "approveFunding" ? approveFunding : null
      }
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={payment} title="Payments" />

        {payment?.type === "MANUAL_FUNDING" && (
          <div className="flex items-center bg-white p-6  rounded-lg mt-6">
            <div className="ml-auto flex gap-4">
              <PermissionGuard
                requiredPermissions={["update_payments:manual-fund/id/verify"]}
              >
                <ButtonComponent
                  text="Verify"
                  className="w-24 text-white"
                  onClick={() => setCentralStateDelete("approveFunding")}
                />
              </PermissionGuard>
              <PermissionGuard
                requiredPermissions={["update_payments:manual-fund/id/reject"]}
              >
                <ButtonComponent
                  text="Reject"
                  className="w-24 bg-gray-500 text-white"
                  onClick={() => setCentralState("rejectFunding")}
                />
              </PermissionGuard>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(Funding, ["companies"]);
