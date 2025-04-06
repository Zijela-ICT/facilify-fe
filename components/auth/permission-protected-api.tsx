"use client";

import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";

// Custom hook that encapsulates permission checking and a dynamic GET API call
const PermissionGuardApi = () => {
  const { userPermissions, companyPermissions } = useDataPermission();
 
  const axiosInstance = createAxiosInstance();

  // Helper function to check permissions similar to your PermissionGuard component
  const hasPermissionForRoute = (requiredPermissions = []) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.some((permission) =>
      [...userPermissions, ...companyPermissions]?.some(
        (userPermission) => userPermission?.permissionString === permission
      )
    );
  };

  // Dynamic GET API call for any endpoint
  const callGuardedEndpoint = async ({
    endpoint,
    requiredPermissions = [],
  
  }) => {
    if (!hasPermissionForRoute(requiredPermissions)) {
    //   throw new Error(
    //     "User does not have the required permissions to access this endpoint."
    //   );
    return
    }

    const response = await axiosInstance.get(endpoint);

    return response.data;
  };

  return { callGuardedEndpoint };
};

export default PermissionGuardApi;
