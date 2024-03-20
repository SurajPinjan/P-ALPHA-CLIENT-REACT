// http enums

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
}

export enum API_RESPONSE_CODE {
  SUCCESS_GEN = "S001",
  SUCCESS_CREATE = "S002",
  SUCCESS_UPDATE = "S003",
  LDAP_LOGIN_SUCCESS = "S004",
  SUCCESS_PING = "S005",
  ERROR = "ER001",
  NOT_FOUND = "ER002",
  REQUEST_INVALID = "ER003",
  ERROR_CREATING = "ER004",
  ERROR_RETRIEVING_DATA = "ER005",
  ERROR_UPDATING_DATA = "ER006",
  ERROR_UPLOADING_FILE = "ER007",
  ERROR_INVALID_TOKEN = "ER008",
  ERROR_INVALID_ROLE = "ER009",
}

export enum ENTITY_NAME {
  X = "x",
  Y = "y",
  Z = "z",
  ROLE = "role",
  DEFAULTPERMS = "defaultperms",
  ROLEDEFAULTPERMS = "roledefaultperms",
  PERMISSION = "permission",
  YWITHX = "yWithX",
  XDETAILWITHX = "xDetailWithX",
  XDETAIL = "xDetail",
  FILE = "file",
  AUTH = "auth",
  MASTER = "master",
  MEDIA = "media",
}

export enum OPERATION {
  // CRUD
  CREATE_ONE = "createone",
  GET_ALL = "getall",
  GET_ONE = "getone",
  UPDATE_ONE = "updateone",

  PING = "ping",

  // AUTH
  LOGIN = "login",
  LOGOUT = "logout",

  // FILE
  UPLOAD = "upload",
}

export const BLANK = "";

// permission types

export enum PERMISSION_TYPES {
  READ_ONLY = "read",
  WRITE = "write",
}

// Roles enum

export enum USER_ROLES {
  ADMIN = "admin",
  OPERATOR = "operator",
}

export enum SELECT_VALUES {
  VALUE_1 = "VALUE1",
  VALUE_2 = "VALUE2",
}

// filter enums

export enum COLUMN_TYPE {
  DATE = "date",
}

export enum FILTER_OPERATOR {
  // date operators
  BEFORE = "<",
  AFTER = ">",
  ON = "=",
}
