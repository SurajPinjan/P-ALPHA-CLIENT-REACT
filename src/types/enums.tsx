// http enums

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
}

export enum API_RESPONSE_CODE {
  SUCCESS = "S001",
  ERROR = "ER001",
  NOT_FOUND = "ER002",
  REQUEST_INVALID = "ER003",
  ERROR_CREATING = "ER004",
  ERROR_RETRIEVING_DATA = "ER005",
  ERROR_UPDATING_DATA = "ER006",
}

export enum ENTITY_NAME {
  X = "x",
  FILE = "file",
  AUTH = "auth",
}

export enum OPERATION {
  // CRUD
  CREATE_ONE = "createone",
  GET_ALL = "getall",
  GET_ONE = "getone",
  UPDATE_ONE = "updateone",

  // AUTH
  LOGIN = "login",
  LOGOUT = "logout",

  // FILE
  UPLOAD = "upload",
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
