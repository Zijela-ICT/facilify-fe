import { useDataPermission } from "@/context";
import { formatRoleName } from "@/utils/formatRoleNames";
import { multiSelectStyle } from "@/utils/ojects";
import {
  FacilityMIcon,
  HomeIcon,
  LogoutIcon,
  PPMIcon,
  TransactionMIcon,
  UserMIcon,
  VendorIcon,
  WorkOrderIcon,
  WorkRequestIcon,
} from "@/utils/svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import PermissionGuard from "./auth/permission-protected-components";
import ButtonComponent from "./button-component";
import ModalCompoenent from "./modal-component";

const Logo = "/assets/logo.png";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    userRoles,
    userCompanies,
    userPermissions,
    companyStateId,
    setCompanyStateId,
  } = useDataPermission();

  const [centralState, setCentralState] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to track which nav items (with children) are expanded
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userPermissions");
    localStorage.removeItem("userRoles");
    localStorage.setItem("selectedCompany", undefined);
    router.push("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Toggle the accordion for a nav item with children
  const toggleAccordion = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if the user has any of the permissions for a route
  const hasPermissionForRoute = (permissions: string[]) => {
    return permissions.some((permission) =>
      userPermissions.some((userPermission) =>
        userPermission.permissionString.includes(permission)
      )
    );
  };

  const hasTenantRole = userRoles.some(
    (role: Role) => role.name === "TENANT_ROLE"
  );

  const [formData, setFormData] = useState({
    company: "",
  });

  const handleSelectChange =
    (fieldName: string, isMulti = false) =>
    (selected: any) => {
      const value = isMulti
        ? selected.map((option: any) => option.value)
        : selected?.value || "";

      setCompanyStateId(selected?.value);

      setFormData((prevFormData) => {
        const updatedData = { ...prevFormData, [fieldName]: value };
        localStorage.setItem("selectedCompany", updatedData.company); // Store in localStorage
        return updatedData;
      });
    };

  const companyOptions = userCompanies?.map((block: any) => ({
    value: block?.companyId,
    label: block?.companyName,
  }));

  const selectedCompany = userCompanies.find(
    (comp) =>
      Number(comp.companyId) === Number(formData.company || companyStateId)
  );

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      permissions: [""],
      icon: <HomeIcon />,
    },
    {
      href: "/company",
      label: "Company",
      permissions: ["companies"],
      icon: <HomeIcon />,
      children: [
        {
          href: "/company/subscription",
          label: "Subscriptions",
          permissions: ["companies"],
          icon: <TransactionMIcon />,
        },
      ],
    },
    {
      href: "/facility-management",
      label: "Facility Management",
      permissions: ["units", "blocks", "facilities"],
      icon: <FacilityMIcon />,
    },
    {
      href: "/work-requests",
      label: "Work Request",
      permissions: ["work-requests"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/work-orders",
      label: "Work Order",
      permissions: ["work-orders"],
      icon: <WorkOrderIcon />,
    },
    {
      href: "/power",
      label: "Power",
      permissions: ["power-charges"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/bills",
      label: "Bills",
      permissions: ["units"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/approvers",
      label: "Approvers",
      permissions: ["users"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/ppm",
      label: "PPM",
      permissions: ["ppms"],
      icon: <PPMIcon />,
    },
    {
      href: "/audit",
      label: "Audit Logs",
      permissions: ["audit"],
      icon: <WorkRequestIcon />,
    },
    // {
    //   href: "/utility",
    //   label: "Utilities",
    //   permissions: ["tv", "internet", "airtime", "electricity"],
    //   icon: <WorkRequestIcon />,
    // },
    {
      href: "/access-control",
      label: "Access Control",
      permissions: ["access-control"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/vendor-management",
      label: "Vendor & Tech Management",
      permissions: ["vendors"],
      icon: <VendorIcon />,
    },
    {
      href: "/user-management",
      label: "User Management",
      permissions: ["roles", "users", "permissions", "auth"],
      icon: <UserMIcon />,
    },
    {
      href: "/transaction",
      label: "Transactions",
      permissions: ["transactions", "users"],
      icon: <TransactionMIcon />,
      children: [
        {
          href: "/transaction/approve-funding",
          label: "Approve funding",
          permissions: ["payments", "users"],
          icon: <TransactionMIcon />,
        },
      ],
    },
  ];

  useEffect(() => {
    if (userCompanies.length > 0) {
      localStorage.setItem("selectedCompany", userCompanies[0]?.companyId);
      setCompanyStateId(companyStateId || userCompanies[0]?.companyId);
      setFormData({
        ...formData,
        company: companyStateId || userCompanies[0]?.companyId,
      });
    }
  }, [userCompanies]);

  return (
    <>
      <ModalCompoenent
        title={"Profile view"}
        detail={""}
        modalState={centralState}
        setModalState={() => setCentralState("")}
        width="max-w-sm"
        systemColor
      >
        <div className="flex flex-col items-center justify-center py-8 px-8">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={"#"}
              width={200}
              height={200}
              className="rounded-full"
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-[#A8353A] font-semibold text-6xl"
              style={{
                width: 200,
                height: 200,
                backgroundColor: "#fff",
              }}
            >
              {`${user?.firstName?.[0] || ""}${
                user?.lastName?.[0] || ""
              }`.toUpperCase()}
            </div>
          )}

          <h2 className="text-xl font-bold text-white mt-2">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-white text-base">{user?.email}</p>

          {userRoles?.map((role) => (
            <div
              key={role.name}
              className="text-xs mt-2 bg-white text-[#A8353A] px-3 py-1 rounded-full shadow-sm"
            >
              <p>{formatRoleName(role.name)}</p>
            </div>
          ))}
          <ButtonComponent
            text="Go to Profile"
            className="bg-white mt-6"
            onClick={() => {
              router.push(`/user-profile`);
              setCentralState("");
            }}
          />
        </div>
      </ModalCompoenent>

      <ul
        className={`px-4 py-4 space-y-4 text-xs font-medium text-gray-500 bg-white transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-full lg:w-1/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href={`/dashboard`} className="px-4">
            <Image
              src={selectedCompany?.companyLogo}
              alt="logo"
              width={isCollapsed ? 50 : 100}
              height={isCollapsed ? 35 : 70}
            />
          </Link>
          {/* Desktop collapse toggle */}
          <button onClick={toggleSidebar} className="hidden lg:block">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
          {/* Mobile hamburger toggle */}
          <button onClick={toggleMenu} className="md:hidden text-gray-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Full profile card visible only when not collapsed */}
        {!isCollapsed && (
          <>
            <div
              onClick={() => setCentralState("viewProfile")}
              className="flex cursor-pointer hover:animate-tilt flex-col items-center justify-center p-4 bg-[#A8353A] rounded-lg shadow-lg text-white max-w-sm mx-auto "
            >
              <p className="text-base font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="text-xs mt-2 bg-white text-[#A8353A] px-3 py-1 rounded-full shadow-sm">
                {formatRoleName(userRoles[0]?.name)}
              </div>
            </div>
            {/* Dropdown for selecting an option */}
            <div className="w-full mt-3 p-2 bg-[#8C2F33] rounded-lg shadow-md">
              <Select
                options={companyOptions}
                value={companyOptions?.find(
                  (option) => option.value === formData.company
                )}
                onChange={handleSelectChange("company")}
                styles={multiSelectStyle}
                placeholder="Select Company"
              />
            </div>
          </>
        )}

        <div
          className={`md:block ${isMenuOpen ? "block" : "hidden"} space-y-3`}
        >
          {navItems.map((item) => {
            // Optionally skip work-orders for tenant roles
            // if (item.href === "/work-orders" && hasTenantRole) return null;
            if (
              hasTenantRole &&
              [
                "/work-orders",
                "/user-management",
                "/approvers",
                "/access-control",
              ].includes(item.href)
            ) {
              return null;
            }

            return (
              hasPermissionForRoute(item.permissions) && (
                <li
                  key={item.href}
                  className={`w-full ${isCollapsed ? "px-0" : "px-4"}`}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center w-full ${
                      isCollapsed ? "justify-center px-0" : "justify-start px-4"
                    } py-2 rounded-md font-thin ${
                      isActive(item.href) ? "bg-[#FBC2B61A] text-[#A8353A]" : ""
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span className="flex items-center justify-center w-6 h-6">
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="ml-2 flex-grow">{item.label}</span>
                        {item.children && (
                          <PermissionGuard
                            requiredPermissions={["update_users:id"]}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleAccordion(item.href);
                              }}
                              className="p-2"
                            >
                              <svg
                                className="w-4 h-4 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{
                                  transform: expandedItems[item.href]
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </PermissionGuard>
                        )}
                      </>
                    )}
                  </Link>
                  {item.children &&
                    expandedItems[item.href] &&
                    !isCollapsed && (
                      <ul className="ml-4 space-y-2">
                        {item.children.map(
                          (child) =>
                            hasPermissionForRoute(child.permissions) && (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`inline-flex items-center w-full ${
                                    isCollapsed
                                      ? "justify-center px-0"
                                      : "justify-start pl-8 pr-4"
                                  } py-2 rounded-md font-thin ${
                                    isActive(child.href)
                                      ? "bg-[#FBC2B61A] text-[#A8353A]"
                                      : ""
                                  }`}
                                  aria-current={
                                    isActive(child.href) ? "page" : undefined
                                  }
                                >
                                  <span className="flex items-center justify-center w-6 h-6">
                                    {child.icon}
                                  </span>
                                  {!isCollapsed && (
                                    <span className="ml-2">{child.label}</span>
                                  )}
                                </Link>
                              </li>
                            )
                        )}
                      </ul>
                    )}
                </li>
              )
            );
          })}

          <li className={`w-full ${isCollapsed ? "px-0" : "px-4"} pt-4`}>
            <button
              onClick={logout}
              className={`inline-flex items-center justify-between w-full ${
                isCollapsed ? "justify-center" : "pl-4 pr-20"
              } py-3 rounded-lg text-white bg-[#A8353A]`}
            >
              <LogoutIcon />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </li>
        </div>
      </ul>
    </>
  );
}
