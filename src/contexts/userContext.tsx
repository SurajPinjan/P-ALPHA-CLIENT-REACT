import React, { createContext, useContext, useEffect, useState } from "react";
import { BLANK } from "../types/enums";
import { PermissionView } from "../models/Permission";

export interface UserRoleContextType {
  role: string;
  permissions: PermissionView[];
}
const UserRoleContext = createContext<UserRoleContextType>({
  role: BLANK,
  permissions: [],
});

const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string>(BLANK);
  const [userPermission, setUserPermissions] = useState<PermissionView[]>([]);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userrole") as string;
    const storedUserPermissionsString = localStorage.getItem(
      "permissions"
    ) as string;

    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    if (storedUserPermissionsString) {
      setUserPermissions(
        JSON.parse(storedUserPermissionsString) as PermissionView[]
      );
    }
  }, []);

  return (
    <UserRoleContext.Provider
      value={{ role: userRole, permissions: userPermission }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

export { UserRoleProvider, useUserRole };
