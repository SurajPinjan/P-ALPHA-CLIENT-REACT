import { COLUMN_TYPE, FILTER_OPERATOR } from "./enums"

export type Filter = {
    column: string,
    columnType: COLUMN_TYPE,
    operator: FILTER_OPERATOR,
    value: string //stringified JSON
}