export type CamtelLoginUser = {
  id: number;
  name: string;
  email: string;
  camtel_login_id?: number | null;
};

export type CamtelLogin = {
  id: number;
  /**
   * Champ principal côté API: `value` (format: BA_xxx)
   */
  value?: string | null;
  /**
   * Propriétaire / libellé côté API: `owner_name`
   */
  owner_name?: string | null;
  camtel_created_at?: string | null;
  users_count?: number | null;
  users?: CamtelLoginUser[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};


