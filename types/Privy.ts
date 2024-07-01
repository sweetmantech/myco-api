export interface PrivyUser {
  id: string;
  created_at: number;
  linked_accounts: {
    type: "wallet" | "email";
    address: string;
    chain_type?: string; // cuurently EVM only
    verified_at: number;
  }[]
}

export interface PrivyBatchUserResponse {
  data: PrivyUser[];
  next_cursor: string | null;
}

export interface PrivyClientOptions {
  method?: string;
  body?: Record<string, unknown>;
};