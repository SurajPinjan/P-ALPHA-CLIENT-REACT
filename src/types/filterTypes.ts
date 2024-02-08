// Define types for comparison operators
export type ComparisonOperator =
  | "="
  | ">"
  | ">="
  | "<"
  | "<="
  | "!="
  | "IN"
  | "BETWEEN"
  | "LIKE";

// Define a export type for logical operators
export type LogicalOperator = "AND" | "OR";

// Define a export type for filter value which can be a string, number, date, boolean, or an array of these
export type FilterValue = string | number | Date | boolean | FilterValue[];

// Define an interface for a simple filter condition
export interface SimpleFilter {
  column_name: string;
  operator: ComparisonOperator;
  value: FilterValue;
}

// Define an interface for nested filter conditions
export interface NestedFilter {
  [key: string]: Filter[];
}

// Define a union export type for both simple and nested filter conditions
export type Filter = SimpleFilter | NestedFilter;
