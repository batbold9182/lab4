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
export interface Equipment {
  name : string;
  type : string;
  profile: any;
   stats : {
    agi: number;
    str: number;
    int: number;
    hp: number;
  };
}
export interface Enemy {
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
  equipment: undefined;
  index: undefined;
  heroes: { selectedEquipment?: Equipment } | undefined;
  fight: {
    hero: Hero;
    stats: {
      agi: number;
      str: number;
      int: number;
        hp: number;
        equipment?: Equipment;
    };
  };
};
