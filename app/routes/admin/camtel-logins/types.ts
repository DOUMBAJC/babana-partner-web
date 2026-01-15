export type CamtelLoginUser = {
  id: string;
  name: string;
  email: string;
  camtel_login_id?: string | null;
};

export type CamtelLogin = {
  id: string;
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


