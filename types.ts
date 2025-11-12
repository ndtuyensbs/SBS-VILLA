
export interface Room {
  id: string;
  name: string;
  area: number | string;
}

export interface Floor {
  id: string;
  rooms: Room[];
}
