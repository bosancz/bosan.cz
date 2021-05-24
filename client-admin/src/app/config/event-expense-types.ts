export enum EventExpenseTypeId {
  "Potraviny" = "Potraviny",
  "Doprava" = "Doprava",
  "Materiál" = "Materiál",
}

export interface EventExpenseType {
  title: string;
  color: string;
}

export const EventExpenseTypes: { [id in EventExpenseTypeId]: EventExpenseType } = {
  "Potraviny": { title: "Potraviny", color: "primary" },
  "Doprava": { title: "Doprava", color: "secondary" },
  "Materiál": { title: "Materiál", color: "dark" },
};