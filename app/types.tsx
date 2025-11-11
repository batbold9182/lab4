// app/types.ts
export interface Hero {
  name: string;
  profile: any;
  type: string;
  stats: {
    agi: number;
    str: number;
    int: number;
    hp: number;
  };
}

export type RootStackParamList = {
  index: undefined;
  fight: {
    hero: Hero;
    stats: {
      agi: number;
      str: number;
      int: number;
        hp: number;
    };
  };
};
