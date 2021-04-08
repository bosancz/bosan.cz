export interface EventStatus {
  id: "draft" | "pending" | "public" | "cancelled" | "finalized" | "rejected";
  name: string;
  color: string;
}