# AVRUM Frontend Codebase Report

## Scope and Method

This report documents the current contents of `avrum-frontend` as inspected on 2026-09-18. It is an analysis artifact only. No application source files were modified. Generated output under `.output/` and dependencies under `node_modules/` are excluded from the architectural description.

The current source code is treated as authoritative when it conflicts with older documentation such as `Guide.md` or parts of `FRONTEND_GUIDE.md`.

## 1. Project Overview

### Stack

| Area | Current implementation |
| --- | --- |
| Frontend framework | TanStack Start on React, with SSR/server entry support |
| React | `^19.2.0` |
| TypeScript | `^5.8.3`, strict mode, no emit |
| Routing | `@tanstack/react-router` `^1.170.18`, file-based routes |
| TanStack Start | `@tanstack/react-start` `^1.168.32` |
| Build tool | Vite `^8.2.0`, configured through `@lovable.dev/vite-tanstack-config` `2.13.1` |
| CSS | Tailwind CSS `^4.2.1` with `tw-animate-css` and custom semantic CSS tokens |
| HTTP client | Axios `^1.20.0`, centralized in `src/lib/api-client.ts` |
| Server state package | TanStack React Query `^5.101.1`; provider is mounted, but no current `useQuery` or `useMutation` usage was found |
| UI primitives | Radix UI packages, shadcn-style local wrappers, and custom AVRUM components |
| Forms | Native form events and local state in most screens; React Hook Form `^7.71.2` is installed but no current usage was found |
| Validation | Zod `^3.24.2`, currently used by auth schemas |
| Icons | `lucide-react` `^0.575.0` |
| Charts | Recharts `^2.15.4` and a local chart wrapper |
| Notifications | Sonner `^2.0.7` through `src/components/ui/sonner.tsx` |
| Map packages | `leaflet` `^1.9.4`, `leaflet-draw` `^1.0.4`, `react-leaflet` `^5.0.0` are listed, but no source usage or initialized map was found |

### TypeScript configuration

`tsconfig.json` is the main TypeScript configuration. Important settings include:

- `target: ES2022`
- `jsx: react-jsx`
- `module: ESNext`
- `moduleResolution: Bundler`
- `strict: true`
- `noEmit: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noUncheckedSideEffectImports: true`
- `@/*` path alias mapped to `./src/*`

### Build and startup

`vite.config.ts` imports `defineConfig` from `@lovable.dev/vite-tanstack-config`. The preset supplies the TanStack Start, React, Tailwind, TypeScript path alias, Nitro, environment injection, and related plugins. The local config redirects the TanStack Start server entry to `src/server.ts`.

