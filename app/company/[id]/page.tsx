"use client";

import withPermissions from "@/components/auth/permission-protected-routes";
import DashboardLayout from "@/components/dashboard-layout-component";
import { useEffect, useState } from "react";

import { useDataPermission } from "@/context";

import FacilityDetails from "@/components/facility-management/view-facility";
import createAxiosInstance from "@/utils/api";
import { useParams, useRouter } from "next/navigation";

function WorkRequests() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [workRequest, setWorkRequest] = useState<any>();

  const getAWorkRequest = async () => {
    const response = await axiosInstance.get(`/companies/${id}`);
    setWorkRequest(response.data);
  };

  useEffect(() => {
    if (id) {
      getAWorkRequest();
    }
  }, [id]);

  return (
    <DashboardLayout
      title={`Company`}
      detail="Company details"
      dynamic
      onclick={() => router.back()}
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={workRequest} title="Work Order" />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(WorkRequests, ["companies"]);
