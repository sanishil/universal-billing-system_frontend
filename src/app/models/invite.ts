/** GET /auth/invite/:token */
export interface InviteInfo {
  name: string;
  email: string;
  invitedBy: string;
}

/** POST /auth/set-password */
export interface SetPasswordRequest {
  token: string;
  password: string;
}
