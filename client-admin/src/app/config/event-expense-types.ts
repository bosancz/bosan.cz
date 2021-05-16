export enum EventExpenseTypeId {
  "Potraviny" = "Potraviny",
  "Doprava" = "Doprava",
}

export interface EventExpenseType {
  color: string;
}

export const EventExpenseTypes: { [id in EventExpenseTypeId]: EventExpenseType } = {
  "Potraviny": { color: "primary" },
  "Doprava": { color: "secondary" },
};