# AVRUM Frontend Guide — Backend Implementation Reference

> **Audience:** Backend/AI engineers building the Avrum backend.  
> **Purpose:** This document is the single source of truth for what backend functionality the frontend requires.  
> **Status:** Derived from direct inspection of the TanStack Start frontend codebase (Aug 2026).

---

## 1. Project Overview

**What is AVRUM?**  
AVRUM AI is an agricultural intelligence platform that delivers AI-powered crop diagnosis, disease risk forecasting, precision spray recommendations, satellite field monitoring, and soil guidance to African farmers (primarily Nigeria). It also exposes these capabilities via a second product: **AVRUM Intelligence**, a developer/API platform for external organizations.

**Target Users (Confirmed from Frontend)**
- Individual smallholder farmers (1–5 hectares)
- Commercial farm operators (multi-site)
- Agronomists and extension workers
- Agricultural cooperatives and agribusinesses
- Government agricultural agencies
- NGOs
- Platform administrators
- External API consumers (developers using AVRUM Intelligence)

**Core Products** (Each has a dedicated route and UI)
1. **AI Crop Doctor** — Upload crop image → instant disease diagnosis + severity + treatment plan
2. **Disease Intelligence** — Regional outbreak map + disease library + early-warning alerts
3. **Spray Recommendation** — Product, dosage, safe application windows per field
4. **Satellite Monitoring** — NDVI, NDMI, stress indices from space; time-series history
5. **Soil Intelligence** — Lab report upload → nutrient gap → fertiliser plan
6. **AVRUM Intelligence** — Developer/API platform with API keys, usage metering, webhooks, documentation

**Development Stage**  
**Frontend: Complete presentation layer. Backend: Zero.** No authentication provider, no database, no API client, no external service integrations exist. Every page renders static content or empty states. All forms are uncontrolled UI. The codebase is a **design specification and frontend contract reference for the backend**.

---

## 2. Frontend Architecture

**Tech Stack** (Relevant to backend integration)
- **Framework:** TanStack Start (React SSR) + TanStack Router v1.170
- **State:** TanStack React Query v5.101 (planned; no usage yet)
- **Styling:** Tailwind CSS 4.2 + OKLCH semantic tokens + dark mode
- **UI Components:** shadcn/Radix (45 base primitives) + 14 domain-specific components
- **Validation:** Zod (client-side schemas in `src/lib/auth-validation.ts`)
- **Auth validation schemas:** Exact reusable contracts (see section 4)

**Key Architectural Observations**
- **No API client layer yet.** No axios, fetch, or TanStack Query usage.
- **No auth context/hook.** Auth state is frontend-only (no backend wired).
- **No route guards.** Protected routes (`/_app`, `/_dev`) have no authentication checks.
- **SSR-ready but no server functions.** `src/server.ts` handles error normalization; no API integration.
- **Modular components.** Layout shells (`AppShell`, `AuthShell`, `DeveloperShell`), page templates, domain primitives.

---

## 3. Routes and Pages — Complete Inventory

### 3.1 Marketing / Public Routes

| Route | Purpose | Auth Required | Status |
|---|---|---|---|
| `/` | Landing page (features, testimonials, FAQ, CTA) | No | Marketing only (empty) |
| `/onboarding` | Guided 11-step wizard (user type → personal → farm → crops → boundary → location → language → alerts) | No | UI complete; data discarded on reload |

### 3.2 Authentication Routes (`/_auth`)

| Route | Purpose | Auth | Form Fields | Next Step |
|---|---|---|---|---|
| `/sign-in` | Login | None | email, password, remember checkbox | → `/dashboard` (hardcoded redirect) |
| `/sign-up` | Register | None | fullName, organisation (optional), email, password, confirm, accept terms | → `/verify-email?email=` |
| `/verify-email` | Email OTP/link verification | None (uses email param) | confirmation code (implied, not shown) | → `/sign-in` |
| `/forgot-password` | Send password reset link | None | email | → confirmation message |
| `/reset-password` | Set new password via token | Reset token | password, confirm | → `/sign-in` |
| `/account-created` | Post-signup success screen | None | — | Info only |

**Key facts:**
- Sign-in/sign-up forms validate locally using Zod but **no backend call** happens; navigation is hardcoded with a 900ms delay
- Password validation: 8–72 characters, strength meter shown
- Email validation: standard format, max 255 chars
- Organisation field is optional
- "Remember me" checkbox exists but has no backend semantics yet

### 3.3 App Routes (`/_app`) — Farmer Workspace

#### Dashboard & Overview
| Route | Purpose | Components | Data Needed |
|---|---|---|---|
| `/dashboard` | Main overview | StatCards (0 active farms, crop health index, satellite passes, spray windows), map placeholder, recent activity (empty), AI insight card, risk watchlist | Farm count, health metrics, weather, satellite schedule, activity feed, AI insight |

#### Farm Management
| Route | Purpose | Status | Backend Need |
|---|---|---|---|
| `/farms` | Farm list | Empty state only | List farms owned by user + invite to add first farm |
| `/farms/fields` | Field boundary editor | Map placeholder only | Load field GeoJSON boundaries; map UI for drawing (blocked: no map library) |
| `/farms/calendar` | Crop calendar | Route exists; empty | Planting/harvest timelines per crop cycle |

#### AI & Intelligence
| Route | Purpose | Status | Backend Need |
|---|---|---|---|
| `/crop-doctor` | Upload → diagnose | UI complete but `UploadZone` has no `<input>` | Signed S3 upload, inference dispatch, diagnosis history |
| `/disease-intelligence` | Outbreak map + alerts | Map placeholder | Geospatial disease risk aggregation, outbreak heatmap |
| `/disease-intelligence/library` | Disease knowledge base | Empty state | Pathogen database with symptoms, conditions, treatments |
| `/spray-recommendation` | Advisory generator | UI only (selects non-functional) | Dosage rules, weather windows, product catalogue |
| `/satellite-monitoring` | NDVI/NDMI time series | Map placeholder | GEE/Sentinel integration, async tile generation |
| `/soil-intelligence` | Soil test upload & analysis | Empty state | Lab report parsing or manual entry, fertiliser rules |

#### Workspace & Profile
| Route | Purpose | Status |
|---|---|---|
| `/notifications` | Inbox for alerts & updates | Empty; no data model |
| `/profile` | Profile overview + navigation | Displays hardcoded `currentProfile` object |
| `/profile/edit` | Edit name, photo, bio, contact | Form UI (uncontrolled) |
| `/profile/account` | Email, phone, organisation, data export, deletion | Buttons with toast messages; no backend |
| `/profile/security` | Password change, MFA, session management | UI with hardcoded session list (3 fake devices) |
| `/profile/notifications` | Alert preferences | Empty state |
| `/profile/language` | Language, region, units, date format | Empty state |
| `/profile/appearance` | Theme, density, motion preferences | Empty state |
| `/profile/subscription` | Plan, billing (marked "Soon") | Marked as coming soon |
| `/profile/devices` | Active sessions (marked "Soon") | Marked as coming soon |
| `/profile/activity` | Audit log (marked "Soon") | Marked as coming soon |

#### Admin (Restricted)
| Route | Purpose | Status |
|---|---|---|
| `/admin` | User management, model versions, data quality | Restricted alert shown; empty state |
| `/settings` | Workspace settings (implied) | Route defined but no content found |

### 3.4 Developer Platform Routes (`/_dev/developer/*`)

| Route | Purpose | Status | Backend Need |
|---|---|---|---|
| `/developer` | Overview dashboard | Cards showing getting-started steps | Real API usage stats, account info |
| `/developer/api-products` | API product catalogue | 6 products with status (stable/beta/preview/coming-soon) | Real product metadata + subscription status |
| `/developer/api-keys` | Create, view, rotate API keys | 4 hardcoded keys shown | Key CRUD, scoping, environment isolation |
| `/developer/playground` | Interactive API tester | All controls disabled (static) | Real endpoint execution with sandbox isolation |
| `/developer/usage` | Per-product request volume & metrics | Hardcoded stats (509,830 total requests) | Metering pipeline, quota tracking |
| `/developer/docs` | API reference + quickstart | Static copy; no live reference | OpenAPI 3.1 spec generation |
| `/developer/logs` | Request/error log viewer | Mock data | Structured logging pipeline + query interface |
| `/developer/webhooks` | Event subscription + delivery history | Empty state; 4 event names listed | Webhook registration, signing, retry logic |
| `/developer/team` | Team members + invites | Empty state | Organisation membership, RBAC |
| `/developer/billing` | Plans, invoices, subscription | Empty state | Billing provider integration, quota enforcement |
| `/developer/settings` | Organisation settings | Empty state | Settings CRUD |

---

## 4. User Roles & Permissions (Inferred from Frontend)

**Roles Identified**
1. **Farmer (Smallholder/Commercial)** — Own/manage farms, run diagnostics, get advisories
2. **Agronomist/Extension Worker** — Access to farms (shared?), diagnostic library
3. **Cooperative/Agribusiness Lead** — Manage multiple member farms, bulk operations
4. **Developer** — API key holder, webhook integration, usage monitoring
5. **Administrator** — User management, model versioning, data quality controls, platform settings

**Permission Model** (Inferred)
- **Farm data isolation:** Each farmer/cooperative owns their farms; access is explicit
- **Onboarding:** User type selected at signup determines initial role
- **Organization membership:** Users belong to organizations (optional); organization members share farm access
- **Developer scope:** API key scopes (Crop, Disease, Satellite, Soil, Spray, Agricultural AI) restrict endpoints
- **Admin access:** Route `/admin` exists with restrictive alert; enforcement is server-side

**No visible permission inheritance or role hierarchy is coded; backend must design and enforce this.**

---

## 5. Feature Inventory — What the Frontend Needs

### 5.1 AI Crop Doctor
**Frontend state:** `/crop-doctor` page with upload UI (non-functional)  
**What it needs to do:**
- Accept 1+ crop images (JPG/PNG ≤10 MB)
- Run inference against a disease classification model
- Return diagnosis with:
  - Disease name
  - Confidence score (0–1)
  - Severity band (critical/high/medium/low)
  - Treatment recommendation
  - Link to spray advisory
- Store diagnosis + show in history
- Support per-crop, per-field, location-tagged diagnoses

**Backend requirements:**
- Signed S3 upload endpoint + image validation
- Inference dispatch (sync if <10s, else async with job ID)
- Diagnosis persistence (versioned with model ID)
- History query by user/farm/field/date

### 5.2 Disease Intelligence
**Frontend state:** `/disease-intelligence` with map placeholder + library  
**Implied workflow:**
- Show regional outbreak heatmap
- List active disease signals near user's fields
- Clickable disease library entries
- Alert threshold configuration

**Backend requirements:**
- Geo-aggregation of diagnoses + weather data
- Disease risk scoring (rules or model)
- Scheduled risk recomputation
- Disease database (pathogen, hosts, symptoms, conditions, control measures)
- Alert thresholds + notifications

### 5.3 Spray Recommendation
**Frontend state:** `/spray-recommendation` with filter panel (non-functional selects)  
**Workflow:**
- Filter by crop, field, target issue
- Click "Generate advisory"
- Display product + dosage + application window + safety info

**Backend requirements:**
- Product catalogue (country-registered formulations + active ingredients)
- Dosage rules per crop/disease/growth stage
- Weather window scoring (wind, rain, temperature, humidity)
- Pre-harvest interval (PHI) + re-entry interval (REI) lookups
- Advisory persistence

