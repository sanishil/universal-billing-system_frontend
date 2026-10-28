# Frontend — Project Structure & Changes (Angular)

This document covers the frontend work for three new features in the UBS billing app.

| # | Feature | In one line |
|---|---------|-------------|
| 1 | **Optional GST** | The person creating a bill can choose **No GST**, which stores `gstRate = null`. |
| 2 | **Billing loop** | A customer gets a login from their email. They see bills sent to them and can create bills for their own customers, who get a login too, and so on. |
| 3 | **Public link + email** | The public print link is emailed to the customer, with the PDF attached. |

Legend: `[NEW]` new file/folder · `[MOD]` existing file that changes · no tag = unchanged.
Each component folder has its usual `x.ts`, `x.html` and `x.css`. Rename paths to match your repo; only the tags matter.

---

## 1. Project tree

```
src/
├── index.html
├── main.ts
├── styles.css
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── app/
    ├── app.ts                               [MOD] add /set-password to the full-screen (no shell) routes
    ├── app.html
    ├── app.config.ts
    ├── app.routes.ts                        [MOD] new routes (see §2)
    ├── api.config.ts
    │
    ├── core/
    │   ├── interceptors/
    │   │   └── api.interceptor.ts           [MOD] 401 → logout + /login; skip Bearer for public calls
    │   ├── guards/
    │   │   ├── auth.guard.ts                [MOD] also check the JWT "exp", not only "user exists"
    │   │   ├── redirect-if-authenticated.guard.ts
    │   │   ├── public-bill.guard.ts
    │   │   └── bill-issuer.guard.ts         [NEW] only the issuer may open /bills/edit/:id
    │   ├── models/
    │   │   ├── bill.model.ts                [MOD] gstRate: number | null, myRole, issuer, publicUrl
    │   │   ├── customer.model.ts            [MOD] accountStatus: NONE | INVITED | REGISTERED
    │   │   ├── user.model.ts                [MOD] businessName, gstin, stateCode, status
    │   │   ├── invite.model.ts              [NEW] InviteInfo, SetPasswordRequest
    │   │   └── bill-email.model.ts          [NEW] SendBillEmailRequest, BillEmailLog
    │   ├── services/
    │   │   ├── auth.service.ts              [MOD] getInvite(token), setPassword(token, pwd)
    │   │   ├── bill.service.ts              [MOD] getBills(scope), getShareLink(), sendEmail(), getEmails()
    │   │   ├── public-bill.service.ts       [NEW] public endpoints only (no login)
    │   │   ├── customer.service.ts          [MOD] map accountStatus in the normaliser
    │   │   ├── pdf.service.ts               [MOD] print layout without tax rows when No GST
    │   │   ├── layout.service.ts
    │   │   └── toast.service.ts
    │   └── utils/
    │       ├── currency-utils.ts
    │       └── gst-calculator.ts            [NEW] one GST function for create + edit + view
    │
    ├── shared/
    │   └── components/
    │       ├── header/
    │       ├── sidebar/                     [MOD] Bills → "Sent" and "Received"
    │       ├── footer/
    │       ├── toast/
    │       ├── gst-rate-select/             [NEW] "No GST" + rate options (from system settings)
    │       └── send-bill-dialog/            [NEW] To / CC / message / attach-PDF form
    │
    └── features/
        ├── auth/
        │   ├── login/                       [MOD] label "Email or phone"
        │   ├── register/
        │   └── set-password/                [NEW] /set-password?token=…  (invite link lands here)
        ├── dashboard/                       [MOD] "To collect" (sent) vs "To pay" (received)
        ├── bills/
        │   ├── bill-list/                   [MOD] Sent | Received tabs via ?scope=
        │   ├── bill-create/                 [MOD] GST select, "Email bill", "Give customer a login"
        │   ├── bill-edit/                   [MOD] GST select; issuer only
        │   ├── bill-view/                   [MOD] actions by myRole, "Send by email", email history
        │   ├── bill-details/                [MOD] hide tax rows when gstRate is null
        │   └── bill-email-history/          [NEW] small table shown inside bill-view
        ├── customers/
        │   ├── customer-list/               [MOD] account badge (Registered / Invited / —)
        │   ├── customer-create/             [MOD] "Give login" checkbox; email required when checked
        │   └── customer-details/            [MOD] server filter: GET /bills?scope=sent&customerId=
        ├── payments/
        │   ├── payment-history/
        │   ├── payment-process/             [MOD] lists GET /bills?scope=sent&status=UNPAID
        │   └── payment-success/
        ├── reports/                         [MOD] show "Non-GST sales" separately from taxable sales
        ├── pdf/
        ├── notifications/
        │   ├── notification-history/        [MOD] new types BILL_RECEIVED, BILL_EMAILED, BILL_VIEWED
        │   └── notification-settings/
        ├── settings/
        │   ├── profile-settings/            [MOD] business name, GSTIN, state (replaces hard-coded '29')
        │   └── system-settings/             [MOD] GST rate list, default rate (incl. No GST), auto-email
        ├── share/
        │   └── share-link/                  [MOD] uses POST /bills/:id/share-link
        └── public/
            └── public-bill-view/            [MOD] read-only: view, print, download PDF; no mark-paid
```

