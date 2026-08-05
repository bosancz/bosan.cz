export interface MemberGroup {
  name: string;
  color: string;
  real: boolean;
  active: boolean;
  event: boolean;
  children: boolean;
}

export type MemberGroupID = keyof typeof MemberGroups;

const asMemberGroups = <T>(value: { [key in keyof T]: MemberGroup }) => value;

export const MemberGroups = asMemberGroups({
  "1": {
    name: "1. oddíl",
    color: "#d2232a",
    active: false,
    children: true,
    real: true,
    event: true
  },
  "2": {
    name: "2. oddíl",
    color: "#e28f26",
    active: false,
    children: true,
    real: true,
    event: true
  },
  "3": {
    name: "3. oddíl",
    color: "#799f3d",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "4": {
    name: "4. oddíl",
    color: "#2a3478",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "5": {
    name: "5. oddíl",
    color: "#d2232a",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "6": {
    name: "6. oddíl",
    color: "#799f3d",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "7": {
    name: "7. oddíl",
    color: "#2a3478",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "8": {
    name: "8. oddíl",
    color: "#e28f26",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "22": {
    name: "22. oddíl",
    color: "#e28f26",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "UH": {
    name: "Uhřínovští",
    color: "#7c5a3a",
    children: true,
    real: true,
    event: true,
    active: false,
  },
  "KP": {
    name: "Klub přátel",
    color: "#14141c",
    event: true,
    real: true,
    active: true,
    children: false
  },
  "V": {
    name: "Vedoucí",
    color: "#14141c",
    real: false,
    active: true,
    event: true,
    children: false
  }
});