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
    color: "#BB0000",
    active: false,
    children: true,
    real: true,
    event: true
  },
  "2": {
    name: "2. oddíl",
    color: "#FEC503",
    active: false,
    children: true,
    real: true,
    event: true
  },
  "3": {
    name: "3. oddíl",
    color: "#36802D",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "4": {
    name: "4. oddíl",
    color: "#3880ff",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "5": {
    name: "5. oddíl",
    color: "#BB0000",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "6": {
    name: "6. oddíl",
    color: "#36802D",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "7": {
    name: "7. oddíl",
    color: "#3880ff",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "8": {
    name: "8. oddíl",
    color: "#FEC503",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "22": {
    name: "22. oddíl",
    color: "#FEC503",
    active: true,
    children: true,
    event: true,
    real: true
  },
  "UH": {
    name: "Uhřínovští",
    color: "#8B4513",
    children: true,
    real: true,
    event: true,
    active: false,
  },
  "KP": {
    name: "Klub přátel",
    color: "#0F0F0F",
    event: true,
    real: true,
    active: true,
    children: false
  },
  "V": {
    name: "Vedoucí",
    color: "#000000",
    real: false,
    active: true,
    event: true,
    children: false
  }
});