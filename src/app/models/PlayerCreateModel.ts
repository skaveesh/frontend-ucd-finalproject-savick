export interface CreatePlayerAccountForName {
  username: string;
  password: string;
}

export interface PlayerCreateModel {
  createPlayerAccountForName: CreatePlayerAccountForName;
}