There is no hand-written classic bootstrap of the following form:

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(...)
```

The application is a TanStack Start application. The closest source entry files are:

- `src/router.tsx`: creates the TanStack router and a `QueryClient`.
- `src/start.ts`: configures TanStack Start middleware, including error and CSRF middleware.
- `src/server.ts`: server/SSR fetch wrapper and catastrophic SSR error normalization.
- `src/routes/__root.tsx`: root route shell and client component tree, including `QueryClientProvider`, `AuthProvider`, and `Outlet`.
- `src/routeTree.gen.ts`: generated route tree. It must not be edited manually.

TanStack Start generates the client hydration/bootstrap code during the build. The generated `.output/public` bundle contains hydration code, but generated output is not the source entry point.

### Package manager and commands

Both `bun.lock` and `package-lock.json` are present. This means the repository currently contains evidence of both Bun and npm workflows; the package manager is not unambiguously standardized. `bunfig.toml` also exists. The scripts in `package.json` are:

```text
npm/bun run dev       vite dev
npm/bun run build     vite build
npm/bun run build:dev vite build --mode development
npm/bun run preview   vite preview
npm/bun run lint      eslint .
npm/bun run format     prettier --write .
```

The frontend package does not define a dedicated type-check script, but TypeScript can be run directly with `tsc --noEmit`.

## 2. Important Folder Structure

```text
avrum-frontend/
├── public/                         Static public files such as robots.txt
├── src/
│   ├── assets/                     Bundled frontend assets
│   ├── components/
│   │   ├── auth/                   Auth cards, fields, provider, password controls
│   │   ├── avrum/                  Product-level page and data-display components
│   │   ├── developer/              Developer-console components
│   │   ├── layout/                 App shell, sidebar, top nav, mobile nav
│   │   ├── marketing/              Landing-page sections and waitlist UI
│   │   ├── onboarding/              Onboarding wizard components
│   │   ├── profile/                 Profile-specific components
│   │   ├── theme/                   Theme context/provider
│   │   └── ui/                      Radix/shadcn-style reusable primitives
│   ├── hooks/                       Reusable hooks; currently includes use-mobile
│   ├── lib/                         API client, auth service, nav, profile, helpers
│   ├── routes/                      TanStack file-based route modules
│   ├── router.tsx                   Router factory and React Query context
│   ├── routeTree.gen.ts             Generated route tree; do not edit manually
│   ├── server.ts                    TanStack Start server wrapper
│   ├── start.ts                     TanStack Start middleware setup
│   └── styles.css                   Tailwind entry and AVRUM design tokens
├── .env.example                     Frontend environment variable names/templates
├── package.json                     Dependencies and scripts
├── tsconfig.json                    TypeScript compiler configuration
├── vite.config.ts                   TanStack/Vite configuration
├── components.json                  Component-generation configuration
├── AGENTS.md                         Repository-specific agent guidance
├── FRONTEND_GUIDE.md                 Architecture/product guide; some sections are stale
└── Guide.md                          Older engineering guide; some claims conflict with code
```

There is no `src/pages`, `src/services`, `src/api`, or `src/types` directory. API and auth service code currently lives in `src/lib`. Domain types are generally declared near the service or route that consumes them.

## 3. Routing Architecture

### Library and configuration

Routing uses TanStack Router's file-based route convention. Route modules are under `src/routes`. `src/routes/README.md` records the convention, and `src/routeTree.gen.ts` is generated from those files.

`src/router.tsx` creates a router with:

- the generated `routeTree`
- a new TanStack React Query `QueryClient` in router context
- scroll restoration
- `defaultPreloadStaleTime: 0`

`src/routes/__root.tsx` is the root route. It defines document head metadata, `RootShell`, `RootComponent`, and the root `Outlet`.

### Route hierarchy

```text
/
├── /onboarding
├── /sign-in                         _auth.sign-in.tsx
├── /sign-up                         _auth.sign-up.tsx
├── /verify-email                    _auth.verify-email.tsx
├── /forgot-password                 _auth.forgot-password.tsx
├── /reset-password                 _auth.reset-password.tsx
├── /account-created                _auth.account-created.tsx
├── /dashboard                       _app.dashboard.tsx
├── /farms                           _app.farms.tsx
│   ├── /farms/fields                _app.farms.fields.tsx
│   └── /farms/calendar              _app.farms.calendar.tsx
├── /crop-doctor                     _app.crop-doctor.tsx
├── /disease-intelligence            _app.disease-intelligence.tsx
│   └── /disease-intelligence/library _app.disease-intelligence.library.tsx
├── /spray-recommendation             _app.spray-recommendation.tsx
├── /satellite-monitoring             _app.satellite-monitoring.tsx
├── /soil-intelligence               _app.soil-intelligence.tsx
├── /notifications                   _app.notifications.tsx
├── /settings                        _app.settings.tsx
├── /help                            _app.help.tsx
├── /admin                           _app.admin.tsx
├── /profile                         _app.profile.tsx
│   ├── /profile                     _app.profile.index.tsx
│   ├── /profile/edit                _app.profile.edit.tsx
│   ├── /profile/account             _app.profile.account.tsx
│   ├── /profile/security            _app.profile.security.tsx
│   ├── /profile/notifications       _app.profile.notifications.tsx
│   ├── /profile/language            _app.profile.language.tsx
│   ├── /profile/appearance          _app.profile.appearance.tsx
│   ├── /profile/subscription        _app.profile.subscription.tsx
│   ├── /profile/devices             _app.profile.devices.tsx
│   └── /profile/activity             _app.profile.activity.tsx
└── /developer                       _dev + developer route modules
    ├── /developer/api-products
    ├── /developer/api-keys
    ├── /developer/playground
    ├── /developer/docs
    ├── /developer/logs
    ├── /developer/usage
    ├── /developer/webhooks
    ├── /developer/team
    ├── /developer/billing
    └── /developer/settings