### 5.4 Satellite Monitoring
**Frontend state:** `/satellite-monitoring` with map placeholder  
**Workflow:**
- Select field (via boundary polygon)
- Choose index (NDVI, NDMI, stress)
- View current layer + time-series history
- Detect anomalies/flooding/drought

**Backend requirements:**
- Google Earth Engine or Sentinel Hub integration
- Async job pipeline (analysis takes minutes)
- Tile/asset generation and S3 storage
- Index time-series queryable by date range
- Cloud-cover filtering + quality flags

**Blocker:** No mapping library installed (`Leaflet`, `Mapbox`, `MapLibre`); boundary drawing is not yet possible.

### 5.5 Soil Intelligence
**Frontend state:** `/soil-intelligence` with empty state  
**Workflow:**
- Upload lab report (PDF/image/CSV) OR manually enter N-P-K/pH/OC
- See nutrient gap analysis
- Get fertiliser plan (product, rate, split timing)

**Backend requirements:**
- Soil profile table
- Optional lab-report OCR (REQUIRES DECISION)
- Fallback soil property estimates (iSDAsoil or SoilGrids API)
- Fertiliser recommendation engine per crop/target yield
- Historical soil data correlation

### 5.6 Onboarding Wizard
**Frontend state:** 11-step wizard, all UI in place  
**Wizard steps:**
1. Welcome
2. User type selection (smallholder/commercial/agronomist/cooperative)
3. Personal details (first/last name)
4. Farming background (crop type: crop/mixed/orchard/greenhouse)
5. First farm info (name, size, size unit)
6. Crop selection (multi-select from predefined list)
7. Farm boundary (map placeholder — requires drawing tool)
8. Location (country, state/region, town)
9. Language (6 options: English, Hausa, Yorùbá, Igbo, Français, Kiswahili)
10. Notification preferences (channels: push, email, SMS; alert types: disease, spray, satellite, market)
11. Finish & redirect to dashboard

**Data captured (defined in code as `Draft` type):**
```typescript
userType, firstName, lastName, phone, experience, farmingType, 
farmName, farmSize, sizeUnit, ownership, crops[], boundaryNote, 
country, state, town, language, channel, alerts[]
```

**Backend requirement:** Persist draft (auto-save state) and atomically create User + Farm + Field + CropCycle + Preferences on completion.

### 5.7 Notifications
**Frontend state:** Empty inbox  
**Implied features:**
- In-app notification center (paginated)
- Mark as read / read all
- Search/filter
- Notification preferences (email, push, SMS channels)

**Backend requirements:**
- Notification entity (type, severity, read status, timestamp)
- Event dispatcher (disease.outbreak.detected, spray.window.open, satellite.pass.completed, soil.report.ready)
- Preference matrix per user (channel + event type combinations)
- Delivery dispatch to email/SMS/push

### 5.8 Developer Platform
**Frontend state:** Complete UI; all pages static  
**Features needed:**
- **API Keys:** Create, view (once), rotate, delete; scoped by environment (sandbox/live) and product
- **Usage:** Per-product request counts, success rate, p95 latency, error rate; quota tracking
- **Logs:** Request/error log viewer with filtering by key, status, date, endpoint
- **Webhooks:** Register endpoints, view event types, delivery history, manual retry, test delivery
- **Playground:** Interactive API endpoint tester (JSON input/output, live or sandbox)
- **Documentation:** OpenAPI 3.1 spec + quickstart guide
- **Team:** Invite members, manage roles/permissions
- **Billing:** Plan selection, invoice history, subscription management
- **Settings:** Organization profile, data retention policy, rate limit tuning

**Backend requirements:** API gateway, key validation, metering, logging, webhook queue, rate limiting, quota enforcement.

---

## 6. Backend Requirements — Derived from Frontend

### 6.1 Authentication & Authorization
**Requirements (from `_auth` routes + `currentProfile`)**
- User registration with email, password (8–72 chars), full name, optional organization
- Email verification (OTP or link-based)
- Login with email + password + optional "remember me"
- Token refresh (implied by architecture)
- Logout (implied)
- Forgot password + reset via emailed token
- Password change (from `/profile/security`)
- Multi-factor authentication (UI exists; not yet implemented)
- Session management (hardcoded list shows 3 active devices)

**Schemas (from `src/lib/auth-validation.ts`):**
```typescript
signInSchema: { email, password, remember? }
signUpSchema: { fullName, organisation?, email, password, confirmPassword, terms }
forgotPasswordSchema: { email }
resetPasswordSchema: { password, confirmPassword }
```

### 6.2 User Profile & Account
**GET /v1/me should return** (from `src/lib/profile.ts`):
```json
{
  "firstName": "Adeola",
  "lastName": "Daramola",
  "role": "Agronomy Lead",
  "organisation": "Sunrise Agro Cooperative",
  "email": "adeola.daramola@sunriseagro.com",
  "phone": "+234 800 000 0000",
  "location": "Ibadan, Oyo State, Nigeria",
  "language": "English",
  "timezone": "Africa/Lagos (GMT+1)",
  "memberSince": "March 2026",
  "bio": "Leading agronomy for a 12-member cooperative across maize, cassava and cowpea rotations."
}
```
- Update profile (name, phone, bio, location, language, timezone)
- Export account data (GDPR-style archive)
- Delete account (with confirmation)
- View organization membership + leave org
- Manage preferences: language, units, date format, theme, motion, notification matrix

### 6.3 Farm Management
**Routes needed:**
- `GET /v1/farms` — list farms owned by user
- `POST /v1/farms` — create farm (name, location, size, size unit, ownership type)
- `PATCH /v1/farms/:id` — update farm details
- `DELETE /v1/farms/:id` — soft-delete or hard-delete
- `GET /v1/farms/:id` — farm details + associated fields/crops

**Farm fields (PostGIS boundaries):**
- `GET /v1/farms/:id/fields` — list fields for farm
- `POST /v1/farms/:id/fields` — create field with GeoJSON boundary
- `PATCH /v1/fields/:id` — update boundary or metadata
- `DELETE /v1/fields/:id` — remove field
- `GET /v1/fields/:id` — field details (geom, area, crops, soil data, satellite history)

**Crop cycles:**
- `GET /v1/crops` — list supported crops (Maize, Rice, Cassava, Tomato, Cocoa, etc. — from onboarding UI)
- `GET|POST /v1/crop-cycles` — manage crop plantings per field (crop, planting date, expected harvest, growth stage)

### 6.4 Image Upload & Storage
**Signed upload flow:**
- `POST /v1/uploads/sign` — request upload credentials
  - Request: `{ kind: "crop_image" | "farm_photo" | "soil_report", mime, bytes }`
  - Response: `{ uploadUrl, mediaId }`
- Frontend: PUT directly to presigned S3 URL
- Backend: Store `mediaId` reference in database

**Constraints (inferred from UI):**
- Crop images: JPG/PNG, ≤10 MB
- Soil reports: PDF/image, ≤10 MB (inferred)
- Farm photos: JPG/PNG

### 6.5 AI Inference
**Crop Doctor endpoints:**
- `POST /v1/crop/diagnose` — submit images for diagnosis
  - Request: `{ mediaIds: string[], cropId?, fieldId?, location?, timestamp? }`
  - Response (sync <10s): `200 { diagnosis: { disease, confidence, severity, treatment, modelVersion } }`
  - Response (async ≥10s): `202 { jobId, status: "pending" }`
- `GET /v1/crop/diagnoses` — paginated history (filter by user/farm/field/date)
- `GET /v1/crop/diagnoses/:id` — full diagnosis result

**Model versioning:** Every diagnosis records `modelVersion` to enable retraining audits.

**Disease endpoints:**
- `GET /v1/disease/risk?lat=&lon=&crop=` — risk score for location/crop
- `GET /v1/disease/outbreaks?bbox=&crop=` — outbreak heatmap data
- `GET /v1/diseases` — disease library (search, filter)
- `GET /v1/diseases/:slug` — disease details (symptoms, conditions, lifecycle, control measures)

**Spray endpoints:**
- `POST /v1/spray/recommend` — generate advisory
  - Request: `{ fieldId, cropId, target|diagnosisId, severity? }`
  - Response: `{ products: [{ active_ingredient, dose_per_ha, total_volume, window_start, window_end, phi, rei, safety_notes }]... }`
- `GET /v1/spray/windows?fieldId=` — safe application windows (weather-based)

**Soil endpoints:**
- `POST /v1/soil/profiles` — create soil profile (manual or reportMediaId)
- `POST /v1/soil/analyze` — generate recommendation
  - Request: `{ fieldId, cropId, targetYield? }`
  - Response: `{ nutrient_gaps, fertiliser_plan: [...] }`
- `GET /v1/fields/:id/soil` — soil data for field

**Satellite endpoints:**
- `POST /v1/satellite/analyses` — request index computation (async job)
  - Request: `{ fieldId, index: "ndvi"|"ndmi", from, to }`
  - Response: `202 { jobId, status }`
- `GET /v1/satellite/analyses/:id` — job status + tile URLs
- `GET /v1/fields/:id/indices?index=&from=&to=` — time-series query

### 6.6 Notifications & Events
**Notification table:**
- `GET /v1/notifications?unread=true` — paginated inbox
- `PATCH /v1/notifications/:id/read` — mark read
- `POST /v1/notifications/read-all` — bulk read

**Events (from UI webhook page, listed by name):**
- `disease.outbreak.detected`
- `spray.window.open`
- `satellite.pass.completed`
- `soil.report.ready`
- (Others to be determined)

**Webhook endpoints:**
- `GET|POST /v1/developer/webhooks` — manage subscriptions
- `POST /v1/developer/webhooks/:id/test` — send test payload
- `GET /v1/developer/webhooks/:id/deliveries` — delivery history + retry

### 6.7 Developer Platform
**API Key management:**
- `GET|POST /v1/developer/api-keys` — list keys, create new (return plaintext once)
- `DELETE /v1/developer/api-keys/:id` — revoke key
- Key structure: `{ id, name, prefix (visible), environment, scopes, lastUsed, created }`

**Usage & metering:**
- `GET /v1/developer/usage?range=&product=` — requests by product, date
- `GET /v1/developer/logs?cursor=&status=&keyId=` — structured request logs

**Organization:**
- `GET|POST /v1/developer/team` — team members + invites
- `GET /v1/billing/subscription` — current plan + usage vs quota
- `GET /v1/billing/invoices` — invoice history

**Playground:**
- `POST /v1/developer/playground/execute` — run endpoint request (sandbox isolation)

### 6.8 Admin Panel (Restricted)
**Endpoints (server-side enforcement only; no public contract):**
- `GET /v1/admin/users` — user list (pagination, filter, search)
- `PATCH /v1/admin/users/:id` — suspend, change role, etc.
- `GET /v1/admin/models` — model versions + deployment status
- `POST /v1/admin/models/:id/promote` — rollout control
- `GET /v1/admin/metrics` — platform-wide health, adoption, usage

---

## 7. Database Requirements

**Entities & Relationships (Inferred from Frontend)**

