export interface Point {
  Control0?: number[];
  Control1?: number[];
  NextDistance: number;
  PrevDistance: number;
  Translate: number[];
}

export interface Rail {
  Dynamic: {
    UniqueName: string;
  };
  Gyaml: string;
  Hash: string;
  IsClosed: boolean;
  Name: string;
  Points: Point[];
}
