import { useContext } from "react";
import { UserRoleContext, UserRoleContextType } from "./userContextProvider";

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};
