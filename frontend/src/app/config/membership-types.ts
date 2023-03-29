export interface MembershipType {
  title: string;
}

export type MembershipTypeID = keyof typeof MembershipTypes;

const asMembershipTypes = <T>(value: { [key in keyof T]: MembershipType }) => value;

export const MembershipTypes = asMembershipTypes({
  "clen": {
    title: "Člen"
  },
  "neclen": {
    title: "Nečlen"
  },
  "pozastaveno": {
    title: "Pozastaveno"
  }
});