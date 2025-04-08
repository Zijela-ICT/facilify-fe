import { TrashIcon, TrashIconGray, TripleDotsIcon } from "@/utils/svg";
import { useRouter } from "next/navigation";
import ActionDropdownComponent from "./action-dropdown-component";
import PermissionGuard from "./auth/permission-protected-components";
import ButtonComponent, { DropdownButtonComponent } from "./button-component";

interface UserActionsProps {
  type: string;
  row: any;
  setModalState: (state: string) => void;
  setModalStateDelete?: (state: string) => void;
  activeRowId?: any;
  toggleActions: any;
  contextMenuedActions?: any;
  contextMenued?: any;
}

const Actions: React.FC<UserActionsProps> = ({
  type,
  row,
  setModalState,
  setModalStateDelete,
  activeRowId,
  toggleActions,
  contextMenued,
  contextMenuedActions,
}) => {
  const router = useRouter();
  return (
    <>
      {type === "users" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "delete_users:id",
                "update_users:id",
                "update_users:reset-password/admin",
                "update_users:id/beneficiaries",
                "delete_users:id/beneficiaries",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="Edit User"
                      onClick={() => setModalState("createUser")}
                      permissions={["update_users:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Reset Password"
                      onClick={() => setModalState("resetPassword")}
                      permissions={["update_users:reset-password/admin"]}
                    />
                  </li>
                  <li>
                    {row.status === "Active" ? (
                      <DropdownButtonComponent
                        text="De-activate User"
                        onClick={() => setModalStateDelete("deleteUser")}
                        permissions={["delete_users:id"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Re-activate User"
                        onClick={() => setModalStateDelete("activateUser")}
                        permissions={["delete_users:id"]}
                      />
                    )}
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "approvers" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "delete_users:id",
                "update_users:id",
                "update_users:reset-password/admin",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="Edit Approval Limit"
                      onClick={() => setModalState("editApprover")}
                      permissions={["update_users:id"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "roles" ? (
        <>
          <div className="flex items-center space-x-2 w-full md:w-4/5 ">
            <ButtonComponent
              text="View Users"
              onClick={() => router.push(`/user-management/${row?.id}`)}
              permissions={["read_roles:id"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
            />

            <ButtonComponent
              text="View Permissions"
              onClick={() => {
                toggleActions(row.id);
                setModalState("viewPermissions");
              }}
              permissions={["read_permissions"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
            />

            <ButtonComponent
              text="Edit Role"
              onClick={() => {
                toggleActions(row.id);
                setModalState("createRole");
              }}
              permissions={["update_roles:id"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
            />

            <PermissionGuard requiredPermissions={["delete_roles:id"]}>
              {row.users > 0 ? (
                <div>
                  <TrashIconGray />
                </div>
              ) : (
                <div
                  onClick={() => {
                    toggleActions(row.id);
                    setModalStateDelete("deleteRole");
                  }}
                >
                  <TrashIcon />
                </div>
              )}
            </PermissionGuard>
          </div>
        </>
      ) : type === "facilities" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "delete_facilities:id",
                "update_facilities:id",
                "update_facilities:id/assign",
                "read_facilities:id",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() =>
                        // setModalState("viewFacility")
                        router.push(
                          `/facility-management/entity/facility/${row.id}`
                        )
                      }
                      permissions={["read_facilities:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createFacility")}
                      permissions={["update_facilities:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Assign Facility Officers"
                      onClick={() => setModalState("assignUserToFacility")}
                      permissions={["update_facilities:id/assign"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Fund Wallet"
                      onClick={() => setModalState("fundWallet")}
                      permissions={["create_payments:fund"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Payout"
                      onClick={() => setModalState("payoutFacilities")}
                      permissions={[
                        "create_payments:payout/bank-transfer/walledId",
                      ]}
                    />
                  </li>
                  <li>
                    {row.isDeactivated === false ? (
                      <DropdownButtonComponent
                        text="Delete"
                        onClick={() => setModalStateDelete("deleteFacility")}
                        permissions={["delete_facilities:id"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Delete"
                        onClick={() => setModalStateDelete("deleteFacility")}
                        permissions={["delete_facilities:id"]}
                      />
                    )}

                    {row.hasPaymentKey === false ? (
                      <DropdownButtonComponent
                        text="Create APi key"
                        onClick={() => setModalState("createApiKeyFacility")}
                        permissions={["create_facilities:id/set-api-key"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Update Api key"
                        onClick={() => setModalState("updateApiKeyFacility")}
                        permissions={["create_facilities:id/set-api-key"]}
                      />
                    )}
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "blocks" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "delete_blocks:id",
                "update_blocks:id",
                "read_blocks:id",
                "update_blocks:id/assign",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() =>
                        // setModalState("viewBlock")
                        router.push(
                          `/facility-management/entity/block/${row.id}`
                        )
                      }
                      permissions={["read_blocks:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createBlock")}
                      permissions={["update_blocks:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Assign Block Officers"
                      onClick={() => setModalState("assignUserToBlock")}
                      permissions={["update_blocks:id/assign"]}
                    />
                  </li>
                  <li>
                    {row.isDeactivated === false ? (
                      <DropdownButtonComponent
                        text="Delete"
                        onClick={() => setModalStateDelete("deleteBlock")}
                        permissions={["delete_blocks:id"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Delete"
                        onClick={() => setModalStateDelete("deleteBlock")}
                        permissions={["delete_blocks:id"]}
                      />
                    )}
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "units" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "delete_units:id",
                "update_units:id",
                "read_units:id",
                "update_units:id/assign/officers",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() =>
                        router.push(
                          `/facility-management/entity/unit/${row.id}`
                        )
                      }
                      permissions={["read_units:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createUnit")}
                      permissions={["update_units:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Assign Unit Officers"
                      onClick={() => setModalState("assignUserToUnit")}
                      permissions={["update_units:id/assign/officers"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Fund Wallet"
                      onClick={() => setModalState("fundWallet")}
                      permissions={["create_payments:fund"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Payout"
                      onClick={() => setModalState("payoutUnits")}
                      permissions={[
                        "create_payments:payout/bank-transfer/walledId",
                      ]}
                    />
                  </li>
                  <li>
                    {row.isDeactivated === false ? (
                      <DropdownButtonComponent
                        text="Delete"
                        onClick={() => setModalStateDelete("deleteUnit")}
                        permissions={["delete_units:id"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Delete"
                        onClick={() => setModalStateDelete("deleteUnit")}
                        permissions={["delete_units:id"]}
                      />
                    )}
                    {/* for access-control */}
                    {/* <li>
                      <DropdownButtonComponent
                        text="Manage access control"
                        onClick={() =>
                          router.push(
                            `/facility-management/access-control/${row.id}`
                          )
                        }
                        permissions={[
                          "create_access-control:generate",
                          "read_access-control:verify/accessCode",
                          "update_access-control:entry/accessCode",
                          "update_access-control:exit/accessCode",
                          "read_access-control:guests/still-inside",
                          "read_access-control:guests/expired-still-inside",
                          "read_access-control:guests-inside",
                          "read_access-control:history/accessCode",
                          "read_access-control",
                        ]}
                      />
                    </li> */}
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "accesscontrol" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={["read_access-control:verify/accessCode"]}
            >
              <button
                onClick={() => toggleActions(row.accessCode)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.accessCode && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="Verify Access Control"
                      onClick={() => setModalState("viewAccess")}
                      permissions={["read_access-control:verify/accessCode"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "assets" ? (
        <>
          <div className="flex items-center space-x-2 w-full md:w-4/5 ">
            <ButtonComponent
              text="View Facilities"
              onClick={() => router.push(`/facility-management/${row?.id}`)}
              permissions={["read_assets:id"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
            />

            <ButtonComponent
              text="Edit Asset"
              onClick={() => {
                toggleActions(row.id);
                setModalState("createAsset");
              }}
              permissions={["update_assets:id"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
            />

            <PermissionGuard requiredPermissions={["delete_assets:id"]}>
              {row.facilities.length > 0 ? (
                <div>
                  <TrashIconGray />
                </div>
              ) : (
                <div
                  onClick={() => {
                    toggleActions(row.id);
                    setModalStateDelete("deleteAsset");
                  }}
                >
                  <TrashIcon />
                </div>
              )}
            </PermissionGuard>
          </div>
        </>
      ) : type === "categories" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "read_assets:/sub-category/all",
                "read_assets:/category/sub-category/id",
                "read_assets:/category/all",
                "delete_assets:/sub-category/id",
                ,
                "delete_assets:/category/id",
                "create_assets:/sub-category",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View Category"
                      onClick={() => setModalState("viewAssetCategory")}
                      permissions={["read_assets:/category/all"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Create Sub Category"
                      onClick={() => setModalState("createAssetCategory")}
                      permissions={["create_assets:/sub-category"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "vendors" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={["delete_vendors:id", "update_vendors:id"]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createVendor")}
                      permissions={["update_vendors:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Delete"
                      onClick={() => setModalStateDelete("deleteVendor")}
                      permissions={["delete_vendors:id"]}
                    />
                  </li>
                  <li>
                    {row.status === "Active" ? (
                      <DropdownButtonComponent
                        text="De-activate"
                        onClick={() => setModalStateDelete("deactivateVendor")}
                        permissions={["update_vendors:id"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Re-activate"
                        onClick={() => setModalStateDelete("activateVendor")}
                        permissions={["update_vendors:id"]}
                      />
                    )}
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "technicians" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "delete_technicians:id",
                "update_technicians:id",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createTechnician")}
                      permissions={["update_technicians:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Delete"
                      onClick={() => setModalStateDelete("deleteTechnician")}
                      permissions={["delete_technicians:id"]}
                    />
                  </li>
                  <li>
                    {row.status === "Active" ? (
                      <DropdownButtonComponent
                        text="De-activate"
                        onClick={() =>
                          setModalStateDelete("deactivateTechnician")
                        }
                        permissions={["update_technicians:id"]}
                      />
                    ) : (
                      <DropdownButtonComponent
                        text="Re-activate"
                        onClick={() =>
                          setModalStateDelete("activateTechnician")
                        }
                        permissions={["update_technicians:id"]}
                      />
                    )}
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "powers" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "read_power-charges:id",
                "update_power-charges:id",
                "update_power-charges:id/apportion",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() =>
                        // setModalState("viewPowerCharge")
                        router.push(`/power/${row.id}`)
                      }
                      permissions={["read_power-charges:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createPowerCharge")}
                      permissions={["update_power-charges:id"]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Apportion"
                      onClick={() =>
                        setModalStateDelete("apportionPowerCharge")
                      }
                      permissions={["update_power-charges:id/apportion"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Delete"
                      onClick={() => setModalStateDelete("deletePowerCharge")}
                      permissions={["delete_power-charges:id"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "companies" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "read_companies:id",
                "update_companies:id",
                "update_companies:id/logo",
                "delete_companies:id",
                "update_companies:id/owner"
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() => router.push(`/company/${row.id}`)}
                      permissions={["read_companies:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() => setModalState("createCompany")}
                      permissions={["update_companies:id"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Edit Logo"
                      onClick={() => setModalState("createCompanyLogo")}
                      permissions={["update_companies:id/logo"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Assign Company Owner"
                      onClick={() => setModalState("assignOwner")}
                      permissions={["update_companies:id/owner"]}
                    />
                  </li>
                  <li>
                    <DropdownButtonComponent
                      text="Delete"
                      onClick={() => setModalStateDelete("deleteCompany")}
                      permissions={["delete_companies:id"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "ppms" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "read_ppms",
                "read_ppms:/id",
                "update_ppms:id",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() => router.push(`/ppm/${row.id}`)}
                      permissions={["read_ppms:/id"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "approvefunding" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard requiredPermissions={["read_payments:id"]}>
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() =>
                        router.push(`/transaction/approve-funding/${row.id}`)
                      }
                      permissions={["read_payments:id"]}
                    />
                  </li>

                  {row.type === "MANUAL_FUNDING" && (
                    <>
                      <li>
                        <DropdownButtonComponent
                          text="Verify"
                          onClick={() => setModalStateDelete("approveFunding")}
                          permissions={[
                            "update_payments:manual-fund/id/verify",
                          ]}
                        />
                      </li>
                      <li>
                        <DropdownButtonComponent
                          text="Reject"
                          onClick={() => setModalState("rejectFunding")}
                          permissions={[
                            "update_payments:manual-fund/id/reject",
                          ]}
                        />
                      </li>
                    </>
                  )}
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "workrequests" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard requiredPermissions={["read_work-requests:id"]}>
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() => router.push(`/work-requests/${row.id}`)}
                      permissions={["read_work-requests:id"]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Comment"
                      onClick={() => setModalState("commentWorkRequest")}
                      permissions={["update_work-requests:id/comments"]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Update Status"
                      onClick={() => setModalState("updateStatusWorkRequest")}
                      permissions={[
                        "update_work-requests:id/status/reject",
                        "update_work-requests:id/status/close",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Accept Quotation"
                      onClick={() => setModalStateDelete("approveQuotation")}
                      permissions={[
                        "update_work-orders:id/quotations/approve-quotation/tenant",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Assign to Procurement"
                      onClick={() => setModalStateDelete("assignProcurement")}
                      permissions={[
                        "update_work-requests:id/assign/to-procurement",
                      ]}
                    />
                  </li>
                  {row.amount > 0 && (
                    <li>
                      <DropdownButtonComponent
                        text="Apportion Cost"
                        onClick={() =>
                          setModalStateDelete("apportionServiceCharge")
                        }
                        permissions={[
                          "update_work-requests:id/apportion/service-charge",
                        ]}
                      />
                    </li>
                  )}
                  <li>
                    <DropdownButtonComponent
                      text="Attach File"
                      onClick={() => setModalState("attachFile")}
                      permissions={["create_files:upload"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "workorders" ? (
        <>
          <div className="relative">
            {/* Button */}
            <PermissionGuard
              requiredPermissions={[
                "read_work-orders:id",
                "read_work-orders:id/users-with-work-request-approval-limit/all",
              ]}
            >
              <button
                onClick={() => toggleActions(row.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <TripleDotsIcon />
              </button>
            </PermissionGuard>

            {/* Dropdown Menu */}
            {activeRowId === row.id && (
              <ActionDropdownComponent
                toggleActions={() => toggleActions(null)}
                contextMenuedActions={() => contextMenuedActions(null)}
                contextMenued={contextMenued}
              >
                <ul className="py-2">
                  <li>
                    <DropdownButtonComponent
                      text="View"
                      onClick={() =>
                        // setModalState("viewWorkOrder")
                        router.push(`/work-orders/${row.id}`)
                      }
                      permissions={[
                        "read_work-orders:id",
                        "read_work-orders:id/users-with-work-request-approval-limit/all",
                      ]}
                    />
                  </li>

                  {/* <li>
                    <DropdownButtonComponent
                      text="Edit"
                      onClick={() =>
                        setModalState("createWorkOrder")
                      }
                      permissions={[
                        "read_work-orders:id/users-with-work-request-approval-limit/all",
                      ]}
                    />
                  </li> */}

                  <li>
                    <DropdownButtonComponent
                      text="Comment"
                      onClick={() => setModalState("commentWorkOrder")}
                      permissions={["update_work-requests:id/comments"]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Accept Request"
                      onClick={() => setModalStateDelete("acceptWorkOrder")}
                      permissions={[
                        "update_work-orders:id/accept/work-order-by-procurement",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Add Quotations"
                      onClick={() => setModalState("quotationsWorkOrder")}
                      permissions={["update_work-orders:id/upload-quotation"]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Request Quotation Selection"
                      onClick={() =>
                        setModalStateDelete("requestquotationsselection")
                      }
                      permissions={[
                        "update_work-orders:id/quotations/request-quotation-selection",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Select Quotation"
                      onClick={() => setModalState("acceptQuotation")}
                      permissions={[
                        "update_work-orders:id/accept-quotation/quotationId",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Request Quotation Approval"
                      onClick={() => setModalState("requestquotationsapproval")}
                      permissions={[
                        "update_work-orders:id/quotations/request-quotation-approval",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Approve Quotation"
                      onClick={() => setModalStateDelete("approveQuotation")}
                      permissions={[
                        "update_work-orders:id/quotations/approve-quotation",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Approve Quotation"
                      onClick={() =>
                        setModalStateDelete("approveQuotationTenant")
                      }
                      permissions={[
                        "update_work-orders:id/quotations/approve-quotation/tenant",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Reject Quotation"
                      onClick={() => setModalStateDelete("rejectQuotation")}
                      permissions={[
                        "update_work-orders:id/quotations/reject-quotation",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Reject Quotation"
                      onClick={() =>
                        setModalStateDelete("rejectQuotationTenant")
                      }
                      permissions={[
                        "update_work-orders:id/quotations/reject-quotation/tenant",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Raise Purchase Order"
                      onClick={() => setModalStateDelete("raisePaymentOrder")}
                      permissions={[
                        "update_work-orders:id/quotations/raise-payment-order/debit-facility",
                        "update_work-orders:id/quotations/raise-payment-order",
                        "update_work-orders:id/quotations/raise-payment-order/credit-vendor-or-technician",
                      ]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Close"
                      onClick={() => setModalState("closeWorkOrder")}
                      permissions={["update_work-orders:id/status/close"]}
                    />
                  </li>

                  <li>
                    <DropdownButtonComponent
                      text="Rate"
                      onClick={() => setModalState("rateWorkOrder")}
                      permissions={["update_work-orders:id/rate"]}
                    />
                  </li>

                  {row.amount > 0 && (
                    <>
                      <li>
                        <DropdownButtonComponent
                          text="View and Approve Apportionment"
                          onClick={() => setModalState("viewServiceCharge")}
                          permissions={[
                            "update_work-orders:id/apportion/service-charge/approve",
                          ]}
                        />
                      </li>
                      <li>
                        <DropdownButtonComponent
                          text="Apportion Cost"
                          onClick={() =>
                            setModalStateDelete("apportionServiceCharge")
                          }
                          permissions={[
                            "update_work-orders:id/apportion/service-charge",
                          ]}
                        />
                      </li>
                    </>
                  )}
                  <li>
                    <DropdownButtonComponent
                      text="Attach File"
                      onClick={() => setModalState("attachFile")}
                      permissions={["create_files:upload"]}
                    />
                  </li>
                </ul>
              </ActionDropdownComponent>
            )}
          </div>
        </>
      ) : type === "bills" ? (
        <div className="flex items-center space-x-5">
          {!row.isPaid ? (
            <div className="flex items-center space-x-2 w-full md:w-full ">
              <ButtonComponent
                text="Pay"
                onClick={() => {
                  toggleActions(row.id);
                  setModalStateDelete("payBills");
                }}
                permissions={["update_bills:id/pay"]}
                className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 w-full md:w-full ">
              <ButtonComponent
                text="Paid"
                permissions={["update_bills:id/pay"]}
                className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white text-[#A8353A] border border-gray-200 rounded-md"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 w-full md:w-full ">
            <ButtonComponent
              text="View"
              onClick={() => {
                toggleActions(row.id);
                setModalState("viewBills");
              }}
              permissions={["read_bills:id"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
            />
          </div>
        </div>
      ) : type === "transactions" ? (
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2 w-full md:w-4/5 ">
            <ButtonComponent
              text="View"
              onClick={() => {
                toggleActions(row.id);
                router.push(`/transaction/${row.id}`);
              }}
              permissions={["read_bills:id"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white text-[#A8353A] border border-gray-200 rounded-md"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            {/* Additional Condition */}
            <ButtonComponent
              text="Custom Action"
              onClick={() => console.log("Perform custom action")}
              permissions={["custom_action_permission"]}
              className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-green-500 text-white border border-gray-200 rounded-md"
            />
          </div>
        </>
      )}
    </>
  );
};

export default Actions;
