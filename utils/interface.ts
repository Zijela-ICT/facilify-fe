interface Role {
  id: number;
  name: string;
  users?: number;
}

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  email: string;
  approvalLimit : number
  roles: Role[];
}

interface AuthUser {
  id: number;
  avatar: any;
  companies : any[]
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  resetToken: string | null;
  emailConfirmToken: string | null;
  isEmailConfirmed: boolean;
  twoFASecret: string | null;
  isTwoFAEnabled: boolean;
  needPasswordReset: boolean;
  isVendor: boolean;
  isDeactivated: boolean;
  twoFAMethod: string;
  units: Unit[];
  facilities: Facility[];
  blocks: Block[];
  wallets: any[];
  hasPin : boolean
}

interface Permission {
  id: number;
  permissionString: string;
}

interface RoleData {
  id: number;
  name: string;
  permissions: Permission[];
  users: User[];
}

//Fcailities
interface Facility {
  id: number;
  name: string | null;
  type: string | null;
  code: string | null;
  address: string | null;
  email: string;
  phone: string | null;
  blocks: Block[];
  units: Unit[];
  assets: Asset[];
  wallets: any[];
}

interface Block {
  id: number;
  blockNumber: string | null;
  code: string | null;
  facilityOfficer: string | null;
  phone: string | null;
  email: string | null;
  type: string | null;
  address: string | null;
  units: Unit[];
  assets: Asset[];
}

interface Unit {
  id: number;
  unitNumber: string | null;
  type: string | null;
  ownership: string | null;
  description: string | null;
  bookable: string | null;
  commonArea: string | null;
  address: string | null;
  assets: Asset[];
  bills: any[];
  wallets: any[];
  user: User;
}

interface Asset {
  id: number;
  assetName: string;
  blocks: Block[];
  units: Unit[];
  facilities: Facility[];
}

//Vendor
interface Vendor {
  id: number;
  vendorCode: string;
  vendorName: string;
  vendorType: string;
  category: string;
  WHTCode: string;
  phoneNumber: string;
  email: string;
  address: string;
  rating: number | null;
  isDeactivated: boolean;
}

interface Technician {
  id: number;
  surname: string;
  firstName: string;
  serviceCategory: string;
  email: string;
  phoneNumber: string;
  address: string;
  rating: number | null;
  isDeactivated: boolean;
}

interface Transaction {
  id: number;
  amount: string;
  status: string;
  type: string;
  category: "INFLOW" | "OUTFLOW";
  description: string;
  isProcessed :boolean
  createdAt: string;
  updatedAt: string;
  facility: Facility;
  user: User;
}
