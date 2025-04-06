"use client";

import { useDataPermission } from "@/context";
import React from "react";

// PermissionGuard Component
interface PermissionGuardProps {
  requiredPermissions?: string[]; // Permissions required for access
  fallback?: React.ReactNode; // Optional fallback content
  children: React.ReactNode; // Protected content
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermissions,
  fallback = null,
  children,
}) => {
  const { userPermissions, companyPermissions } = useDataPermission(); // Use the hook directly inside the component

  // Helper function to check for exact permission matches
  const hasPermissionForRoute = (permissions: string[]) => {
    return permissions?.some((permission) =>
      [...userPermissions, ...companyPermissions]?.some(
        (userPermission) => userPermission?.permissionString === permission
      )
    );
  };

  // If no requiredPermissions are passed, render children by default
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = hasPermissionForRoute(requiredPermissions);

  if (!hasAccess) {
    return <>{fallback}</>; // Render fallback content if no access
  }

  return <>{children}</>; // Render protected content if access is granted
};

export default PermissionGuard;
