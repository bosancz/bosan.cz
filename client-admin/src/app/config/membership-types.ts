export interface MembershipType {
  title: string;
}

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