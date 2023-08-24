export interface Point {
  Control0: [number, number, number];
  Control1: [number, number, number];
  NextDistance: number;
  PrevDistance: number;
  Translate: [number, number, number];
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