---

## 2. Routes

| Route | Component | Guard | Change |
|-------|-----------|-------|--------|
| `/set-password?token=` | `SetPassword` | none (public) | **NEW**. Full-screen layout |
| `/bills?scope=sent` | `BillList` | `authGuard` | **MOD**. Default tab |
| `/bills?scope=received` | `BillList` | `authGuard` | **NEW** tab. Notifications link here |
| `/bills/view/:id` | `BillView` | `authGuard` | **MOD**. Buttons depend on `myRole` |
| `/bills/edit/:id` | `BillEdit` | `authGuard`, `billIssuerGuard` | **MOD** |
| `/bill/view/:uniqueId` | `PublicBillView` | `publicBillGuard` | **MOD**. Read-only |

`app.ts`: add `/set-password` to the list that already holds `/login`, `/register` and `/bill/view/*`.

---

## 3. Feature 1 — Optional GST ("No GST")

**Meaning of the values**

| `gstRate` | Meaning | What the bill shows |
|-----------|---------|---------------------|
| `null` | GST not applied (for example, a seller not registered for GST) | No CGST/SGST/IGST rows. "GST not applicable" note. Title can be "Bill of Supply". |
| `0` | 0% / nil-rated, still a tax invoice | Tax rows shown as ₹0.00 |
| `5`, `18`, `40` … | Normal GST | CGST+SGST (same state) or IGST (other state) |

Since 22 Sept 2025 the main slabs are 0%, 5%, 18% and 40%. There are also special rates like 3% on gold. Load the list from **System Settings** instead of hard-coding it.

### `core/utils/gst-calculator.ts` [NEW]

The same logic is currently written in both `bill-create.ts` and `bill-edit.ts`. Move it here and call it from both.

```ts
export interface BillLine { quantity: number; price: number; }

export interface GstBreakdown {
  subtotal: number;
  gstRate: number | null;   // null = No GST
  interState: boolean;
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  total: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateGst(
  items: BillLine[],
  gstRate: number | null,
  supplierStateCode: string,       // from the logged-in user's profile (NOT '29')
  placeOfSupplyStateCode: string,  // from the customer
): GstBreakdown {
  const subtotal = round2(items.reduce((s, i) => s + i.quantity * i.price, 0));
  const interState = supplierStateCode !== placeOfSupplyStateCode;

  if (gstRate === null) {
    return { subtotal, gstRate: null, interState, cgst: 0, sgst: 0, igst: 0, taxTotal: 0, total: subtotal };
  }

  // gstRate is a percentage (18). If yours is stored as a fraction (0.18), drop the "/ 100".
  const tax = round2(subtotal * gstRate / 100);
  const cgst = interState ? 0 : round2(tax / 2);
  const sgst = interState ? 0 : round2(tax - cgst);   // cgst + sgst always equals tax
  const igst = interState ? tax : 0;

  return { subtotal, gstRate, interState, cgst, sgst, igst, taxTotal: tax, total: round2(subtotal + tax) };
}
```

### `shared/components/gst-rate-select/` [NEW]

- Inputs: `rates: number[]` from system settings. Output: a `number | null` value, implemented with `ControlValueAccessor`.
- Use `[ngValue]`, not `[value]`. With `[value]`, the "No GST" option sends the string `"null"` instead of `null`.

```html
<select class="form-select" [formControl]="control">
  <option [ngValue]="null">No GST</option>
  @for (r of rates; track r) { <option [ngValue]="r">{{ r }}%</option> }
</select>
```

### Changes in existing files

