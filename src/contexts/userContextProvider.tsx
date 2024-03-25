import React, { createContext, useEffect, useState } from "react";
import { PermissionView } from "../models/Permission";
import { BLANK } from "../types/enums";

export interface UserRoleContextType {
  role: string;
  permissions: PermissionView[];
}
export const UserRoleContext = createContext<UserRoleContextType>({
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

export { UserRoleProvider };
