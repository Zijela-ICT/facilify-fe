export const tableMainButtonConfigs = {
  users: [
    {
      text: "Create User",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_users", "create_users:pre-register"],
      action: "createUser",
    },
    {
      text: "Bulk User",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_users:pre-register/bulk"],
      action: "createBulkUser",
    },
  ],
  roles: [
    {
      text: "Create Role",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_roles"],
      action: "createRole",
    },
    {
      text: "Bulk Role",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_roles"],
      action: "createBulkRole",
    },
  ],
  facilities: [
    {
      text: "Create Facility",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_facilities"],
      action: "createFacility",
    },
    {
      text: "Bulk Facility",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_facilities:bulk"],
      action: "createBulkFacility",
    },
  ],
  blocks: [
    {
      text: "Create Block",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_blocks"],
      action: "createBlock",
    },
    {
      text: "Bulk Blocks",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_blocks:bulk"],
      action: "createBulkBlock",
    },
  ],
  units: [
    {
      text: "Add New Units",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_units"],
      action: "createUnit",
    },
    {
      text: "Bulk Units",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_units:bulk"],
      action: "createBulkUnit",
    },
  ],
  assets: [
    {
      text: "Add New Assets",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_assets"],
      action: "createAsset",
    },
    {
      text: "Bulk Assets",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_assets:bulk"],
      action: "createBulkAsset",
    },
  ],
  categories: [
    {
      text: "Add Category",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_assets:/category"],
      action: "createAssetCategory",
    },
    {
      text: "Bulk Category",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_assets:/category/bulk"],
      action: "createBulkAssetCategory",
    },
  ],
  vendors: [
    {
      text: "Add Vendor",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_vendors"],
      action: "createVendor",
    },
    {
      text: "Bulk Vendor",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_vendors:bulk"],
      action: "createBulkVendor",
    },
  ],
  technicians: [
    {
      text: "Add Technician",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_technicians"],
      action: "createTechnician",
    },
    {
      text: "Bulk Technician",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_technicians:bulk"],
      action: "createBulkTechnician",
    },
  ],
  powers: [
    {
      text: "Power Charge",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_power-charges"],
      action: "createPowerCharge",
    },
    {
      text: "Bulk Power Charge",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_power-charges"],
      action: "createBulkPowerCharge",
    },
  ],
  companies: [
    {
      text: "Create Company",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_power-charges"],
      action: "createCompany",
    },
    // {
    //   text: "Bulk Power Charge",
    //   className:
    //     "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
    //   permissions: ["create_power-charges"],
    //   action: "createBulkPowerCharge",
    // },
  ],
  workrequests: [
    {
      text: "Create Work Request",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_work-requests"],
      action: "createWorkRequest",
    },
    {
      text: "Bulk Requests",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_work-requests:bulk"],
      action: "createBulkWorkRequest",
    },
    {
      text: "Create Request for user",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_work-requests:for-a-user"],
      action: "createWorkRequestforUser",
    },
    {
      text: "Bulk Requests for a user",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_work-requests:bulk"],
      action: "createBulkWorkRequestforUser",
    },
  ],
  workorders: [
    {
      text: "Create Work Order",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_work-orders:/work-order"],
      action: "createWorkOrder",
    },
    {
      text: "Bulk Work Order",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_work-orders:/work-order"],
      action: "createBulkWorkOrder",
    },
  ],
};