| File | Change |
|------|--------|
| `bill-create.ts` / `bill-edit.ts` | `gstRate: new FormControl<number \| null>(defaultRate)`. Call `calculateGst()` on every change. Send `gstRate: null` as-is; don't convert it to `0`. |
| `bill-view`, `bill-details`, `public-bill-view`, `pdf.service.ts` | `@if (bill.gstRate !== null)` around the tax rows. Otherwise show "GST not applicable". |
| `system-settings` | Edit the list of allowed rates and the default rate, which can be "No GST". |
| `reports` | Totals: taxable sales, tax collected, and **Non-GST sales** as a separate line. |

> The backend recomputes all totals. The frontend numbers are only a live preview.

---

## 4. Feature 2 — Billing loop (every user can issue and receive bills)

```
 A (logged in) ── creates bill for ──► customer B (email + phone)
                                            │
                     backend: is there a user with B's email?
                          ├─ yes → bill.recipient = B, notification BILL_RECEIVED
                          └─ no  → B created as INVITED, email with /set-password?token=…
                                            │
 B opens link → /set-password → sets password → logged in → Bills ▸ Received
                                            │
 B creates bill for C ──► same steps ──► C logs in ──► C bills D … (loop)
```

### What the user sees

| Screen | Change |
|--------|--------|
| **Sidebar** | Bills → **Sent** (`/bills?scope=sent`) and **Received** (`/bills?scope=received`) |
| **Bill list** | Tabs bound to the `scope` query param. Received rows show "From: {issuer business name}" |
| **Bill view** | Issuer sees Edit, Delete, Mark paid, Send email, Copy link. Recipient sees Print, Download PDF, plus the issuer's name/GSTIN/address |
| **Customer create** | "Give this customer a login" checkbox, on by default when an email is entered |
| **Customer list** | Badge: **Registered** / **Invited** / — |
| **Dashboard** | Two cards: "To collect" (unpaid sent bills) and "To pay" (unpaid received bills) |
| **Profile settings** | Business name, GSTIN, address, **state**. Required before creating a bill |
| **Bill create** | If the profile has no state, show a banner linking to Profile and disable Save |

### `features/auth/set-password/` [NEW]

1. Read `token` from the query string.
2. `GET /auth/invite/:token` returns `{ name, email, invitedBy }`. Show "Hi B, A has sent you a bill".
3. Form: password + confirm (min 8 chars, must match).
4. `POST /auth/set-password` returns the **same shape as login**. `AuthService` stores `ubs_token` and `ubs_session_user`, then navigates to `/bills?scope=received`.
5. Handle `410 Gone` (expired or used link) with a message and a "Send me a new link" button.

### `core/models/bill.model.ts` [MOD]

```ts
export type BillRole = 'ISSUER' | 'RECIPIENT';

export interface BillParty {
  id: number;
  name: string;
  businessName?: string;
  gstin?: string | null;
  stateCode: string;
  address?: string;
}

export interface Bill {
  // …existing fields (id, billNumber, customer, items, subtotal, status, createdAt …)
  gstRate: number | null;           // MOD: was number. null = No GST
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  total: number;
  interState: boolean;

  myRole: BillRole;                 // NEW: from the backend, for the logged-in user
  issuer: BillParty;                // NEW
  supplierStateCode: string;        // NEW: snapshot at creation
  publicUrl?: string | null;        // NEW: absolute URL, built by the backend
  lastEmailStatus?: 'QUEUED' | 'SENT' | 'FAILED' | null;  // NEW
}
```

### `bill-create.ts` — supplier state

```ts
// before
const interState = customer.stateCode !== '29';
// after
const supplierState = this.auth.currentUser()!.stateCode;   // from profile
const gst = calculateGst(items, gstRate, supplierState, customer.stateCode);
```

### `bill-issuer.guard.ts` [NEW]

This calls `GET /bills/:id` and allows the route only if `myRole === 'ISSUER'`. Otherwise it redirects to `/bills/view/:id`. It is for UX only, since the backend is what really enforces it.

---

## 5. Feature 3 — Public print link + email the bill

### Bill view → "Send by email"

```
[Send by email] → send-bill-dialog
      To:      prefilled with customer email (editable)
      CC:      optional
      Message: optional note
      [x] Attach PDF
   → POST /bills/:id/send-email  → 202 { emailLogId, status: 'QUEUED' }
   → toast "Bill is being sent to b@example.com"
   → bill-email-history reloads (GET /bills/:id/emails)
```

### Bill create → "Email bill to customer after saving"

