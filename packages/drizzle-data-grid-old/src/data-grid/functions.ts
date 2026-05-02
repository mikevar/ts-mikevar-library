import type { FilterValue } from "@mikevar/parse-data-grid-query";
import type { FilterValueType, FilterOperator } from "../types.ts";

export function parseValue({
  type,
  values,
}: {
  type: FilterValueType;
  values: FilterValue;
}): FilterValueType[] {
  if (!values) {
    return [];
  }

  switch (type) {
    case "number": {
      return values?.map((value) => {
        const num = Number(value);
        if (isNaN(num)) return undefined;
        return num;
      });
    }
    case "boolean":
      return values?.map((value) => value === "true");
    case "date": {
      return values?.map((value) => new Date(value));
    }
    case "string":
    default:
      return values;
  }
}

export function parseFieldKeyAndOperator({ key }: { key: string }) {
  const [fieldKey, operatorRaw] = key.split("__");
  const operator = (operatorRaw ?? "eq") as FilterOperator;

  return { fieldKey, operator };
}
