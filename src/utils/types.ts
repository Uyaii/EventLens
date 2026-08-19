export interface Tenants {
  id: string;
  org_name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface apiKeys {
  id: string;
  tenant_id: string;
  tenant_key: string;
  is_active: boolean;
  created_at: Date;
}

export interface Events {
  id: string;
  tenant_id: string;
  event_name: string;
  user_id: string;
  properties: Record<string, unknown>; //this declares that properties is an object with string keys and unknown pairs for the keys
  occurred_at: Date;
}
