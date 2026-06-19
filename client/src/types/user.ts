export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  profileImage?: string;
  addresses: Address[];
  createdAt: string;
}
