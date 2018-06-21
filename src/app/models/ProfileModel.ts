export interface DepositTransaction {
  senderOrReceiver: string;
  amount: number;
  turn: number;
}

export interface WithdrawTransaction {
  senderOrReceiver: string;
  amount: number;
  turn: number;
}

export interface Profile {
  name: string;
  balance: number;
  depositTransaction: DepositTransaction[];
  withdrawTransaction: WithdrawTransaction[];
}

export interface ProfileModel {
  profile: Profile;
}