### Users & Authentication
```
users
├── id (pk)
├── email (unique, verified)
├── password_hash
├── first_name, last_name
├── phone, phone_verified
├── location
├── language, timezone, units, theme
├── organization_id (fk → organizations)
├── role (farmer|agronomist|cooperative_lead|developer|admin)
├── created_at, updated_at
└── deleted_at (soft delete)

sessions
├── id (pk)
├── user_id (fk)
├── refresh_token_hash
├── device_info (User-Agent, IP, location)
├── expires_at
└── created_at

verification_tokens
├── token_hash (unique)
├── user_id (fk)
├── type (email|password_reset)
├── expires_at
└── created_at
```

### Farms & Fields
```
organizations
├── id (pk)
├── name
├── owner_id (fk → users)
├── type (individual|cooperative|agribusiness|ngo|gov)
├── created_at, updated_at
└── deleted_at

farms
├── id (pk)
├── owner_id (fk → users)
├── organization_id (fk → organizations, nullable)
├── name
├── location (country, state, town)
├── size, size_unit (hectares|acres)
├── ownership_type
├── geom (PostGIS Point or Polygon)
├── created_at, updated_at
└── deleted_at

fields
├── id (pk)
├── farm_id (fk → farms)
├── name
├── boundary (PostGIS Polygon — GeoJSON in/out)
├── area_hectares (computed or uploaded)
├── created_at, updated_at
└── deleted_at

crop_cycles
├── id (pk)
├── field_id (fk → fields)
├── crop_id (fk → crops)
├── planting_date
├── expected_harvest_date
├── actual_harvest_date (nullable)
├── growth_stage
├── yield_target (kg/ha)
├── created_at, updated_at
└── deleted_at

crops
├── id (pk)
├── name (Maize, Rice, Cassava, Tomato, Cocoa, Yam, Sorghum, etc.)
├── scientific_name
├── growth_stages (seedling, V2, V4, VT, R1, etc.)
├── typical_cycle_days
└── created_at
```

### AI Inferences & Diagnoses
```
diagnoses
├── id (pk)
├── user_id (fk → users)
├── field_id (fk → fields, nullable)
├── crop_id (fk → crops, nullable)
├── disease_id (fk → diseases, nullable)
├── image_ids (array of mediaIds)
├── disease_name
├── confidence (0.0–1.0)
├── severity (critical|high|medium|low)
├── treatment_recommendation (text)
├── model_version
├── model_inference_time_ms
├── created_at
└── deleted_at (soft; for GDPR)

diseases
├── id (pk)
├── slug (unique)
├── name, scientific_name
├── crop_id (fk → crops)
├── symptoms (text array or jsonb)
├── conditions (temperature, humidity, rainfall ranges)
├── lifecycle (latent, infectious, recovery)
├── control_measures (cultural, chemical, biological)
├── regional_prevalence (country, season)
└── created_at, updated_at

media
├── id (pk)
├── user_id (fk → users)
├── type (crop_image|farm_photo|soil_report)
├── storage_key (S3 path)
├── mime_type
├── size_bytes
├── created_at
└── deleted_at
```

### Weather, Soil, Satellite
```
soil_profiles
├── id (pk)
├── field_id (fk → fields)
├── nitrogen_ppm, phosphorus_ppm, potassium_ppm
├── ph, organic_carbon
├── texture (sand%, silt%, clay%)
├── media_id (fk → media, if uploaded report)
├── created_at
└── deleted_at

satellite_analyses
├── id (pk)
├── field_id (fk → fields)
├── index_type (ndvi|ndmi|stress)
├── job_id (async job tracking)
├── status (pending|processing|completed|failed)
├── start_date, end_date (analysis period)
├── tiles_stored (S3 paths)
├── cloud_cover_pct
├── created_at, updated_at
└── deleted_at

weather_observations
├── id (pk)
├── field_id (fk → fields)
├── date
├── temperature_min, temperature_max, temperature_avg
├── humidity, rainfall, wind_speed
├── source (openweathermap|local_station)
├── created_at
└── deleted_at
```

### Notifications
```
notifications
├── id (pk)
├── user_id (fk → users)
├── type (alert|advisory|system)
├── event_type (disease.outbreak.detected, spray.window.open, ...)
├── title, message, detail_link
├── severity (info|warning|critical)
├── read_at (nullable)
├── channel (in_app|email|sms)
├── created_at
└── deleted_at

notification_preferences
├── id (pk)
├── user_id (fk → users)
├── event_type
├── enabled (true|false)
├── channels (array: [email, push, sms])
└── created_at, updated_at
```

### Developer Platform
```
organizations (same table, type = agribusiness|ngo|dev_partner)

api_keys
├── id (pk)
├── organization_id (fk → organizations)
├── name
├── key_hash (bcrypt or similar)
├── key_prefix (for display)
├── environment (sandbox|live)
├── scopes (array: [crop, disease, satellite, soil, spray, ai])
├── rate_limit_rps (requests per second)
├── quota_monthly (requests per month)
├── last_used_at
├── created_at, expires_at, revoked_at
└── deleted_at

api_logs
├── id (pk)
├── key_id (fk → api_keys)
├── endpoint (path)
├── method (GET|POST|etc.)
├── status_code
├── latency_ms
├── request_id
├── occurred_at

webhooks
├── id (pk)
├── organization_id (fk → organizations)
├── endpoint_url
├── events (array: [disease.outbreak.detected, ...])
├── signing_secret
├── active (true|false)
├── created_at, updated_at
└── deleted_at

webhook_deliveries
├── id (pk)
├── webhook_id (fk → webhooks)
├── event_type
├── payload_hash
├── status_code
├── attempt_count
├── next_retry_at (nullable)
├── delivered_at (nullable)
└── occurred_at
```

### Audit & Admin
```
activity_logs
├── id (pk)
├── user_id (fk → users)
├── action (login, logout, farm_created, diagnosis_run, etc.)
├── resource_type, resource_id
├── changes (jsonb before/after)
├── ip_address, user_agent
└── occurred_at

subscriptions (for billing / feature access)
├── id (pk)
├── organization_id (fk → organizations)
├── plan (free|starter|pro|enterprise)
├── status (active|cancelled|suspended)
├── billing_cycle_start, billing_cycle_end
├── features (array: [crop_doctor, satellite, soil, ...])
├── monthly_request_quota
├── created_at, updated_at
└── deleted_at
```

---

## 8. Entity Relationships — Logical Map

```
User
 ├─ owns: Farms (1:N)
 │   ├─ has: Fields (1:N)
 │   │   ├─ contains: CropCycles (1:N)
 │   │   │   └─ references: Crops (N:1)
 │   │   ├─ has: SoilProfiles (1:N)
 │   │   ├─ has: SatelliteAnalyses (1:N)
 │   │   └─ has: WeatherObservations (1:N)
 │   └─ receives: Diagnoses (1:N)
 │
 ├─ belongs to: Organization (N:1, optional)
 │   ├─ has: Members (1:N)
 │   ├─ owns: Farms (shared: 1:N)
 │   ├─ has: APIKeys (1:N)
 │   └─ has: Webhooks (1:N)
 │
 ├─ receives: Notifications (1:N)
 │   └─ references: Events (N:1)
 │
 ├─ has: Sessions (1:N)
 ├─ has: NotificationPreferences (1:N)
 └─ has: ActivityLogs (1:N)

Diagnosis
 ├─ references: Disease (N:1)
 ├─ references: Field (N:1)
 ├─ references: Crop (N:1)
 └─ references: Media (N:1)

Disease
 ├─ affects: Crops (N:N via disease_crops junction)
 └─ has: RegionalPrevalence (1:N)
```

---

## 9. API Specification — Proposed Endpoints

**Base URL:** `{VITE_API_BASE_URL}/v1` (e.g., `https://api.avrum.ai/v1`)  
**Auth:** Bearer token in `Authorization: Bearer <access_token>`  
**Error format:**
```json
{
  "error": {
    "code": "validation_error|unauthenticated|forbidden|not_found|conflict|rate_limited|internal_error",
    "message": "Human-readable description",
    "details": [{ "field": "email", "message": "Email is required" }],
    "requestId": "req_01J..."
  }
}
```

### Auth Endpoints
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | Create account | None | `{ fullName, organisation?, email, password }` | `201 { user, requiresVerification: true }` |
| `POST` | `/auth/verify-email` | Confirm email | None | `{ email, code }` | `200 { accessToken, refreshToken, user }` |
| `POST` | `/auth/login` | Sign in | None | `{ email, password, remember? }` | `200 { accessToken, refreshToken, user }` |
| `POST` | `/auth/refresh` | Rotate tokens | refresh token | `{ refreshToken }` | `200 { accessToken, refreshToken }` |
| `POST` | `/auth/logout` | Revoke session | access token | — | `204` |
| `POST` | `/auth/forgot-password` | Send reset link | None | `{ email }` | `204` (always, to prevent enum) |
| `POST` | `/auth/reset-password` | Set new password | Reset token | `{ token, password, confirmPassword }` | `204` |

### User / Profile
| Method | Path | Purpose | Auth | Response |
|---|---|---|---|---|
| `GET` | `/me` | Fetch current user | access | User object (name, email, org, prefs) |
| `PATCH` | `/me` | Update profile | access | Updated user object |
| `POST` | `/me/password` | Change password | access | `204` |
| `GET` | `/me/sessions` | List active sessions | access | `{ sessions: [...] }` |
| `DELETE` | `/me/sessions/:id` | Logout device | access | `204` |
| `GET\|PUT` | `/me/preferences` | Language, units, theme | access | Preferences object |
| `GET` | `/me/activity` | Audit log | access | Paginated activity entries |

### Farms & Fields
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `GET` | `/farms` | List user's farms | access | — | `{ data: [farm...], page }` |
| `POST` | `/farms` | Create farm | access | `{ name, location, size, sizeUnit, ownershipType }` | `201 { id, name, ... }` |
| `GET` | `/farms/:id` | Farm details | access | — | Farm object |
| `PATCH` | `/farms/:id` | Update farm | access | Partial farm object | Updated farm |
| `DELETE` | `/farms/:id` | Delete farm | access | — | `204` |
| `GET` | `/farms/:id/fields` | List fields | access | — | `{ data: [field...], page }` |
| `POST` | `/farms/:id/fields` | Create field | access | `{ name, boundary (GeoJSON) }` | `201 field` |
| `PATCH` | `/fields/:id` | Update field | access | Partial field | Updated field |
| `DELETE` | `/fields/:id` | Delete field | access | — | `204` |
| `GET` | `/fields/:id` | Field details | access | — | Field + crops + soil + satellite history |
| `GET` | `/crops` | List crops (reference) | access | — | `{ data: [crop...] }` |
| `GET\|POST` | `/crop-cycles` | Manage plantings | access | — | Crop cycle objects |

### Media Upload
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/uploads/sign` | Get presigned URL | access | `{ kind, mime, bytes }` | `{ uploadUrl, mediaId }` |

### Crop Doctor / Diagnosis
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/crop/diagnose` | Run inference | access | `{ mediaIds[], cropId?, fieldId?, location? }` | `200 diagnosis` or `202 { jobId }` |
| `GET` | `/crop/diagnoses` | History | access | `?cursor=&limit=50&fieldId=&dateFrom=&dateTo=` | `{ data: [diagnosis...], page }` |
| `GET` | `/crop/diagnoses/:id` | Diagnosis details | access | — | Diagnosis with model version + confidence |