```

### Layout routes

- `src/routes/__root.tsx`: document shell, head content, scripts, React Query provider, auth provider, and root outlet.
- `src/routes/_auth.tsx`: `AuthShell`, theme provider, nested auth outlet, and toaster.
- `src/routes/_app.tsx`: `AppShell` and nested application outlet.
- `src/routes/_app.profile.tsx`: page shell, profile header/navigation, and nested profile outlet.
- `src/routes/_dev.tsx`: `DeveloperShell` and nested developer outlet.
- `src/routes/_dev.developer.tsx`: nested developer outlet route.

The application and developer layout routes are not currently protected by client-side route guards. The auth route modules are public. The `/admin` UI displays a restricted-area message, but there is no frontend authorization guard.

### Navigation

`src/lib/nav.ts` defines `navGroups` and `mobileNavItems`. `src/components/layout/app-sidebar.tsx` renders desktop navigation, and `src/components/layout/mobile-bottom-nav.tsx` renders the mobile navigation. `src/components/layout/top-nav.tsx` handles the top navigation area.

Navigation uses TanStack `Link` and `useRouterState`. Sidebar child routes are expanded with Radix `Collapsible`. The `adminOnly` flag in `nav.ts` is currently presentation metadata; `AppSidebar` uses `const IS_ADMIN = true`, so the admin item is always shown.

## 4. Authentication

### Auth context and provider

`src/components/auth/auth-provider.tsx` defines `AuthProvider` and `useAuth`.

The provider:

- Initializes the user from `authService.getCurrentUser()`.
- Exposes `user`, `isLoading`, `isAuthenticated`, `setUser`, `setIsLoading`, `logout`, and `refreshUser`.
- Persists user data through `authService.setCurrentUser`.
- Clears local state on logout, even when the backend logout call fails.
- Does not currently call a `/auth/me` endpoint. `refreshUser` reloads the user object from local storage.

`AuthProvider` is mounted in `src/routes/__root.tsx` inside `QueryClientProvider`.

### Token storage and API headers

`src/lib/api-client.ts` owns token storage and Axios configuration.

- Access and refresh tokens are held in memory and persisted in `localStorage` under `accessToken` and `refreshToken`.
- The request interceptor adds `Authorization: Bearer <accessToken>` when an access token exists.
- A 401 response triggers one refresh request to `/auth/refresh` using the stored refresh token.
- Concurrent failed requests are queued while refresh is in progress.
- A successful refresh updates both tokens and retries the original request.
- Missing or failed refresh tokens clear storage and redirect to `/sign-in`.

### Auth service and flows

`src/lib/auth-service.ts` contains the typed auth service:

- `register()` -> `POST /auth/register`
- `verifyEmail()` -> `POST /auth/verify-email`
- `login()` -> `POST /auth/login`
- `logout()` -> `POST /auth/logout`
- `forgotPassword()` -> `POST /auth/forgot-password`
- `resendVerificationEmail()` -> `POST /auth/resend-verification-email`
- `resetPassword()` -> `POST /auth/reset-password`
- `onboardingService.saveDraft()` -> `POST /v1/onboarding/draft`
- `onboardingService.complete()` -> `POST /v1/onboarding/complete`

`login()` and `verifyEmail()` persist returned access and refresh tokens. `setUser()` in the provider persists the returned user.

Current route behavior:

- `src/routes/_auth.sign-in.tsx`: validates with Zod, calls `authService.login`, sets the user, then sends users to `/dashboard` or `/onboarding` depending on `onboardingCompleted`.
- `src/routes/_auth.sign-up.tsx`: validates with Zod, calls register, then navigates to `/verify-email?email=...`.
- `src/routes/_auth.verify-email.tsx`: sends and verifies a six-digit code, then sets the user and navigates to `/account-created`.
- `src/routes/onboarding.tsx`: autosaves draft data and submits onboarding completion.
- `src/components/auth/auth-provider.tsx`: performs logout and local session cleanup.

### Important auth limitations

- There is no client-side `beforeLoad` or equivalent route guard in `_app`, `_dev`, or individual protected routes.
- `isAuthenticated` is derived from token presence, not a server-validated current session.
- User profile state is local-storage-backed rather than refreshed from the backend.
- The `remember` form field is sent to login, but token storage is always local storage in the current client implementation.
- Do not put field-specific authorization logic in a page. Use the existing authenticated Axios client and rely on backend ownership checks.

## 5. API Architecture

### HTTP client

The canonical client is `src/lib/api-client.ts`. It creates an Axios instance with:

```text
baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000"
Content-Type = application/json
```

The client exposes `apiClient`, `tokenStorage`, and `API_BASE_URL`.

### Current API usage

Current source-level API calls are concentrated in:

- `src/lib/auth-service.ts`: auth and onboarding calls.
- `src/routes/_app.crop-doctor.tsx`: upload and diagnosis calls through `apiClient`.
- `src/components/marketing/newsletter.tsx`: currently local/UI behavior only; it does not use the API client.

`src/lib/api-client.ts` is also used directly by the crop doctor route. There is no separate farm service, field service, or field intelligence service in the frontend.

### Response conventions

The current code handles several conventions rather than one universal response envelope:

- Auth responses return objects such as `{ user, accessToken, refreshToken }`.
- Onboarding responses return `{ user }` or `{ draftId, savedAt }`.
- Diagnosis calls expect `{ success, data }`.
- Error handling usually reads `AxiosError.response?.data?.message`.
- Some UI routes use local error state; others use Sonner toasts.

### How a new field endpoint should be added

For the supplied Field Intelligence endpoints, the frontend should use the existing `apiClient` rather than creating a second Axios or fetch client:

```ts
const response = await apiClient.get<FieldVegetationResponse>(
  `/api/fields/${fieldId}/vegetation`,
);

