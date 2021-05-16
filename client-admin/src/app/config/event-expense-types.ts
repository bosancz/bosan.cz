export enum EventExpenseTypeId {
  "Potraviny" = "Potraviny",
  "Doprava" = "Doprava",
  "Materiál" = "Materiál",
}

export interface EventExpenseType {
  color: string;
}

export const EventExpenseTypes: { [id in EventExpenseTypeId]: EventExpenseType } = {
  "Potraviny": { color: "primary" },
  "Doprava": { color: "secondary" },
  "Materiál": { color: "dark" },
};