### Disease Intelligence
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `GET` | `/disease/risk` | Risk score | access | `?lat=&lon=&crop=` | `{ risk: 0–1, confidence, factors: [...] }` |
| `GET` | `/disease/outbreaks` | Heatmap data | access | `?bbox=minLon,minLat,maxLon,maxLat&crop=` | `{ features: [GeoJSON], intensities: [...] }` |
| `GET` | `/disease/outbreaks/:id` | Outbreak details | access | — | Outbreak object + affected regions + control measures |
| `GET` | `/diseases` | Disease library (search) | access | `?query=&crop=&limit=20` | `{ data: [disease...], page }` |
| `GET` | `/diseases/:slug` | Disease details | access | — | Disease object (symptoms, conditions, lifecycle, controls) |

### Spray Recommendation
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/spray/recommend` | Generate advisory | access | `{ fieldId, cropId, target or diagnosisId, severity? }` | `{ products: [...], window: { start, end }, safety: [...] }` |
| `GET` | `/spray/windows` | Safe application times | access | `?fieldId=&days=14` | `{ windows: [{ start, end, confidence }...] }` |

### Satellite Monitoring
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/satellite/analyses` | Request analysis | access | `{ fieldId, index, from, to }` | `202 { jobId, status: "pending" }` |
| `GET` | `/satellite/analyses/:id` | Job status | access | — | `{ status, tiles: [...], error? }` |
| `GET` | `/fields/:id/indices` | Time series | access | `?index=ndvi&from=&to=` | `{ series: [{ date, value, cloudCover }...] }` |

