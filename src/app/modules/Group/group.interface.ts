export interface ICreateGroup {
  name: string;
  visibility: "public" | "private";
  memberIds: string[];
}

