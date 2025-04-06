"use client";

import { useDataPermission } from "@/context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Higher-Order Component
const withPermissions = (
  WrappedComponent: React.ComponentType,
  requiredPermissions: string[]
) => {
  return function PermissionWrapper(props: any) {
    const router = useRouter();
    const pathName = usePathname();

    const { userPermissions, companyPermissions } = useDataPermission(); // Move the hook here

    // Helper function to check for permission matches
    const hasPermissionForRoute = (permissions: string[]) => {
      return permissions?.some((permission) =>
        [...userPermissions, ...companyPermissions]?.some((userPermission) =>
          userPermission?.permissionString.includes(permission)
        )
      );
    };

    useEffect(() => {
      if (!hasPermissionForRoute(requiredPermissions)) {
        // router.back();
        router.push(pathName && pathName);
        router.push(`/dashboard`);
      }
    }, [router, pathName, userPermissions, requiredPermissions]);

    if (!hasPermissionForRoute(requiredPermissions)) {
      return null; // Optionally show loading spinner or fallback content here
    }

    return <WrappedComponent {...props} />;
  };
};

export default withPermissions;