### Soil Intelligence
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/soil/profiles` | Create profile | access | `{ fieldId, n_ppm, p_ppm, k_ppm, ph, ... or mediaId }` | `201 profile` |
| `POST` | `/soil/analyze` | Get recommendation | access | `{ fieldId, cropId, targetYield? }` | `{ gaps, fertilizer_plan: [...] }` |
| `GET` | `/fields/:id/soil` | Soil data for field | access | — | Soil profile + recommendations |

### Notifications
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `GET` | `/notifications` | Inbox | access | `?unread=true&limit=20&cursor=` | `{ data: [notification...], page }` |
| `PATCH` | `/notifications/:id/read` | Mark read | access | — | `200 notification` |
| `POST` | `/notifications/read-all` | Mark all read | access | — | `204` |

### Developer Platform (API Key holders)
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `GET` | `/developer/summary` | Dashboard overview | access | — | `{ org, plan, usage, quota }` |
| `GET\|POST` | `/developer/api-keys` | Manage keys | access | `POST { name, environment, scopes }` | Keys (plaintext once) or list |
| `DELETE` | `/developer/api-keys/:id` | Revoke key | access | — | `204` |
| `GET` | `/developer/usage` | Metrics | access | `?range=month&product=crop-intelligence` | `{ total, perProduct, quota }` |
| `GET` | `/developer/logs` | Request logs | access | `?cursor=&status=&keyId=&limit=100` | `{ data: [log...], page }` |
| `GET\|POST` | `/developer/webhooks` | Event subscriptions | access | `POST { url, events }` | Webhook objects |
| `POST` | `/developer/webhooks/:id/test` | Test webhook | access | — | `{ status, payload, response }` |
| `GET` | `/developer/webhooks/:id/deliveries` | Delivery history | access | — | `{ data: [delivery...], page }` |
| `GET` | `/organizations/:id/members` | Team | access | — | `{ data: [member...] }` |
| `GET` | `/billing/subscription` | Plan info | access | — | `{ plan, usage, quota, renews_at }` |
| `GET` | `/billing/invoices` | Invoice history | access | — | `{ data: [invoice...], page }` |

### Playground (Sandbox Execution)
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `POST` | `/developer/playground/execute` | Run endpoint | access + API key | `{ method, path, body?, headers? }` | `{ status, body, latency_ms }` |

### Admin (Restricted)
| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| `GET` | `/admin/users` | User list | admin | `?query=&limit=50&cursor=` | `{ data: [user...], page }` |
| `PATCH` | `/admin/users/:id` | User management | admin | `{ role?, suspended? }` | Updated user |
| `GET` | `/admin/models` | Model versions | admin | — | `{ data: [model...] }` |
| `POST` | `/admin/models/:id/promote` | Rollout | admin | `{ version, percentage }` | `204` |
| `GET` | `/admin/metrics` | Platform health | admin | — | `{ dau, mau, inferences, errors, latency_p95 }` |

---

## 10. Authentication & Authorization

### Login Flow (from Frontend)
1. User navigates to `/sign-in`
2. Enters email + password
3. Frontend submits to `POST /auth/login`
4. Backend returns `{ accessToken, refreshToken, user }`
5. Frontend stores refresh token (httpOnly cookie recommended)
6. Frontend stores access token (memory or httpOnly)
7. Frontend redirects to `/dashboard`

### Registration Flow (from Frontend)
1. User navigates to `/sign-up`
2. Enters fullName, organisation (optional), email, password, accept terms
3. Frontend submits to `POST /auth/register`
4. Backend creates user, sends OTP to email, returns `{ user, requiresVerification: true }`
5. Frontend redirects to `/verify-email?email=...`
6. User confirms email via `POST /auth/verify-email` with OTP code
7. Backend returns `{ accessToken, refreshToken, user }`
8. Frontend redirects to `/dashboard`

### Token Management
- **Access token:** Short-lived (~15 min), stored in memory or httpOnly cookie
- **Refresh token:** Long-lived (~30 days), stored in httpOnly cookie, rotating
- **On 401 token_expired:** Refresh once and retry; if refresh fails, redirect to `/sign-in`
- **On 403 forbidden:** User lacks permission (authorization check failed)

### Protected Routes
- `/_app/*` — Requires `access` token; must redirect to `/sign-in` if missing/invalid
- `/_dev/developer/*` — Requires `access` token + `role:developer|admin`
- `/admin` — Requires `access` token + `role:admin`
- `/` and `/onboarding` — Public
- `/_auth/*` — Public (or 302 redirect to `/dashboard` if already authenticated)

### Authorization
- **Farm access:** User must own farm or be organization member
- **Field access:** Transitive through farm ownership
- **Organization membership:** User can only access orgs they belong to
- **Developer scopes:** API key restricts which endpoints are callable
- **Admin:** Only users with role=admin can access `/admin` and `/v1/admin/*`

**Enforcement:** Server-side in every handler; frontend UI hints (hiding elements) should not be trusted.

---

## 11. File Upload Requirements

### Crop Images (AI Crop Doctor)
- **Source:** `/crop-doctor` → `UploadZone` (currently non-functional)
- **Expected types:** JPG, PNG
- **Size limit:** ≤10 MB (UI constraint)
- **Handling:** Two-phase (sign + PUT)
  1. `POST /v1/uploads/sign` → `{ kind: "crop_image", mime: "image/jpeg", bytes: 1048576 }`
  2. Response: `{ uploadUrl: "https://s3.aws.com/...", mediaId: "med_01J..." }`
  3. Frontend: `PUT uploadUrl` with image data
  4. Backend: Store mediaId reference in database
- **Usage:** Passed to `/v1/crop/diagnose` as `mediaIds: ["med_01J..."]`

### Soil Reports
- **Source:** `/soil-intelligence` → Upload button
- **Expected types:** PDF, JPG, PNG
- **Size limit:** ≤10 MB (inferred)
- **Handling:** Same two-phase flow with `kind: "soil_report"`
- **Backend processing:** Optional OCR to extract N-P-K/pH/OC values

### Farm / Profile Photos
- **Source:** `/profile/edit` (implied)
- **Expected types:** JPG, PNG
- **Size limit:** ≤5 MB (inferred)
- **Handling:** Two-phase with `kind: "farm_photo"`

### No multipart/form-data
The API should NOT accept multipart uploads directly. Always use presigned S3 URLs for files >1 MB.

---

## 12. AI / ML Requirements

### 12.1 Crop Disease Classification
**Frontend representation:** `/crop-doctor` page with upload + diagnosis card  
**What the frontend shows:**
- Confidence score (0–1, displayed as percentage)
- Severity band (critical/high/medium/low, color-coded)
- Treatment recommendation (text)
- Disease name
- Link to spray recommendation (implied)

**Backend must provide:**
- Image classification model (or API to external service)
- Per-crop disease taxonomy
- Confidence calibration (not just softmax)
- Severity scoring (lesion area heuristic or regressor)
- Unknown/low-confidence rejection path (UI implies flagging for agronomist review)

**Model versioning:** Every diagnosis records `modelVersion` to enable retraining + feedback loops.

**Inference latency SLA:**
- Sync response if <10 seconds
- Async (job) response if ≥10 seconds
- UI expects immediate feedback or visible "processing" state

### 12.2 Disease Risk Forecasting
**Frontend representation:** `/disease-intelligence` outbreak map  
**What the frontend shows:**
- Heatmap of risk intensity by region
- Active outbreak signals near user's fields
- Disease library with symptoms, conditions, controls

**Backend must provide:**
- Geospatial aggregation of reported diagnoses
- Weather integration (temperature, humidity, rainfall)
- Disease lifecycle modeling (latent → infectious → recovery)
- Regional prevalence data
- Seasonal risk curves

**Implementation options:**
- Rules-based: agro-climatic thresholds per pathogen
- ML: gradient-boosted model on historical outbreak labels
- Hybrid: rules + diagnosis density + weather scoring

### 12.3 Spray Recommendation Rules
**Frontend representation:** `/spray-recommendation` with product + dosage + window  
**What the frontend shows:**
- Recommended product(s) with active ingredient
- Dose per hectare + total volume for field
- Safe application window (date/time range)
- Pre-harvest interval (PHI) + re-entry interval (REI)
- Mixing/safety notes

**Backend must provide:**
- Product catalogue (country-specific, registered formulations)
- Dosage rules per (crop, growth stage, target pest/disease, field size)
- Weather window scoring (wind <20 km/h, no rain 4h post-spray, temp 15–30°C)
- PHI/REI lookups (days to harvest, days before human entry)
- Mixer compatibility rules

**Critical:** Spray advice carries regulatory liability. Requires legal review + clear disclaimer.

### 12.4 Satellite Index Processing
**Frontend representation:** `/satellite-monitoring` with NDVI/NDMI layers  
**What the frontend shows:**
- Current vegetation index (NDVI, NDMI) as raster overlay
- Historical time series (graph or slider)
- Anomaly flags (flood, drought, stress)

**Backend must provide:**
- Google Earth Engine integration (Sentinel-2 or Landsat)
- Async job pipeline (analysis takes minutes to hours)
- Index calculation (NDVI, NDMI, stress ratios)
- Cloud-cover filtering
- Tile generation + S3 storage
- Time-series queryable by date

**Blocker:** Frontend has no map library; boundary drawing is missing.

### 12.5 Soil Analysis
**Frontend representation:** `/soil-intelligence` with upload + nutrient gap table  
**What the frontend shows:**
- Nutrient balance (N, P, K, pH, OC %)
- Gap analysis (current vs. target for crop)
- Fertiliser plan (products, rates, split timing)

**Backend must provide:**
- Soil profile table (manual entry or lab report OCR)
- Fallback soil estimates (iSDAsoil API or SoilGrids)
- Crop-specific nutrient targets (literature + local expertise)
- Fertiliser recommendation rules (NPK balance, solubility, cost)
- Irrigation guidance (water holding capacity, infiltration)

### 12.6 Agronomy LLM (Optional, UI hints at future)
**Frontend representation:** Implied but not yet UI; help center mentions "Talk to an agronomist"  
**What might be needed:** Natural language Q&A about crop management, disease identification, spray safety.

**Backend decision required:** Provider (OpenAI, Anthropic, local model), cost ceiling, data residency.

---

## 13. External Integrations & Services

### 13.1 Email / Transactional
**Needed for:**
- Account verification (OTP or link)
- Password reset link
- Notifications (disease alerts, spray windows, satellite updates)
- Invoice delivery (billing)

**Required service:** SendGrid, AWS SES, Postmark, or similar  
**Configuration:** `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM` address

### 13.2 Weather Data
**Needed for:**
- Current + forecast weather at farm location
- Spray window calculation (wind, rain, temperature, humidity)
- Disease risk scoring (optimal conditions for pathogen)

**Options:**
- OpenWeatherMap API (free tier available)
- ECMWF (professional)
- Local weather stations (Nigeria Meteorological Agency)

**Configuration:** `OPENWEATHER_API_KEY` or equivalent

### 13.3 Satellite Imagery
**Needed for:**
- Field-level NDVI, NDMI, stress indices
- Time-series monitoring
- Cloud-cover filtering

**Options:**
- Google Earth Engine (ServiceAccount auth, billed separately)
- Sentinel Hub (ESA, commercial licensing required)
- USGS Earth Explorer (free Landsat/Sentinel-2, slower)

**Configuration:** `GEE_SERVICE_ACCOUNT_EMAIL`, `GEE_PRIVATE_KEY` (for Earth Engine)  
**Blocker:** Requires field boundary polygons, which are blocked by lack of map UI component.

### 13.4 Payment / Billing
**Needed for:**
- Plan subscription (free, starter, pro, enterprise)
- Invoice generation
- Quota enforcement

**Options:**
- Stripe (global, complex)
- Paystack (Africa-optimized)
- Flutterwave (Africa-optimized)
- None (MVP can skip billing)

**Backend decision required before implementing `/developer/billing` or subscription features.

### 13.5 Object Storage
**Needed for:**
- Crop image storage (crop_*.jpg)
- Soil report PDF/images
- Farm photos
- Satellite tiles
- Invoices (PDF)

**Implementation:** AWS S3 (or compatible: Minio, DigitalOcean Spaces)  
**Configuration:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`

### 13.6 Error Reporting / Observability
**Needed for:**
- Frontend error capture (Sentry DSN already in env)
- Backend logs + monitoring
- Request tracing

**Configuration:** `SENTRY_DSN`, `LOG_LEVEL`, structured logging to CloudWatch/Datadog/ELK

### 13.7 Authentication (OAuth, optional)
**Frontend shows OAuth buttons** (Google, Apple implied but no text)  
**Backend decision required:** Which providers? How to map to users/orgs?  
**Configuration:** `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, etc.

---

## 14. Mock Data & Hardcoded Values — What Must Become Dynamic

### 14.1 User Profile (`src/lib/profile.ts`)
**Current:**
```typescript
export const currentProfile = {
  firstName: "Adeola",
  lastName: "Daramola",
  role: "Agronomy Lead",
  organisation: "Sunrise Agro Cooperative",
  email: "adeola.daramola@sunriseagro.com",
  phone: "+234 800 000 0000",
  location: "Ibadan, Oyo State, Nigeria",
  language: "English",
  timezone: "Africa/Lagos (GMT+1)",
  memberSince: "March 2026",
  bio: "Leading agronomy...",
};
```
**Required:** `GET /v1/me` endpoint returns real user data.

### 14.2 Dashboard Stats
**Current:** StatCards show hardcoded 0 active farms, "—" for crop health, satellite passes, spray windows.  
**Required:** `GET /v1/dashboard` returns aggregated stats:
- Farm count
- Crop health index (0–100)
- Next satellite pass date
- Next spray window

### 14.3 API Developer Data (`src/lib/developer.ts`)
**Current:**
- 6 API products with hardcoded status (stable/beta/preview)
- 4 hardcoded API keys with fake prefixes
- Mock usage stats (128,400 crop requests, etc.)
- Empty team/billing/webhooks

**Required:**
- `GET /v1/developer/api-keys` returns real keys
- `GET /v1/developer/usage` returns real metrics
- `GET /v1/developer/webhooks` returns real subscriptions
- `GET /v1/billing/subscription` returns plan info

### 14.4 Onboarding Draft (`src/routes/onboarding.tsx`)
**Current:** Form state is local; lost on page reload.  
**Required:** 
- `POST /v1/onboarding/draft` to persist as user types (auto-save)
- `POST /v1/onboarding/complete` to atomically create User + Farm + Field + Preferences

### 14.5 Security Logs (`src/routes/_app.profile.security.tsx`)
**Current:** 3 hardcoded sessions shown (Chrome/MacBook, Mobile/Android, Safari/iPad).  
**Required:** `GET /v1/me/sessions` returns real active sessions.

### 14.6 Developer Logs Page
**Current:** Mock rows duplicated to fill space.  
**Required:** `GET /v1/developer/logs` with cursor pagination + filtering.

### 14.7 Notifications (Empty Everywhere)
**Current:** All notification endpoints return empty states.  
**Required:** Real notification system with events, delivery, preferences.

### 14.8 Crops (Hardcoded in Onboarding)
**Current:** List in UI: Maize, Rice, Cassava, Tomato, Cocoa, Yam, Sorghum, Soybean, Pepper, Groundnut, Wheat, Plantain.  
**Required:** `GET /v1/crops` returns full crop database with growth stages, typical cycle length, supported regions.

---

## 15. Frontend → Backend Data Flows — Major Workflows

### Flow 1: Registration & Email Verification
```
User enters signup form
  ↓
POST /auth/register (fullName, organisation, email, password)
  ↓
Backend: hash password, create user, send OTP email
  ↓
Response: 201 { user, requiresVerification: true }
  ↓
Frontend: redirect to /verify-email?email=...
  ↓
User enters OTP / clicks link
  ↓
POST /auth/verify-email (email, code)
  ↓
Backend: check OTP, mark email verified, create session, issue tokens
  ↓
Response: 200 { accessToken, refreshToken, user }
  ↓
Frontend: store tokens, redirect to /onboarding (or /dashboard if skipped)
```

### Flow 2: Onboarding → Create Farm
```
User at /onboarding, starts wizard
  ↓
Step 1–10: User fills user type, personal, farm, crops, boundary, location, language, alerts
  ↓
Each step: Auto-save via POST /v1/onboarding/draft { step, data }
  (Response: 200 { draftId, savedAt } — used by AutosaveIndicator)
  ↓
Step 11 (Finish): POST /v1/onboarding/complete { draft }
  ↓
Backend: Atomically create User, Farm, Field (GeoJSON), CropCycles, NotificationPreferences
  ↓
Response: 201 { farm, field, user }
  ↓
Frontend: redirect to /dashboard
```

### Flow 3: Crop Doctor Diagnosis
```
User at /crop-doctor, selects image file(s)
  ↓
POST /v1/uploads/sign { kind: "crop_image", mime: "image/jpeg", bytes: 5000000 }
  ↓
Backend: Generate presigned S3 URL, store mediaId reference
  ↓
Response: 200 { uploadUrl, mediaId }
  ↓
Frontend: PUT image data to uploadUrl
  ↓
POST /v1/crop/diagnose { mediaIds: ["med_01J..."], fieldId?, cropId? }
  ↓
Backend: Dispatch to AI service OR enqueue async job
  - If <10s: invoke in-process, return diagnosis
  - If ≥10s: enqueue, return 202 { jobId, status: "pending" }
  ↓
(For async) Frontend: Poll GET /v1/crop/diagnose/jobs/:jobId until completed
  ↓
Backend: AI service processes image, returns { disease, confidence, severity, treatment, modelVersion }
  ↓
Backend: Store diagnosis in DB, emit disease.outbreak.detected webhook (if confidence high)
  ↓
Response: 200 { diagnosis }
  ↓
Frontend: Display diagnosis card with confidence, severity, treatment
  ↓
User clicks "View spray options": Navigate to /spray-recommendation?diagnosisId=...
```

### Flow 4: Satellite Analysis Request
```
User at /satellite-monitoring, draws field boundary (requires map UI)
  ↓
User clicks "Refresh imagery" for NDVI past 30 days
  ↓
POST /v1/satellite/analyses { fieldId, index: "ndvi", from: "2026-08-01", to: "2026-08-30" }
  ↓
Backend: Enqueue async job (GEE/Sentinel Hub analysis takes minutes)
  ↓
Response: 202 { jobId, status: "pending" }
  ↓
Frontend: Show loading state, poll GET /v1/satellite/analyses/:jobId
  ↓
Backend: Query GEE/Sentinel, compute NDVI tiles, upload to S3, store paths
  ↓
Backend: Update job status to "completed", emit satellite.pass.completed webhook
  ↓
Frontend: Receive completed status, fetch tiles, render NDVI layer on map
  ↓
User can view time-series: GET /v1/fields/:fieldId/indices?index=ndvi&from=2026-08-01&to=2026-08-30
```

### Flow 5: Disease Alert Notification
```
Backend: Scheduled risk recomputation (e.g., daily at 6 AM)
  ↓
Backend: Aggregate diagnoses + weather for each region
  ↓
Backend: Compute disease risk, cross-check thresholds
  ↓
Risk >threshold: Create notification record
  ↓
Backend: Emit disease.outbreak.detected webhook → external systems
  ↓
Backend: Dispatch email/SMS to users in affected regions
  ↓
Frontend: User sees red badge on /notifications
  ↓
GET /v1/notifications?unread=true → inbox populated
  ↓
PATCH /v1/notifications/:id/read → mark as read
```

### Flow 6: API Key Usage Metering
```
External developer calls: GET /v1/crop/analyze (using API key in header)
  ↓
Backend Gateway: Extract API key, look up scopes + rate limits
  ↓
Backend: Increment request counter for key + product + hour/month
  ↓
Backend: Check quota; if exceeded, return 429 quota_exceeded
  ↓
Backend: Process request, log status/latency
  ↓
Frontend Developer Console: GET /v1/developer/usage returns aggregated stats
  ↓
Developer sees "128,400 requests this month (of 750,000 included)"
```

---

## 16. State Management

### What Should Be Server State (Backend)
- User profile (name, email, phone, org, preferences)
- Farm & field data (geometries, crop cycles)
- Diagnoses & inference history
- Notifications (read status, delivery status)
- API keys & webhooks
- Subscription/billing
- Organization membership
- Activity logs

### What Can Be Client State (Frontend)
- UI state (modal open/closed, selected tab, filter values, sort order)
- Form drafts (before submission)
- Cached query results (TanStack Query)
- Theme preference (light/dark, but also persisted on backend)
- Temporary selections (selected farm for dropdown)

### State Management (Planned but Not Yet Implemented)
**Library:** TanStack React Query v5 (in package.json but unused)  
**Pattern:**
- `useQuery` for fetching data from API
- `useMutation` for POST/PATCH/DELETE operations
- Cache invalidation on mutation success
- Automatic refetch on focus/interval
- Offline-first queueing (future, for PWA mode)

**Example (not yet in code):**
```typescript
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: () => fetch("VITE_API_BASE_URL/v1/me").then(r => r.json()),
});

const { mutate: updateProfile } = useMutation({
  mutationFn: (data) => fetch("VITE_API_BASE_URL/v1/me", { method: "PATCH", body: JSON.stringify(data) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
});
```

---

## 17. Error & Loading States

### Expected HTTP Status Codes
- `200 OK` — Success, body contains result
- `201 Created` — Resource created
- `202 Accepted` — Async job enqueued (return jobId)
- `204 No Content` — Success, no body
- `400 Bad Request` — Malformed request or validation error
- `401 Unauthorized` — Missing or invalid auth
- `403 Forbidden` — User lacks permission
- `404 Not Found` — Resource doesn't exist
- `409 Conflict` — Email already taken, etc.
- `422 Unprocessable Entity` — Validation error with field details
- `429 Too Many Requests` — Rate limited or quota exceeded
- `500 Internal Server Error` — Backend error

### Error Response Format (Confirmed from Frontend Error Handling)
```json
{
  "error": {
    "code": "validation_error|unauthenticated|forbidden|not_found|conflict|rate_limited|internal_error",
    "message": "Human-readable description",
    "details": [
      { "field": "email", "message": "Email is required" },
      { "field": "password", "message": "Use at least 8 characters" }
    ],
    "requestId": "req_01J..."
  }
}
```

### Loading States (Frontend Implementation)
- **Buttons:** `variant="..." loading` prop shows spinner
- **Forms:** Disable inputs while submitting
- **Lists:** Show skeleton/shimmer until data arrives
- **Maps:** Show placeholder until tiles load
- **Async jobs:** Poll endpoint, show progress indicator

**Backend must handle:**
- Graceful timeout (don't let request hang >30s)
- Clear error messages (not generic "Server error")
- Partial results (e.g., if satellite tiles partially failed)

### Empty States (Frontend Shows Everywhere)
- No farms yet → "Add your first farm"
- No diagnoses → "Upload a crop image"
- No satellite data → "Add a field boundary"
- No notifications → "You're all caught up"

**Backend must return:**
- Empty arrays `[]` (not null or undefined)
- Count of 0 (not missing field)
- Pagination metadata even if no results

---

## 18. Security Requirements

### Authentication
- ✅ Passwords hashed (bcrypt or argon2, salt rounds ≥12)
- ✅ Password requirements enforced (8–72 chars, complexity optional)
- ✅ Session tokens short-lived (15 min access, 30 day refresh)
- ✅ Refresh token rotation (issue new token on each refresh)
- ✅ Logout revokes session
- ✅ MFA optional (UI ready, backend to implement)

### Authorization
- ✅ Cross-tenant data isolation (user cannot query other user's farms)
- ✅ Farm ownership checked on every operation
- ✅ API key scopes restrict endpoints
- ✅ Admin-only routes reject non-admins
- ✅ Organization membership verified for shared farms
- **Testing:** Cross-tenant tests must exist and fail if isolation breaks

### Data Protection
- ✅ Passwords never logged or displayed
- ✅ API keys never logged in plaintext
- ✅ Sensitive responses (email, phone) only to authorized user
- ✅ GDPR data export available (implied by UI)
- ✅ Soft deletion (don't physically remove user/farm data; mark deleted_at)
- ✅ Data retention policy documented (how long to keep deleted data?)

### API Security
- ✅ HTTPS enforced (no HTTP in production)
- ✅ CORS configured (allow frontend domain only)
- ✅ Rate limiting (prevent brute-force, DoS)
- ✅ Request validation (Zod schemas on backend too)
- ✅ Input sanitization (prevent SQL injection, XSS in echoed data)
- ✅ Webhook payloads signed (HMAC, include signature in header)
- ✅ Idempotency keys on POSTs creating resources (prevent double-charge if retry)

### Audit & Compliance
- ✅ Activity log (who did what, when) — `/v1/me/activity` endpoint
- ✅ Session log (login/logout, IP, device)
- ✅ Webhook delivery log (for debugging + audit)
- ✅ Agronomic advice disclaimer (not a substitute for professional advice)
- ✅ Data residency (comply with Nigeria/Africa regulations if applicable)

---

## 19. Recommended Backend Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts (PostgreSQL + PostGIS)
│   │   ├── queue.ts (BullMQ or similar)
│   │   ├── cache.ts (Redis)
│   │   ├── storage.ts (S3 client)
│   │   └── env.ts (environment variables, validation)
│   │
│   ├── middleware/
│   │   ├── auth.ts (Bearer token extraction + verification)
│   │   ├── errors.ts (error normalization + envelope)
│   │   ├── validation.ts (Zod body/query parsing)
│   │   ├── rateLimit.ts (token bucket or leaky bucket)
│   │   ├── logging.ts (structured logging)
│   │   └── cors.ts (origin whitelist)
│   │
│   ├── controllers/ (or routes/ → handlers/)
│   │   ├── auth.ts (register, login, verify, refresh, logout, forgot, reset)
│   │   ├── profile.ts (GET/PATCH /me, sessions, preferences, activity)
│   │   ├── farms.ts (farm CRUD, fields, crop cycles)
│   │   ├── upload.ts (presigned S3 URLs)
│   │   ├── diagnosis.ts (crop doctor endpoints)
│   │   ├── disease.ts (outbreak map, library)
│   │   ├── spray.ts (recommendations)
│   │   ├── satellite.ts (async analysis job orchestration)
│   │   ├── soil.ts (profiles, analysis)
│   │   ├── notifications.ts (inbox, preferences)
│   │   ├── developer.ts (API keys, usage, webhooks, logs)
│   │   ├── billing.ts (subscription, invoices)
│   │   └── admin.ts (restricted console)
│   │
│   ├── services/ (business logic, reusable)
│   │   ├── AuthService.ts (token generation, verification)
│   │   ├── UserService.ts (CRUD, profile updates)
│   │   ├── FarmService.ts (CRUD with PostGIS geometry)
│   │   ├── InferenceService.ts (dispatch to AI backend)
│   │   ├── DiseaseRiskService.ts (aggregation, risk scoring)
│   │   ├── SprayAdvisoryService.ts (dosage rules)
│   │   ├── SatelliteService.ts (GEE orchestration)
│   │   ├── SoilService.ts (analysis, recommendations)
│   │   ├── NotificationService.ts (dispatch, preferences)
│   │   ├── ApiKeyService.ts (CRUD, hashing)
│   │   ├── WebhookService.ts (signing, delivery, retry)
│   │   ├── EmailService.ts (SendGrid wrapper)
│   │   └── MeteringService.ts (quota tracking)
│   │
│   ├── repositories/ (data access layer, queries)
│   │   ├── UserRepository.ts
│   │   ├── FarmRepository.ts (PostGIS queries)
│   │   ├── DiagnosisRepository.ts
│   │   ├── NotificationRepository.ts
│   │   └── ... (one per entity)
│   │
│   ├── jobs/ (background workers)
│   │   ├── diagnoseWorker.ts (process image diagnosis jobs)
│   │   ├── satelliteWorker.ts (GEE analysis)
│   │   ├── diseaseRiskWorker.ts (scheduled risk recomputation)
│   │   ├── notificationWorker.ts (dispatch emails/SMS)
│   │   ├── webhookWorker.ts (retry failed deliveries)
│   │   └── cleanupWorker.ts (prune old logs, soft-deleted records)
│   │
│   ├── integrations/ (external APIs)
│   │   ├── openweather.ts
│   │   ├── earthengine.ts (or sentinelhub.ts)
│   │   ├── sendgrid.ts
│   │   ├── stripe.ts (or paystack.ts, once chosen)
│   │   └── sentry.ts
│   │
│   ├── validators/ (Zod schemas)
│   │   ├── auth.ts (reuse from frontend)
│   │   ├── farm.ts
│   │   ├── diagnosis.ts
│   │   └── ... (one per domain)
│   │
│   ├── types/ (TypeScript interfaces)
│   │   ├── user.ts
│   │   ├── farm.ts
│   │   ├── diagnosis.ts
│   │   ├── api.ts (request/response shapes)
│   │   └── ... (one per domain)
│   │
│   ├── utils/ (helpers)
│   │   ├── jwt.ts (sign/verify tokens)
│   │   ├── crypto.ts (hashing, random ID generation)
│   │   ├── geojson.ts (PostGIS helpers)
│   │   ├── errors.ts (custom error classes)
│   │   ├── logger.ts (structured logging)
│   │   └── pagination.ts (cursor-based helpers)
│   │
│   └── app.ts (Express setup, route mounting, global middleware)
│
├── migrations/ (node-pg-migrate or typeorm)
│   ├── 001_create_users_table.ts
│   ├── 002_enable_postgis.ts
│   ├── 003_create_farms_table.ts
│   ├── 004_create_diagnoses_table.ts
│   └── ...
│
├── seeds/ (reference data)
│   ├── crops.ts (hardcoded crop list)
│   ├── diseases.ts (disease library)
│   └── regions.ts (geographic data)
│
├── tests/
│   ├── unit/ (service, repository tests)
│   ├── integration/ (controller tests with real DB)
│   ├── e2e/ (full workflow tests)
│   └── fixtures/ (test data)
│
├── docker-compose.yml (Postgres/PostGIS, Redis)
├── .env.example (configuration template)
├── package.json
├── tsconfig.json
├── eslint.config.js
├── jest.config.js (or vitest)
└── README.md
```

**Key principles:**
- Modular services (each domain has a service, not monolithic)
- Data access layer (repositories insulate controllers from SQL)
- Background jobs for long-running work (async inference, satellite, webhooks)
- Middleware chain for cross-cutting concerns (auth, validation, errors, logging, rate limiting)
- Validator schemas for all inputs (Zod; reuse from frontend)
- Custom error classes (AuthError, ValidationError, NotFoundError, etc.)
- Structured logging with request IDs for tracing
- One database transaction per user-initiated action (ACID)
- Soft deletes for audit trail (don't physically remove data)

---

## 20. Environment Variables

### Frontend (`VITE_*` only, public)
| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API origin | `https://api.avrum.ai` |
| `VITE_MAP_TILE_KEY` | Map tile provider key (domain-restricted) | `pk.eyJ1IjoibWFwYm94IiwI...` (not yet used) |
| `VITE_SENTRY_DSN` | Client error reporting | `https://xxx@sentry.io/123` |
| `VITE_ENVIRONMENT` | Deployment environment | `development`, `staging`, `production` |

### Backend (Node.js) — Server-only, NEVER exposed to frontend
| Variable | Purpose | Example |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development`, `staging`, `production` |
| `PORT` | HTTP server port | `3000` |
| `APP_BASE_URL` | Public API URL | `https://api.avrum.ai` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost/avrum` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | Access token signing key | (long random string) |
| `JWT_REFRESH_SECRET` | Refresh token signing key | (long random string) |
| `JWT_ACCESS_TTL` | Access token lifetime | `15m` |
| `JWT_REFRESH_TTL` | Refresh token lifetime | `30d` |
| `PASSWORD_PEPPER` | Optional hashing secret | (long random string) |
| `AWS_ACCESS_KEY_ID` | S3 credentials | — |
| `AWS_SECRET_ACCESS_KEY` | S3 credentials | — |
| `AWS_REGION` | S3 region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | `avrum-uploads-prod` |
| `EMAIL_PROVIDER_API_KEY` | SendGrid/SES key | — |
| `EMAIL_FROM` | Sender email address | `noreply@avrum.ai` |
| `OPENWEATHER_API_KEY` | Weather API key | — |
| `AI_SERVICE_URL` | Python backend origin | `http://ai-service:5000` |
| `AI_SERVICE_TOKEN` | Auth token for AI backend | (long random string) |
| `API_KEY_HASH_SECRET` | Developer key HMAC pepper | (long random string) |
| `WEBHOOK_SIGNING_ALGO` | Signature algorithm | `sha256` |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Global rate limit | `1000` |
| `PAYMENT_PROVIDER_SECRET_KEY` | Stripe/Paystack key | — (if billing enabled) |
| `PAYMENT_WEBHOOK_SECRET` | Billing webhook secret | — (if billing enabled) |
| `SENTRY_DSN` | Server error reporting | `https://xxx@sentry.io/456` |
| `LOG_LEVEL` | Logging level | `debug`, `info`, `warn`, `error` |
| `CORS_ALLOWED_ORIGINS` | CORS whitelist | `http://localhost:5173,https://avrum.ai` |

### Python AI Service (FastAPI backend) — Server-only
| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Postgres (read/limited write) | `postgresql://readonly:pass@localhost/avrum` |
| `AWS_*`, `S3_BUCKET` | Image/asset storage | — |
| `MODEL_REGISTRY_URI` | Model versioning endpoint | `http://model-registry:8000` |
| `ACTIVE_MODEL_VERSION` | Current model to use | `v1.2.3` |
| `GEE_SERVICE_ACCOUNT_EMAIL` | Google Earth Engine | — |
| `GEE_PRIVATE_KEY` | GEE auth | — |
| `LLM_PROVIDER_API_KEY` | OpenAI/Anthropic key | — |
| `AI_SERVICE_TOKEN` | Shared secret with Node backend | (matches `AI_SERVICE_TOKEN` on Node) |
| `DEVICE` | GPU/CPU | `cuda` or `cpu` |
| `MAX_BATCH_SIZE` | Inference batch size | `32` |
| `INFERENCE_TIMEOUT_S` | Max inference time | `30` |

**Rules:**
- ✅ Never commit actual values to git (use `.env.example` with names only)
- ✅ All secrets rotated regularly
- ✅ Different secrets per environment (dev/staging/prod)
- ✅ `.env.example` committed; `.env` in `.gitignore`
- ✅ Load + validate on startup (fail fast if missing required vars)

---

## 21. MVP Priorities

### Phase 1: Foundation (Week 1)
**Must have:**
1. Repository scaffold (TypeScript, Express, Postgres+PostGIS, Redis, Docker Compose)
2. `/healthz` endpoint returns `200 OK`
3. Error middleware + envelope (all errors return standard format)
4. Structured logging with request IDs
5. Database migrations tool working
6. CI pipeline (lint, typecheck, unit tests)

### Phase 2: Authentication (Week 2)
**Must have:**
1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /auth/login` + `POST /auth/refresh`
3. `POST /auth/logout` + session management
4. `POST /auth/forgot-password` + `POST /auth/reset-password`
5. `GET /v1/me` + `PATCH /v1/me`
6. JWT token generation/verification
7. Email verification (OTP or link)
8. Frontend integration: auth context + route guards on `/_app` and `/_dev`

**Validation:** New user can sign up → verify email → sign in → see `/dashboard` → profile shows real name.

### Phase 3: Core Data Model (Week 3)
**Must have:**
1. User organizations (optional)
2. Farms (CRUD with PostGIS geometry)
3. Fields (GeoJSON boundaries)
4. Crop cycles (planting date, crop, growth stage)
5. Crops reference data (hardcoded seed: Maize, Rice, Cassava, Tomato, Cocoa, etc.)
6. Onboarding persistence (`POST /v1/onboarding/draft`, `POST /v1/onboarding/complete`)

**Validation:** Frontend onboarding completes → farm + field created → visible in `/farms`.

### Phase 4: Media & Inference (Week 4)
**Must have:**
1. Signed S3 upload (`POST /v1/uploads/sign`)
2. Image storage (`mediaId` reference in DB)
3. `POST /v1/crop/diagnose` (stub model or real model)
4. `GET /v1/crop/diagnoses` (history)
5. Model version stamping on diagnosis
6. Async job handling (jobId for >10s inference)

**Validation:** Upload crop image → get diagnosis with confidence/severity → diagnosis persists in history.

### Phase 5: Notifications & Events (Week 5)
**Must have:**
1. Notification table + in-app inbox
2. `POST /v1/notifications`, `GET /v1/notifications`, `PATCH /v1/notifications/:id/read`
3. Notification preferences (per user, per event type)
4. Event dispatcher (skeleton for disease.outbreak.detected, spray.window.open, etc.)
5. Email delivery (SendGrid or SES)
6. Webhook infrastructure (sign, store, retry)

**Validation:** Backend emits event → user receives notification + email.

### Phase 6: Weather & Disease Intelligence (Week 6)
**Must have:**
1. Weather data integration (OpenWeatherMap API)
2. Disease reference database (pathogen, crop, symptoms, conditions, controls)
3. Risk scoring logic (rules-based)
4. `GET /v1/disease/risk?lat=&lon=&crop=`
5. `GET /v1/disease/outbreaks?bbox=&crop=`
6. `GET /v1/diseases/:slug` (library)

**Validation:** Request disease risk for location/crop → get numeric score.

### Phase 7: Spray Recommendations (Week 7)
**Must have:**
1. Product catalogue (country-specific, active ingredients)
2. Dosage rules per (crop, target, field size, growth stage)
3. Weather window calculation (wind, rain, temperature)
4. `POST /v1/spray/recommend` returns products + window + safety
5. `GET /v1/spray/windows?fieldId=`

**Validation:** Request advisory for field + crop + issue → get product + dosage + application window.

### Phase 8: Async & Satellite (Week 8)
**Must have:**
1. BullMQ job queue setup
2. Background workers (diagnose, satellite, disease risk, notifications, webhooks)
3. Job status tracking (`GET /v1/job/:id`)
4. GEE or Sentinel Hub integration (stub or real)
5. `POST /v1/satellite/analyses` (async dispatch)
6. `GET /v1/satellite/analyses/:id` (status + tile URLs)
7. Time-series query: `GET /v1/fields/:id/indices`

**Validation:** Request satellite analysis → job enqueued → polling shows progress → tiles available.

### Phase 9: Developer Platform (Week 9)
**Must have:**
1. API key CRUD (`GET|POST /v1/developer/api-keys`, `DELETE /v1/developer/api-keys/:id`)
2. Key scoping (sandbox/live, product-based)
3. Rate limiting + quota enforcement
4. Usage metering (`GET /v1/developer/usage`)
5. Request logging (`GET /v1/developer/logs`)
6. Webhook management (`GET|POST /v1/developer/webhooks`)
7. Gateway middleware (API key extraction, scope checking)

**Validation:** Developer creates key → makes scoped API call → usage appears in dashboard.

### Phase 10: Soil Intelligence (Week 10)
**Must have:**
1. Soil profile table (N-P-K, pH, OC, texture)
2. Manual entry + optional OCR for lab reports
3. Fallback soil data (iSDAsoil or SoilGrids API)
4. Fertiliser recommendation rules
5. `POST /v1/soil/profiles`, `POST /v1/soil/analyze`, `GET /v1/fields/:id/soil`

**Validation:** Enter soil data → get fertiliser plan.

### Post-MVP (Later phases)
- Billing / subscription management
- i18n (5 languages)
- Admin console APIs
- Offline-first / PWA
- Trained production vision model + feedback loop
- SMS/WhatsApp notification channels
- Advanced RBAC (organization roles, team management)
- Data residency compliance
- Disaster recovery / backup drills

---

## 22. Frontend/Backend Integration Checklist

Use this checklist to track frontend integration as backend endpoints ship.

- [ ] **Authentication**
  - [ ] Registration connected (POST /auth/register)
  - [ ] Email verification connected (POST /auth/verify-email)
  - [ ] Login connected (POST /auth/login)
  - [ ] Token refresh working (POST /auth/refresh)
  - [ ] Logout working (POST /auth/logout)
  - [ ] Forgot password connected (POST /auth/forgot-password)
  - [ ] Reset password connected (POST /auth/reset-password)

- [ ] **User Profile**
  - [ ] GET /v1/me connected (displays real user name, org, email, phone, etc.)
  - [ ] Profile edit connected (PATCH /v1/me)
  - [ ] Password change connected (POST /v1/me/password)
  - [ ] Preferences saved (GET|PUT /v1/me/preferences for language, units, theme)
  - [ ] Sessions list connected (GET /v1/me/sessions)
  - [ ] Activity log connected (GET /v1/me/activity)

- [ ] **Farms & Fields**
  - [ ] Farm list connected (GET /v1/farms)
  - [ ] Farm creation connected (POST /v1/farms from /dashboard "Add farm" button)
  - [ ] Farm details connected (GET /v1/farms/:id)
  - [ ] Farm edit connected (PATCH /v1/farms/:id)
  - [ ] Farm deletion connected (DELETE /v1/farms/:id)
  - [ ] Field boundary upload connected (POST /v1/farms/:id/fields with GeoJSON)
  - [ ] Field map component integrated (requires map library)
  - [ ] Crop list connected (GET /v1/crops)
  - [ ] Crop cycles connected (GET|POST /v1/crop-cycles)

- [ ] **Onboarding**
  - [ ] Wizard draft auto-save working (POST /v1/onboarding/draft)
  - [ ] Wizard completion working (POST /v1/onboarding/complete)
  - [ ] Farm/field created after onboarding
  - [ ] Preferences saved after onboarding

- [ ] **Image Upload**
  - [ ] Presigned S3 URL working (POST /v1/uploads/sign)
  - [ ] UploadZone file input functional (currently missing)
  - [ ] Image PUT to S3 working
  - [ ] mediaId stored and retrievable

- [ ] **Crop Doctor**
  - [ ] Diagnosis endpoint connected (POST /v1/crop/diagnose)
  - [ ] Diagnosis history connected (GET /v1/crop/diagnoses)
  - [ ] Diagnosis detail view working (GET /v1/crop/diagnoses/:id)
  - [ ] Async job polling working (for >10s inference)
  - [ ] Disease name, confidence, severity displayed
  - [ ] Treatment recommendation displayed
  - [ ] Link to spray advisor working

- [ ] **Disease Intelligence**
  - [ ] Outbreak map connected (GET /v1/disease/outbreaks?bbox=)
  - [ ] Risk score connected (GET /v1/disease/risk?lat=&lon=&crop=)
  - [ ] Disease library connected (GET /v1/diseases)
  - [ ] Disease detail page connected (GET /v1/diseases/:slug)
  - [ ] Map component installed + renders outbreak data
  - [ ] Alert settings saved (webhook subscriptions)

- [ ] **Spray Recommendation**
  - [ ] Filter controls functional (crop, field, target issue)
  - [ ] Advisory generation connected (POST /v1/spray/recommend)
  - [ ] Products + dosage displayed
  - [ ] Application window displayed
  - [ ] Safety info (PHI, REI) displayed

- [ ] **Satellite Monitoring**
  - [ ] Analysis request connected (POST /v1/satellite/analyses)
  - [ ] Job polling working (GET /v1/satellite/analyses/:id)
  - [ ] Tile rendering on map (requires map component)
  - [ ] Time-series query connected (GET /v1/fields/:id/indices)
  - [ ] Index selector working (NDVI, NDMI, stress)

- [ ] **Soil Intelligence**
  - [ ] Soil profile upload connected (POST /v1/soil/profiles)
  - [ ] Manual soil data entry connected
  - [ ] Lab report upload connected
  - [ ] Analysis generation connected (POST /v1/soil/analyze)
  - [ ] Nutrient gaps displayed
  - [ ] Fertiliser plan displayed

- [ ] **Notifications**
  - [ ] Notification inbox connected (GET /v1/notifications)
  - [ ] Notification mark-read connected (PATCH /v1/notifications/:id/read)
  - [ ] Notification preferences connected (GET|PUT /v1/me/preferences)
  - [ ] Email delivery confirmed
  - [ ] In-app bell badge updates

- [ ] **Developer Platform**
  - [ ] API key creation connected (POST /v1/developer/api-keys)
  - [ ] API key list connected (GET /v1/developer/api-keys)
  - [ ] API key revocation connected (DELETE /v1/developer/api-keys/:id)
  - [ ] Usage stats connected (GET /v1/developer/usage)
  - [ ] Request logs connected (GET /v1/developer/logs)
  - [ ] Webhook management connected (GET|POST /v1/developer/webhooks)
  - [ ] Webhook test delivery connected (POST /v1/developer/webhooks/:id/test)
  - [ ] Webhook delivery history connected (GET /v1/developer/webhooks/:id/deliveries)
  - [ ] Team member management connected (GET|POST /v1/organizations/:id/members)
  - [ ] Billing info connected (GET /v1/billing/subscription)
  - [ ] Invoices connected (GET /v1/billing/invoices)
  - [ ] Playground execution connected (POST /v1/developer/playground/execute)

- [ ] **Admin**
  - [ ] User list connected (GET /v1/admin/users, admin-only)
  - [ ] Model version management connected (GET /v1/admin/models, admin-only)
  - [ ] Platform metrics connected (GET /v1/admin/metrics, admin-only)

- [ ] **Error Handling**
  - [ ] 401 errors redirect to /sign-in
  - [ ] 403 errors show permission denied
  - [ ] Validation errors shown as inline field errors
  - [ ] 429 rate limit shown with retry guidance
  - [ ] Network errors show retry option

- [ ] **Loading States**
  - [ ] Forms show loading on submit
  - [ ] Lists show skeleton while fetching
  - [ ] Async jobs show progress indicator
  - [ ] Buttons disabled during mutation

- [ ] **Mock Data Removed**
  - [ ] `currentProfile` replaced with `GET /v1/me`
  - [ ] `apiProducts` replaced with real API product list
  - [ ] Developer usage stats replaced with real metrics
  - [ ] Hardcoded session list replaced with `GET /v1/me/sessions`
  - [ ] Hardcoded API keys replaced with `GET /v1/developer/api-keys`
  - [ ] Empty states show only when data is truly absent

---

## 23. Questions & Backend Decisions Required

| # | Question | Impact | Owner | Note |
|---|---|---|---|---|
| 1 | **Payment provider** (Stripe, Paystack, Flutterwave, or none for MVP?) | Blocks billing, plan enforcement, quota gating | Product/Finance | Africa-optimized providers recommended |
| 2 | **OAuth providers** (Google, Apple, Microsoft, or only email/password?) | Affects signup flow, social login | Product | UI shows buttons but no handlers exist |
| 3 | **Vision model source** (PlantVillage, Plantix, custom trained, or third-party API?) | Core AI product claim | ML/Engineering | Training data + labelling budget needed |
| 4 | **Agronomy LLM provider** (OpenAI GPT-4, Anthropic Claude, Llama, or none?) | Affects latency, cost, data residency | ML/Product | Cost ceiling + data residency constraints |
| 5 | **Satellite provider** (Google Earth Engine, Sentinel Hub, or USGS?) | Blocks satellite feature, license cost | Engineering/Legal | GEE requires service account; commercial licensing needed |
| 6 | **Map library** (MapLibre free, Mapbox paid, Google Maps, Leaflet?) | Blocker for boundary drawing + satellite rendering | Engineering | Needed before field creation fully works |
| 7 | **Weather provider** (OpenWeatherMap, ECMWF, local stations?) | Spray window accuracy, cost | Engineering/Product | Free tier vs. professional coverage trade-off |
| 8 | **Email provider** (SendGrid, AWS SES, Postmark?) | Transactional email reliability | Engineering | Volume pricing, deliverability rates |
| 9 | **Public API surface** (same endpoints as internal, or separate frozen surface?) | Affects API gateway design, stability guarantees | Engineering | Recommendation: separate handlers, shared services |
| 10 | **Async architecture** (single BullMQ, or BullMQ + Celery dual-queue?) | Worker scaling, language isolation | Engineering | Recommendation: BullMQ only for MVP, Python via HTTP |
| 11 | **Soil data source** (manual entry only, lab OCR, iSDAsoil fallback, SoilGrids?) | Soil recommendation accuracy | Engineering/ML | Requires decision on OCR + external API dependencies |
| 12 | **Disease data source** (PlantVillage, CIMMYT, custom dataset?) | Disease coverage, regional accuracy | ML/Product | Availability for Nigeria/Africa crops |
| 13 | **Spray product catalogue** (manual curation, integrate Agro-input industry DB, crowdsourced?) | Recommendation trustworthiness, legal liability | Product/Legal | Requires country-specific registration data |
| 14 | **Country scope at launch** (Nigeria only, or broader Africa?) | Regulatory, compliance, data sources | Product | Affects product registration, language support |
| 15 | **Feedback mechanism** (users improve diagnoses, or crowdsourced labels?) | Model improvement velocity | ML/Product | Training loop design, user incentives |
| 16 | **Data retention policy** (how long to keep crop images, field boundaries, diagnoses?) | Storage cost, privacy compliance | Product/Legal | GDPR implications for user data export/deletion |
| 17 | **Billing cycle** (monthly, per-use, freemium with quota?) | Monetization, user experience | Product/Finance | Impacts `subscriptions` table + quota enforcement |
| 18 | **i18n timing** (MVP English-only, or ship 5 languages from start?) | Localization effort, market readiness | Product | Frontend ready for 6 languages; backend text still hardcoded |
| 19 | **Voice/SMS interfaces** (text-only MVP, or voice for low-literacy farmers?) | Accessibility, cost, complexity | Product | SMS already in notification preferences UI |
| 20 | **Organization types** (individual farmers, cooperatives, NGOs, enterprises?) | RBAC design, data sharing model | Product/Engineering | UI shows all; backend permissions model undefined |

---

## 24. Final Backend Implementation Summary

### The Goal
Build a **production-ready, scalable MVP backend** that fulfills every requirement the frontend presents. The frontend is the specification; match it exactly. Do not reinterpret or simplify.

### The Approach
1. **Read the frontend code first** — understand routes, forms, data shapes, UI expectations
2. **Write OpenAPI 3.1 spec** before writing handlers (lock the contract)
3. **Build auth + identity** before anything else (unblocks all protected endpoints)
4. **Use background jobs from the start** (don't put inference/satellite in request paths)
5. **Test cross-tenant isolation** with explicit tests (security is not optional)
6. **Log everything** with request IDs (observability matters on day one)
7. **Validate all inputs** (Zod on backend too; don't trust frontend)
8. **Soft-delete data** (retain audit trail for GDPR + debugging)
9. **Version your API** (`/v1` from commit one; third-party contracts are frozen independently)
10. **Document unknowns** (don't silently invent behavior for undefined requirements)

### What Backend Delivers
- ✅ A working API that replaces every hardcoded mock in the frontend
- ✅ Real authentication + authorization (not just client-side validation)
- ✅ Persistent data (farms, fields, diagnoses, notifications, subscriptions)
- ✅ AI inference pipeline (image classification, weather scoring, recommendations)
- ✅ Async job orchestration (satellite analysis, disease risk, notifications)
- ✅ Developer platform (API keys, rate limiting, metering, webhooks)
- ✅ Email + in-app notifications
- ✅ Admin console (user management, model versioning, metrics)
- ✅ Security (HTTPS, CORS, rate limiting, input validation, audit logging)
- ✅ Observability (structured logging, request tracing, error reporting)
- ✅ Scalability (modular services, background jobs, caching, database optimization)

### What Frontend Delivers (No Backend Changes Needed)
- ✅ Complete design system + UI components (45 primitives + 14 domain components)
- ✅ Responsive layouts (desktop + mobile + tablet)
- ✅ Routing + navigation (47 route files)
- ✅ Client-side validation schemas (Zod)
- ✅ Dark mode + theme switching
- ✅ Error boundaries + 404 page
- ✅ Onboarding wizard UX
- ✅ SEO metadata on every page

### Integration Points
1. **`VITE_API_BASE_URL`** — Frontend will point to your backend origin
2. **Bearer token in `Authorization` header** — Frontend will send access tokens
3. **Error envelope** — Frontend expects `{ error: { code, message, details, requestId } }`
4. **Pagination** — Cursor-based with `{ data, page: { cursor, hasMore } }`
5. **Async jobs** — Frontend polls `GET /job/:id` until status = "completed"
6. **Webhooks** — Frontend registers at `/developer/webhooks` and expects signed payloads
7. **Real-time notifications** — Frontend doesn't implement WebSocket; use email + in-app inbox for now

### Success Criteria (Milestone 1 — Week 2)
- [ ] `docker compose up` runs locally (API + Postgres+PostGIS + Redis)
- [ ] `POST /auth/register` → `POST /auth/verify-email` → `POST /auth/login` works end-to-end
- [ ] `GET /v1/me` returns real user (not hardcoded)
- [ ] Frontend `/dashboard` displays authenticated user's name
- [ ] `401` on missing token; frontend redirects to `/sign-in`
- [ ] Integration tests pass (register/verify/login/refresh/logout/forgot/reset)
- [ ] CI pipeline green (lint + typecheck + unit tests)

### Ship It
Once Phase 2 is done, the backend can be deployed to staging. The frontend can point `VITE_API_BASE_URL` at staging and begin integration testing. Each phase afterward adds a new product capability. By Phase 10, the MVP is complete and ready for beta farmers.

**Do not overcomplicate the MVP.** No microservices, no Kubernetes, no Kafka, no advanced ML ops yet. A boring, well-tested Node.js + Postgres monolith + Python AI service behind a queue + managed cloud storage is enough to start.

**Ship fast. Learn from farmers. Iterate.**

---

## Appendix: File Reference

**Key frontend files for backend implementation:**

- [auth-validation.ts](auth-validation.ts) — Exact Zod schemas (reuse on backend)
- [profile.ts](profile.ts) — User profile shape that `GET /v1/me` must return
- [developer.ts](developer.ts) — API product catalogue, developer nav structure
- [nav.ts](nav.ts) — Complete farmer app navigation (all pages + routes)
- [routes/_auth.sign-in.tsx](routes/_auth.sign-in.tsx) — Login form expectations
- [routes/_auth.sign-up.tsx](routes/_auth.sign-up.tsx) — Registration form expectations
- [routes/onboarding.tsx](routes/onboarding.tsx) — Wizard data shape (11 steps)
- [routes/_app.dashboard.tsx](routes/_app.dashboard.tsx) — Dashboard stats needed
- [routes/_app.crop-doctor.tsx](routes/_app.crop-doctor.tsx) — Diagnosis UI contract
- [components/avrum/upload-zone.tsx](components/avrum/upload-zone.tsx) — File size limits (10 MB)
- [Guide.md](Guide.md) — Existing engineering guide with full API spec (§17)

**End of FRONTEND_GUIDE.md**
