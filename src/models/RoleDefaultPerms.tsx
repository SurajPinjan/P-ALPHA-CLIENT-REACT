import {
  PermissionModel,
  PermissionView,
  getModelFromViewPermission,
  getViewFromModelPermission,
} from "./Permission";

export type RoleDefaultPermsModel = PermissionModel & {
  dp_uid: number | null;
};

export type RoleDefaultPermsView = PermissionView & {
  dp_uid: number | null;
};

export function getViewFromModelRoleDefaultPerms(
  a: RoleDefaultPermsModel
): RoleDefaultPermsView {
  return {
    ...getViewFromModelPermission(a),
    dp_uid: a.dp_uid,
  };
}

export function getModelFromViewRoleDefaultPerms(
  a: RoleDefaultPermsView
): RoleDefaultPermsModel {
  return {
    ...getModelFromViewPermission(a),
    dp_uid: a.dp_uid,
  };
}