- Checkbox, default from System Settings. Sent as `sendEmail: true` in `POST /bills`.
- `inviteRecipient: true` comes from the "Give this customer a login" checkbox.
- When both apply, the backend sends **one** email containing the bill link and the set-password link.

### Copy public link

- `POST /bills/:id/share-link` returns `{ url, expiresAt }`. Copy `url` exactly as returned.
- Don't build the link from `window.location`, so that the copied link and the emailed link are always the same.

### `features/public/public-bill-view/` [MOD]

| Action | Call |
|--------|------|
| Load bill | `GET /bills/link/:uniqueId` (no login) |
| Print | `PdfService` print window (as today) |
| Download PDF | `GET /bills/link/:uniqueId/pdf` |
| Mark paid | **Removed.** See §7 |
| Expired / revoked link | `410` → "This link has expired. Contact {issuer}." |

### `core/services/public-bill.service.ts` [NEW]

- Contains only the two public calls above.
- Uses an `HttpContextToken` (for example, `SKIP_AUTH`) so `api.interceptor.ts` doesn't attach a stale Bearer token.

### `core/models/bill-email.model.ts` [NEW]

```ts
export interface SendBillEmailRequest {
  to?: string;          // default: customer email
  cc?: string[];
  message?: string;
  attachPdf?: boolean;  // default true
}

export interface BillEmailLog {
  id: number;
  toEmail: string;
  type: 'BILL' | 'BILL_WITH_INVITE';
  status: 'QUEUED' | 'SENT' | 'FAILED';
  error?: string | null;
  createdAt: string;
  sentAt?: string | null;
}
```

---

## 6. API calls used by the frontend (new or changed)

Full request/response details are in `backend-project-structure.md`.

| Method | Path | Used by |
|--------|------|---------|
| GET | `/bills?scope=sent\|received&status=&customerId=` | bill-list, dashboard, customer-details, payment-process |
| GET | `/bills/stats?scope=` | dashboard |
| POST | `/bills` (adds `gstRate: null`, `sendEmail`, `inviteRecipient`) | bill-create |
| PUT | `/bills/:id` (issuer only) | bill-edit |
| PATCH | `/bills/:id/mark-paid` (issuer only, login required) | bill-view |
| POST | `/bills/:id/share-link` | bill-view, share-link |
| POST | `/bills/:id/send-email` | send-bill-dialog |
| GET | `/bills/:id/emails` | bill-email-history |
| GET | `/bills/link/:uniqueId` | public-bill-view |
| GET | `/bills/link/:uniqueId/pdf` | public-bill-view |
| GET | `/auth/invite/:token` | set-password |
| POST | `/auth/set-password` | set-password |
| GET / PUT | `/settings/profile` (adds businessName, gstin, stateCode, address) | profile-settings |
| GET / PUT | `/settings/system` (adds gstRates, defaultGstRate, autoEmailOnCreate) | system-settings, bill-create |

---

## 7. Fix alongside these features

| Problem today | Why it matters now | Fix |
|---------------|--------------------|-----|
| The public page calls `PATCH /bills/:id/mark-paid` | The link is now emailed and will be forwarded. Anyone holding it could mark the bill paid. | Remove it from the public page. Only the issuer marks a bill paid, while logged in. The "Pay via UPI" button can stay as a `upi://pay?...` deep link. |
| `authGuard` only checks that a user object exists | Invited users and token expiry make this matter more | Decode the JWT `exp` in `isAuthenticated()`. In the interceptor, on `401`, log out and go to `/login`. |
| Supplier state hard-coded as `'29'` | Every user is now a supplier, in their own state | Use `currentUser.stateCode` and pass it to `calculateGst()` |
| Filtering bills in the browser (`customer-details`) | Bills are now per-user and will grow | Use the server filter `?customerId=` |

---

## 8. Build order

1. **Feature 1:** `gst-calculator.ts`, then `gst-rate-select`, then bill-create / bill-edit / views / PDF. This can ship on its own.
2. **Profile state code:** profile-settings fields, then remove `'29'`.
3. **Feature 2:** models (`myRole`, `issuer`), then bill-list tabs and sidebar, then bill-view actions by role, then `bill-issuer.guard`, then `set-password` page and route, then customer badges, then dashboard split.
4. **Feature 3:** `public-bill.service`, then public-view changes (remove mark-paid, add PDF download), then `send-bill-dialog` and email history, then the checkboxes on bill-create.
5. Guard/interceptor fixes from §7.