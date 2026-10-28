import { HttpContextToken } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiUrl;

/** Set on public calls (share link, invite) so the interceptor never attaches a stale Bearer token. */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