const mapResponse = await apiClient.get<FieldVegetationMapResponse>(
  `/api/fields/${fieldId}/vegetation/map`,
);
```

The exact service location does not exist yet. The preferred addition is a focused module under `src/lib`, such as `src/lib/field-intelligence-service.ts`, with response types kept in that module or a new domain types module if the feature grows. The page should call that service, not construct URLs or manage refresh-token behavior itself.

No `useQuery` or `useMutation` convention is established in current source even though React Query is mounted. A new feature can use React Query consistently with the router context, but this would introduce the first current server-state hook usage and should be done deliberately.

## 6. Existing Farm and Field Functionality

### Current frontend implementation

The frontend has route and UI placeholders, but no complete farm/field data flow.

| File | Current behavior | Reusable material | Status |
| --- | --- | --- | --- |
| `src/routes/_app.farms.tsx` | Farm page with `PageShell`, `PageHeader`, add/import buttons, and an empty state | Page structure and empty state | No farm list API or farm type |
| `src/routes/_app.farms.fields.tsx` | Field Boundaries page with map placeholder and saved-boundaries empty state | Page layout, `MapPlaceholder`, upload/empty-state pattern | No field CRUD calls or field type |
| `src/routes/_app.farms.calendar.tsx` | Crop calendar empty state | Page structure | No crop-cycle data flow |
| `src/routes/onboarding.tsx` | Collects farm name, farm size, size unit, ownership, crops, boundary note, and location fields in a `Draft` type | Existing field-adjacent input patterns and onboarding payload | Does not create a frontend `Field` model or polygon |
| `src/routes/_app.dashboard.tsx` | Displays zero active farms and a map placeholder | Dashboard composition and metrics layout | No farm/field data calls |
| `src/routes/_app.satellite-monitoring.tsx` | Displays a selected-field concept in copy and an index viewer placeholder | Best nearby product page pattern for vegetation data | No field selector, field ID, or API calls |
| `src/lib/nav.ts` | Farm navigation includes All Farms, Field Boundaries, and Crop Calendar | Navigation conventions | No Field Intelligence nav item |

### Search findings

No frontend source type or interface named `Farm`, `Field`, `Location`, `Coordinate`, `GeoJSON`, or `Polygon` was found. The only frontend field-related data shape is the onboarding `Draft`, which contains text fields and a `boundaryNote` string rather than polygon coordinates.

The frontend does not currently consume a field ID. The supplied `/api/fields/:fieldId/...` endpoints therefore require a field list/detail flow or a field selection mechanism before they can be used naturally.

The backend repository does contain field models/routes, but that is outside the frontend implementation. The frontend report should not treat backend types as already imported or reusable in the browser.

## 7. Existing Map Implementation

**No existing map implementation was found in the frontend source.**

The only current map component is:

- `src/components/avrum/map-placeholder.tsx`: a visual placeholder with grid background, layer badge, expand button, icon, label, and caption.

It is used by:

- `src/routes/_app.dashboard.tsx`
- `src/routes/_app.farms.fields.tsx`
- `src/routes/_app.disease-intelligence.tsx`
- `src/routes/_app.satellite-monitoring.tsx`
- `src/routes/onboarding.tsx`

The placeholder does not initialize a map, render tiles, render markers, render polygons, handle GeoJSON, support location search, or allow drawing/editing.

`package.json` lists Leaflet, Leaflet Draw, React Leaflet, and their type packages, but no source import or usage was found. This is an installed-package/configuration fact, not evidence of a working map implementation.

For the supplied spatial vegetation response, the frontend can render the returned base64 image directly using an `<img>` element and display its bounds as metadata without a map library. Rendering the image geographically against bounds, fitting it to a basemap, or allowing polygon interaction would require an actual map implementation that does not currently exist.

## 8. Design System and UI Architecture

### Styling

`src/styles.css` is the global Tailwind entry point. It defines custom semantic tokens for light and dark themes using OKLCH values, including:

- forest-green primary/brand colors
- emerald AI/action colors
- sky data/satellite colors
- warning, success, destructive, and border tokens
- sidebar tokens
- typography tokens using Sora and Manrope

The `@/*` alias is used throughout source imports.

### Local AVRUM components

`src/components/avrum/index.ts` exports the main domain primitives:

- `PageHeader`, `PageShell`, `Section`
- `EmptyState`
- `StatCard`
- `AIInsightCard`
- `SearchBox`
- `FilterPanel`, `FilterField`
- `UploadZone`
- `MapPlaceholder`
- `DataTable`
- `LoadingSpinner`, `CardSkeleton`, `TableSkeleton`
- `SettingsCard`, `SettingsRow`, `SettingsRowGroup`, `SettingsField`

### UI primitives

`src/components/ui` contains local wrappers around Radix and standard controls, including:

- `Button`, with variants such as `default`, `outline`, `ai`, `emerald`, `ghost`, and `destructive`, plus a `loading` prop.
- `Input`, `Textarea`, `Label`, `Select`
- `Card`, `Badge`, `Alert`, `AlertDialog`
- `Tabs`, `Accordion`, `RadioGroup`, `Switch`, `Checkbox`
- `Dialog`, `Popover`, `DropdownMenu`, `Tooltip`, `Separator`, `ScrollArea`
- `Progress`, `Skeleton`, `Calendar`, `Table`
- Sonner `Toaster`
- Recharts-based chart primitives in `chart.tsx`

A new Field Intelligence page should use these existing primitives and the `PageShell`/`PageHeader` pattern rather than introducing another UI system.

## 9. Existing Page and Layout Patterns

### App layout

`src/components/layout/app-shell.tsx` composes:

- `ThemeProvider`
- `SidebarProvider`
- `AppSidebar`
- `SidebarInset`
- `TopNav`
- a main content area
- `MobileBottomNav`
- `Toaster`

The main content reserves bottom padding for mobile navigation. `AppSidebar` uses collapsible desktop navigation and `MobileBottomNav` supplies a five-item mobile shortcut bar.

### Page pattern

Most app screens use:

```tsx
<PageShell>
  <PageHeader title="..." subtitle="..." crumbs={[...]} actions={...} />
  <Section title="..." description="...">
    ...
  </Section>
</PageShell>
```

`PageShell` supplies vertical rhythm and a page container. `PageHeader` supplies breadcrumbs, optional eyebrow, title, subtitle, and actions. `Section` supplies a responsive title/action row.

### Responsive behavior

The source uses Tailwind breakpoints, chiefly:

- `sm:` for two-column controls and header/action wrapping
- `md:` for desktop/mobile navigation transitions
- `lg:` for filter/sidebar layouts and page spacing
- `xl:` for dashboard three-column layouts and four-stat grids

Maps and data panels use stable height classes such as `h-72 sm:h-96` and `h-80 sm:h-[28rem]`.

### Best existing pattern for Field Intelligence

The closest existing page is `src/routes/_app.satellite-monitoring.tsx` because it already presents vegetation, moisture, and stress indices. It should be extended or replaced with real field selection, loading, error, image/bounds display, and history behavior rather than creating another unrelated satellite page.

`src/routes/_app.dashboard.tsx` is the best reference for a multi-column intelligence overview. `src/routes/_app.spray-recommendation.tsx` is the best reference for a filter-driven field/crop selection layout, although its controls are currently non-functional.

## 10. State Management

### Global state

- `AuthProvider`/`useAuth` owns current user, loading flag, and logout behavior.
- `ThemeProvider`/`useTheme` owns light/dark theme state and persists `avrum-theme` in local storage.
- `SidebarProvider` from the local UI system owns sidebar state.

No Redux or Zustand usage was found.

### Local state

Most pages use React local state. Examples include:

- crop diagnosis file, preview, crop, analysis state, diagnosis, and error in `src/routes/_app.crop-doctor.tsx`
- auth form errors and loading flags in auth route modules
- onboarding draft and autosave state in `src/routes/onboarding.tsx`
- sidebar open state in `src/components/layout/app-sidebar.tsx`

### Server state

`QueryClientProvider` is mounted in `src/routes/__root.tsx`, and the router supplies a `QueryClient` context from `src/router.tsx`. No source usage of `useQuery`, `useMutation`, or `useQueryClient` was found. Existing API calls use imperative Axios requests and local state.

For Field Intelligence, use either:

1. a focused imperative service plus local loading/error/data state, matching the existing crop doctor pattern; or
2. TanStack Query, if the team wants to establish a shared server-state convention for fields and vegetation.

The second option is more appropriate for refreshable vegetation data, but it would be a new convention in current source.

## 11. Forms and Validation

### Current form architecture

Most forms use native React form events or controlled inputs:

- auth pages use `FormData` inside `onSubmit`
- onboarding uses controlled state in a typed `Draft`
- profile edit uses uncontrolled inputs with `defaultValue` and a submit toast
- spray recommendation uses select stubs with no submit handler

React Hook Form is installed but no current source import was found. Formik was not found.

### Validation

`src/lib/auth-validation.ts` defines Zod schemas for:

- sign-in
- sign-up
- forgot password
- reset password

`toFieldErrors()` converts Zod issues to a field-to-message object. Auth pages display inline errors through `AuthField` and form errors through `AuthAlert`.

There is no existing field creation form or field geometry validation in the frontend. The best current patterns to borrow are:

- `src/routes/onboarding.tsx` for typed field-like inputs and step validation
- `src/routes/_auth.sign-up.tsx` for Zod validation plus inline errors
- `src/components/avrum/filter-panel.tsx` for field/crop filter layout

A future Create Field form will need a new schema and coordinate/polygon validation contract. No frontend field schema currently exists.

## 12. Types and Data Models

### Existing frontend types

- `src/lib/auth-service.ts`: `User`, `AuthResponse`, `RegisterPayload`, `LoginPayload`, `VerifyEmailPayload`, `OnboardingDraftPayload`, and `OnboardingCompletePayload`.
- `src/lib/auth-validation.ts`: `FieldErrors`, `PasswordRule`, and `PasswordStrength`.
- `src/routes/onboarding.tsx`: `Draft`, representing the onboarding form state.
- `src/routes/_app.crop-doctor.tsx`: `Crop`, `DiagnosisResult`, `UploadResponse`, `DiagnosisResponse`, and `AnalysisState`.
- `src/lib/nav.ts`: `NavItem` and `NavGroup`.
- `src/components/avrum/data-table.tsx`: generic `Column<T>`.
- `src/components/avrum/page-header.tsx`: `Crumb`.

### Missing domain types

No frontend `Farm`, `Field`, `FieldBoundary`, `Coordinate`, `GeoJSON`, `Vegetation`, `NDVI`, or `FieldVegetationResponse` type currently exists.

The supplied Field Intelligence response should be represented by a new typed response contract when implementation begins. Do not assume that the onboarding `Draft` or the diagnosis types are field models.

## 13. Loading, Error, and Empty-State Patterns

### Loading

- `Button` supports a `loading` prop and renders a spinning `Loader2` icon.
- `src/components/avrum/loading.tsx` provides `LoadingSpinner`, `CardSkeleton`, and `TableSkeleton`.
- `src/components/avrum/data-table.tsx` uses `TableSkeleton` when its `loading` prop is true.
- Auth and diagnosis routes use explicit local booleans such as `loading`, `resending`, `verifying`, and `analysisState`.
- Onboarding uses an autosave indicator and toast notifications.

### Errors

- Auth forms use inline `AuthField` errors and `AuthAlert` for form-level errors.
- Crop diagnosis uses inline error state plus `toast.error()`.
- Onboarding uses `toast.error()` for save/complete failures.
- `src/routes/__root.tsx` defines a TanStack route error component and reports errors through `reportLovableError`.
- `src/server.ts` and `src/lib/error-page.ts` normalize catastrophic SSR errors to an HTML error page.
- `src/lib/api-client.ts` handles authentication failures globally through refresh and redirect behavior.

### Empty states

`src/components/avrum/empty-state.tsx` is the standard empty-state component with icon, title, description, optional primary/secondary actions, and `default`, `ai`, or `info` tones. It is used by farm, field, satellite, soil, disease, notification, profile, and developer pages.

Field Intelligence should use loading components while requests are pending, an inline or alert error for request failure, and `EmptyState` only when a valid field has no vegetation data or imagery.

## 14. Environment Variables

The frontend environment files define or reference these variable names:

```text
VITE_API_URL
VITE_WAITLIST_FORM_URL
```

`src/lib/api-client.ts` reads `VITE_API_URL`, defaulting to `http://localhost:3000` when absent. `src/components/marketing/waitlist.tsx` reads `VITE_WAITLIST_FORM_URL`.

The values in `.env` are intentionally not reproduced here. `.env.example` documents the variable names without secret values. No frontend `VITE_MAP_TILE_KEY`, `VITE_SENTRY_DSN`, or `VITE_ENVIRONMENT` usage was found in current source; names mentioned in older guides are not current implementation requirements.

## 15. Backend Integration Conventions

The current frontend integration shape is:

```ts
import { apiClient } from "@/lib/api-client";

const response = await apiClient.get<ResponseType>("/some/path");
const data = response.data;
```

Auth and onboarding wrap this access in `src/lib/auth-service.ts`. The crop doctor route currently calls the client directly because no diagnosis service module exists.

Conventions to preserve:

- Use `apiClient` so `VITE_API_URL`, bearer headers, refresh, and redirect behavior are inherited.
- Put reusable endpoint functions in `src/lib`, preferably one focused service module per domain.
- Type Axios response payloads at the call site or service boundary.
- Use path parameters with template literals after validating that a selected ID exists.
- Read backend error messages from `AxiosError.response?.data?.message` when displaying a user-facing failure.
- Keep loading state tied to the request and disable refresh/action buttons while a request is active.
- Do not expose backend or satellite provider credentials in frontend environment variables.

## 16. Field Intelligence Integration Readiness

The target backend endpoints are:

```text
GET /api/fields/:fieldId/vegetation
GET /api/fields/:fieldId/vegetation/map
```

The spatial endpoint is expected to return approximately:

```json
{
  "message": "Vegetation map generated successfully.",
  "data": {
    "field": {
      "id": "...",
      "name": "My Farm",
      "areaHectares": 3.31
    },
    "vegetation": {
      "ndvi": 0.8662,
      "date": "2026-09-16T00:00:00Z"
    },
    "map": {
      "image": "data:image/png;base64,...",
      "bounds": {
        "north": 7.379,
        "south": 7.377,
        "east": 3.381,
        "west": 3.377
      }
    }
  }
}
```

### What is ready

- Authenticated Axios infrastructure exists in `src/lib/api-client.ts`.
- Auth context is globally mounted by `src/routes/__root.tsx`.
- The satellite route exists at `src/routes/_app.satellite-monitoring.tsx`.
- The farm/field navigation area exists in `src/lib/nav.ts` and `src/routes/_app.farms.fields.tsx`.
- `PageShell`, `PageHeader`, `Section`, `Card`, `Badge`, `EmptyState`, `LoadingSpinner`, and `AIInsightCard` can support the feature UI.
- The current app has a consistent responsive layout and toaster/error conventions.
- The backend response shape includes a base64 image that can be displayed without a map library if geographic placement is not required.

### What is missing

- Field list/detail retrieval on the frontend.
- A field ID selection UI.
- A frontend field/vegetation response type.
- A field or field-intelligence service module.
- Vegetation endpoint calls.
- Loading/error/refresh state for vegetation data.
- Historical vegetation data display; the current satellite page only shows an empty history state.
- A real map implementation for fitting the returned image to geographic bounds.
- Client-side route protection and server-backed current-user refresh, if the feature needs stronger session guarantees.

### Likely consumption location

The most direct first integration point is `src/routes/_app.satellite-monitoring.tsx`, because its title, copy, and sections already describe field-level vegetation and NDVI monitoring. If Field Intelligence is intended as a separate product view rather than a satellite-monitoring enhancement, add a new file-based route and navigation item, but preserve the same app layout and page components.

The endpoint service should be called after a field is selected. The two requests can be sequential or parallel depending on whether the first response supplies the field selection and whether the map endpoint is expensive. The response should be normalized at the service boundary so the UI does not know about Axios response wrappers.

## 17. Recommended Files for the New Feature

These are recommendations based on the existing structure, not files that currently exist.

### Likely files to create

| File | Why |
| --- | --- |
| `src/lib/field-intelligence-service.ts` | Keeps `/api/fields/:fieldId/vegetation` and `/api/fields/:fieldId/vegetation/map` calls behind a reusable service boundary using `apiClient`. |
| `src/components/avrum/field-vegetation-card.tsx` | Optional reusable presentation for NDVI, observation date, field name, and area if the data will appear in multiple routes. |
| `src/components/avrum/vegetation-map-image.tsx` | Optional focused renderer for the base64 image and bounds metadata; useful even before a real basemap exists. |
| `src/routes/_app.field-intelligence.tsx` | Only if the product decision is to create a distinct `/field-intelligence` screen instead of extending satellite monitoring. |
| `src/lib/field-intelligence-types.ts` | Optional if response types become shared by dashboard, satellite, and field detail screens. A small feature can keep types in the service module instead. |

### Likely files to modify

| File | Why |
| --- | --- |
| `src/routes/_app.satellite-monitoring.tsx` | Most direct existing screen for vegetation/NDVI integration; add field selection, request state, and response rendering if this is an enhancement. |
| `src/routes/_app.farms.fields.tsx` | Natural place to select/open a field and connect field boundaries to monitoring. Current page has no field data flow. |
| `src/lib/nav.ts` | Add a Field Intelligence navigation item only if a distinct route is created. |
| `src/routes/_app.dashboard.tsx` | Optional later integration for summary NDVI/field health cards; not required for the first endpoint integration. |
| `src/components/avrum/index.ts` | Export any new shared presentation components created under `src/components/avrum`. |
| `src/routeTree.gen.ts` | Generated automatically after route changes; never edit by hand. |

### Files to reuse

- `src/lib/api-client.ts`: authenticated HTTP client and refresh behavior.
- `src/components/auth/auth-provider.tsx`: current user/auth context if the page needs session state.
- `src/components/avrum/page-shell.tsx`: page and section layout.
- `src/components/avrum/page-header.tsx`: title, actions, and breadcrumbs.
- `src/components/avrum/empty-state.tsx`: no field/no imagery states.
- `src/components/avrum/loading.tsx`: spinners and skeletons.
- `src/components/avrum/ai-insight-card.tsx`: field health or interpretation panel if appropriate.
- `src/components/ui/select.tsx`: field selector.
- `src/components/ui/card.tsx`, `badge.tsx`, and `alert.tsx`: response and error presentation.
- `src/components/ui/sonner.tsx`: existing toaster integration for action feedback.

## 18. Potential Conflicts

- A real map is not implemented. `MapPlaceholder` is visual only.
- Leaflet-related packages are installed but unused. Importing them will introduce the first actual map convention and may require CSS, SSR/client-only handling, and drawing behavior decisions.
- No frontend field type or field service exists.
- `/farms/fields` is already the conceptual field-boundary route, while `/satellite-monitoring` is already the conceptual vegetation route. A new Field Intelligence route could duplicate navigation unless the ownership boundary is decided first.
- `_app` and `_dev` routes are structurally nested but have no client-side authentication guard.
- API paths are not fully uniform. Auth uses `/auth/...`, onboarding uses `/v1/onboarding/...`, and diagnosis uses `/api/diagnosis/...`. Preserve the supplied field paths exactly until the backend contract is finalized.
- React Query is mounted but unused. Introducing it for one feature may establish a new convention; imperative Axios state would match the current crop doctor implementation more closely.
- `VITE_API_URL` points to the backend origin, not a versioned base path. Do not assume `/v1` is automatically included.
- `src/routeTree.gen.ts` is generated and must not be hand-edited.
- Current profile and developer screens contain static/mock data. Do not use those values as field API data.
- Some older documentation states that there is no API client or auth context. That is stale relative to `src/lib/api-client.ts`, `src/lib/auth-service.ts`, and `src/components/auth/auth-provider.tsx`.

## 19. Important Findings and Warnings

1. Do not create another Axios client. Use `src/lib/api-client.ts`.
2. Do not assume the current `/farms/fields` screen already has field IDs or polygon data; it is a placeholder.
3. Do not use `MapPlaceholder` as if it were a map. It renders no geographic data.
4. Do not edit `src/routeTree.gen.ts` manually.
5. Do not place provider or satellite credentials in frontend environment variables.
6. Use `VITE_API_URL` for the backend origin and preserve the existing bearer/refresh interceptor behavior.
7. There is no existing frontend `Field` type. Define the new response contract explicitly rather than reusing unrelated onboarding or diagnosis types.
8. The existing satellite route is the closest owner for NDVI/vegetation UI; decide whether the feature extends it before adding a new route.
9. Backend ownership checks are important because the frontend currently has no reliable route guard or field-access model.
10. Treat `Guide.md` and stale sections of `FRONTEND_GUIDE.md` as historical context where their claims conflict with current source.
11. The `map.image` value is a data URL. Avoid logging it, persisting it unnecessarily, or including it in error telemetry.
12. The endpoint's `bounds` are geographic metadata, not a substitute for a map renderer.

## 20. Final Frontend Architecture Summary

### Current stack

```text
React:             19.2
TypeScript:        5.8, strict, noEmit
Build tool:        Vite 8 through @lovable.dev/vite-tanstack-config
Routing:           TanStack Router 1.170 with TanStack Start file-based routes
State management:  React Context + local React state; React Query provider mounted but no query hooks used
API client:        Axios 1.20 in src/lib/api-client.ts
UI system:         Tailwind CSS 4, Radix/shadcn-style primitives, custom AVRUM components
Map library:       None used in source; Leaflet packages are installed but unused
Forms:             Native React forms, FormData, controlled/uncontrolled inputs
Validation:        Zod 3.24 for auth; no field/polygon validation exists
```

### Relevant existing files

| Area | File | Purpose |
| --- | --- | --- |
| Routing | `src/router.tsx` | Creates router and QueryClient context |
| Routing | `src/routes/__root.tsx` | Root shell, providers, scripts, outlet, errors |
| Routing | `src/routeTree.gen.ts` | Generated route tree; do not edit |
| App layout | `src/routes/_app.tsx` | AppShell layout route |
| App layout | `src/components/layout/app-shell.tsx` | Sidebar, top nav, mobile nav, theme, toaster |
| Navigation | `src/lib/nav.ts` | Desktop/mobile navigation metadata |
| API | `src/lib/api-client.ts` | Axios base URL, bearer header, token refresh |
| Authentication | `src/lib/auth-service.ts` | Auth and onboarding endpoint functions/types |
| Authentication | `src/components/auth/auth-provider.tsx` | Auth context, local user state, logout |
| Field placeholder | `src/routes/_app.farms.fields.tsx` | Boundary editor placeholder and empty state |
| Farm placeholder | `src/routes/_app.farms.tsx` | Farm list empty state |
| Vegetation owner | `src/routes/_app.satellite-monitoring.tsx` | NDVI/vegetation page placeholder |
| Dashboard | `src/routes/_app.dashboard.tsx` | Farm intelligence overview and map placeholder |
| Onboarding | `src/routes/onboarding.tsx` | Farm-related draft fields and autosave/completion |
| Map placeholder | `src/components/avrum/map-placeholder.tsx` | Non-functional visual map placeholder |
| Page layout | `src/components/avrum/page-shell.tsx` | Page and section layout primitives |
| Page header | `src/components/avrum/page-header.tsx` | Breadcrumbs, title, subtitle, actions |
| Empty state | `src/components/avrum/empty-state.tsx` | Standard no-data state |
| Loading | `src/components/avrum/loading.tsx` | Spinner and skeletons |
| UI | `src/components/ui/select.tsx` | Radix Select wrapper for field selectors |
| UI | `src/components/ui/card.tsx` | Card primitive |
| UI | `src/components/ui/badge.tsx` | Status and metric badges |
| UI | `src/components/ui/sonner.tsx` | Toast wrapper |
| Styling | `src/styles.css` | Tailwind entry, fonts, semantic color tokens |
| Environment | `.env.example` | `VITE_API_URL` and `VITE_WAITLIST_FORM_URL` names |

### Field Intelligence implementation notes

The frontend already provides the application shell, authenticated Axios transport, auth context, page conventions, loading/error/empty components, and an existing satellite-monitoring destination. It does not yet provide field selection, field models, vegetation API functions, a real map, or a vegetation data state model.

The safest first implementation boundary is a focused field-intelligence service plus typed response contracts, consumed by the existing satellite-monitoring route after a real field selection source is available. If the product requires a separate page, add a file-based route and navigation item while reusing the same app shell and presentation components. In both cases, preserve the existing `apiClient` and do not edit the generated route tree manually.
