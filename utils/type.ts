export interface IOption {
  id: string;
  text: string;
  vote: number | null;
}

export interface IComment {
  user: {
    id: string;
    name: string;
  };
  id: string;
  comment: string;
  author: string;
  createdAt: Date;
  questionId: string;
}

export interface IQuestion {
  owner: { name: string };
  sets: { setName: string }[];
  id: string;
  intro: string;
  scenerio: string;
  setIds: string[];
  ratings: number | null;
  ownerId: string;
  options: IOption[];
  comments?: IComment;
}

export interface ISet {
  id: string;
  setName: string;
  description: string;
  visibility: string;
  ownerId: string;
  questionIds: string[];
}
