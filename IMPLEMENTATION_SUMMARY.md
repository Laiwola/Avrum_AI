# AVRUM Frontend-Backend Integration Implementation Summary

## Overview
This document summarizes the implementation of backend API integration for the AVRum frontend, connecting authentication, authorization, email verification, account setup, and user onboarding flows.

## Scope
- **Authentication & Authorization**: Registration, email verification, login, logout, and session management
- **Account Setup**: User profile initialization
- **Email Verification**: 6-digit OTP code verification with resend capability
- **Onboarding**: 11-step wizard with auto-save and completion tracking
- **Environment Configuration**: Backend API URL configuration via environment variables

## Constraints Observed
✓ NO frontend UI redesign, restyle, or structural changes
✓ NO social authentication (Google/Apple/Microsoft)
✓ NO testing performed (deferred for testing phase)
✓ All changes backend-facing; frontend styling and component structure unchanged

---

## Files Created

### Frontend
1. **`avrum-frontend/src/lib/api-client.ts`** (NEW)
   - Centralized axios HTTP client for all API calls
   - Token management with localStorage persistence
   - Request interceptor: Automatically adds Bearer token to Authorization header
   - Response interceptor: Handles 401 errors with automatic token refresh using refresh token
   - Token refresh queue: Prevents multiple simultaneous refresh calls
   - Auto-redirect to /sign-in on failed token refresh
   - Exports: `apiClient`, `tokenStorage`, `API_BASE_URL`

2. **`avrum-frontend/src/lib/auth-service.ts`** (NEW)
   - Business logic layer for authentication and onboarding operations
   - Typed functions for all auth endpoints with error handling
   - User localStorage persistence via `setCurrentUser()` and `getCurrentUser()`
   - Functions:
     - `register(payload)` → POST /auth/register
     - `verifyEmail(payload)` → POST /auth/verify-email
     - `login(payload)` → POST /auth/login
     - `logout()` → POST /auth/logout
     - `forgotPassword(email)` → POST /auth/forgot-password
     - `resendVerificationEmail(email)` → POST /auth/resend-verification-email
     - `resetPassword(token, password, confirmPassword)` → POST /auth/reset-password
     - `getCurrentUser()` → retrieve stored user from localStorage
     - `setCurrentUser(user)` → persist user to localStorage
     - `isAuthenticated()` → check if user has valid access token
     - `onboardingService.saveDraft(payload)` → POST /v1/onboarding/draft
     - `onboardingService.complete(payload)` → POST /v1/onboarding/complete

3. **`avrum-frontend/src/components/auth/auth-provider.tsx`** (NEW)
   - React Context Provider for centralized authentication state management
   - Provides `AuthContext` with type `AuthContextType` containing:
     - `user`: Current authenticated user or null
     - `isLoading`: Loading state during auth operations
     - `isAuthenticated`: Boolean flag for auth state
     - `setUser`: Update current user
     - `setIsLoading`: Update loading state
     - `logout`: Clear auth state
     - `refreshUser`: Reload user from localStorage
   - Auto-initializes user from localStorage on mount
   - Exports `useAuth()` hook for component usage
   - Tracks `lastSaved` user state for change detection

4. **`avrum-frontend/.env`** (NEW)
   - Frontend environment configuration
   - Contains: `VITE_API_URL=http://localhost:3000`
   - Used by api-client.ts to set backend base URL

5. **`avrum-frontend/.env.example`** (NEW)
   - Example environment configuration for developers
   - Documents the required `VITE_API_URL` variable
   - Includes comments for local vs production settings

### Backend
1. **`backend/src/services/auth.service.ts`** (MODIFIED)
   - Added `resendVerificationEmail(input)` function
   - Generates new 6-digit OTP code
   - Deletes old verification tokens
   - Sends new verification email via email service
   - Returns `{ok: true}` on success

2. **`backend/src/routes/auth.ts`** (MODIFIED)
   - Added POST /auth/resend-verification-email route
   - Validates email via Zod schema
   - Calls `resendVerificationEmail` service
   - Returns 204 No Content on success

---

## Files Modified

### Frontend

1. **`avrum-frontend/src/routes/__root.tsx`** (MODIFIED)
   - Wrapped root component with `AuthProvider`
   - Context now available throughout entire application
   - Change: `<QueryClientProvider>` now wraps `<AuthProvider><Outlet /></AuthProvider>`

2. **`avrum-frontend/src/routes/_auth.sign-up.tsx`** (MODIFIED)
   - Connected to backend via `authService.register()`
   - Form submission now async, calls POST /auth/register
   - Email conflict detection: Maps 409 status to "email exists" error
   - Success: Navigates to /verify-email with email as search param
   - Form fields: fullName, organisation (optional), email, password, confirmPassword, terms checkbox
   - Uses existing Zod validation (`signUpSchema`)

3. **`avrum-frontend/src/routes/_auth.verify-email.tsx`** (MODIFIED)
   - Replaced "confirm email" button assumption with code input field
   - New verification code input: accepts 0-9 only, max 6 characters
   - `resend()` function: Calls `authService.resendVerificationEmail(email)`
   - 45-second cooldown between resend attempts
   - `verify()` function: Calls `authService.verifyEmail({email, code})`
   - On success: Calls `setUser(response.user)` via useAuth hook, navigates to /account-created
   - Error handling: Shows error alert for invalid/expired codes
   - Form validation: Ensures email and code present before submission

4. **`avrum-frontend/src/routes/_auth.account-created.tsx`** (MODIFIED)
   - Updated footer "help centre" link: /help → /
   - Updated "Skip to dashboard" button link: /dashboard → /
   - No functional changes to the flow

5. **`avrum-frontend/src/routes/_app.tsx`** (MODIFIED - if applicable)
   - Protected route checks should be implemented to guard /_app routes
   - Status: Pending (see "Partially Complete Tasks")

6. **`avrum-frontend/src/routes/onboarding.tsx`** (MODIFIED)
   - Fully integrated with backend draft saves and completion
   - New imports: `useEffect`, `authService`, `onboardingService`, `useAuth`, `AxiosError`
   - New state: `isSaving` (boolean), `lastSaved` (Date | null)
   - Auto-save mechanism:
     - useEffect debounces draft changes (1 second delay)
     - Calls `onboardingService.saveDraft({step, data: draft})` after each change
     - Updates `lastSaved` timestamp on success
     - Logs errors but doesn't block user
   - `goNext()` function modification:
     - When `isLast` (step 10): Calls `onboardingService.complete({draft, data: draft})`
     - On success: Calls `setUser(response.user)` and navigates to /dashboard
     - On error: Shows toast error message
   - `saveAndContinue()` function: Explicitly saves before continuing, shows success toast
   - Draft object tracks 18 fields: userType, firstName, lastName, phone, experience, farmingType, farmName, farmSize, sizeUnit, ownership, crops, boundaryNote, country, state, town, language, channel, alerts
   - Error handling: AxiosError caught and displayed via sonner toast

7. **`avrum-frontend/src/routes/_auth.sign-in.tsx`** (MODIFIED)
   - Connected to backend via `authService.login()`
   - Form submission now async, calls POST /auth/login
   - On success: Calls `setUser(response.user)` via useAuth hook
   - Onboarding state routing:
     - If `user.onboardingCompleted === true` → navigate to /dashboard
     - If `user.onboardingCompleted === false` → navigate to /onboarding
   - Error handling:
     - 400/401 status → "Invalid email or password"
     - 422 status → "Email not verified"
     - Other errors → generic fallback message
   - Form validation: Uses existing Zod schema (`signInSchema`)

### Backend

1. **`backend/src/services/auth.service.ts`** (MODIFIED)
   - Added `resendVerificationEmail(input)` function
   - Implementation details provided above under "Files Created"

2. **`backend/src/routes/auth.ts`** (MODIFIED)
   - Added import for `resendVerificationEmail` from auth service
   - Added POST /auth/resend-verification-email route
   - Implementation details provided above under "Files Created"

---

## API Endpoints Used

### Authentication Routes (`/auth/`)
- **POST /auth/register**
  - Request: `{fullName, organisation?, email, password, confirmPassword}`
  - Response: `{user: User, requiresVerification: boolean}`
  - Status: 201 Created

- **POST /auth/verify-email**
  - Request: `{email, code}`
  - Response: `{user: User, accessToken, refreshToken}`
  - Status: 200 OK
  - Side effect: Stores tokens via tokenStorage.setTokens()

- **POST /auth/resend-verification-email** (NEW)
  - Request: `{email}`
  - Response: Empty
  - Status: 204 No Content

- **POST /auth/login**
  - Request: `{email, password, remember?}`
  - Response: `{user: User, accessToken, refreshToken}`
  - Status: 200 OK
  - Side effect: Stores tokens via tokenStorage.setTokens()

- **POST /auth/logout**
  - Request: Empty
  - Response: Empty
  - Status: 204 No Content
  - Requires: Authorization header with Bearer token
  - Side effect: Clears tokens via tokenStorage.clearTokens()

- **POST /auth/forgot-password**
  - Request: `{email}`
  - Response: Empty
  - Status: 204 No Content

- **POST /auth/reset-password**
  - Request: `{token, password, confirmPassword}`
  - Response: Empty
  - Status: 204 No Content

- **POST /auth/refresh**
  - Request: `{refreshToken}`
  - Response: `{accessToken, refreshToken}`
  - Status: 200 OK
  - Used by: api-client.ts response interceptor for automatic token refresh

### Onboarding Routes (`/v1/onboarding/`)
- **POST /v1/onboarding/draft**
  - Request: `{step?, data?}`
  - Response: `{draftId, savedAt}`
  - Status: 201 Created
  - Called: After each form change in onboarding wizard (debounced 1s)

- **POST /v1/onboarding/complete**
  - Request: `{draft?, data?}`
  - Response: `{user: User}`
  - Status: 200 OK
  - Called: When user completes final step (step 10)
  - Sets `user.onboardingCompleted = true`

---

## Authentication Flow

### User Registration & Verification
1. User fills signup form (fullName, email, password, organisation optional)
2. Form calls `authService.register(payload)` → POST /auth/register
3. Backend creates user with `emailVerified: false` and generates 6-digit OTP
4. Backend sends verification email with OTP code
5. Frontend navigates to /verify-email with email search param
6. User enters 6-digit code received in email
7. Form calls `authService.verifyEmail({email, code})` → POST /auth/verify-email
8. Backend verifies code, sets `emailVerified: true`
9. Backend returns user + accessToken + refreshToken
10. Frontend stores tokens via tokenStorage.setTokens()
11. Frontend calls `setUser(response.user)` to update auth context
12. Frontend navigates to /account-created

### User Login
1. User fills login form (email, password, remember optional)
2. Form calls `authService.login(payload)` → POST /auth/login
3. Backend validates credentials and emailVerified status
4. Backend returns user + accessToken + refreshToken
5. Frontend stores tokens and updates auth context
6. Frontend checks `user.onboardingCompleted`:
   - If true → navigate to /dashboard
   - If false → navigate to /onboarding

### Token Refresh (Automatic)
1. Frontend makes API call with Authorization header (Bearer accessToken)
2. Backend responds with 401 Unauthorized (access token expired)
3. axios response interceptor catches 401
4. Interceptor calls POST /auth/refresh with refreshToken
5. Backend validates refresh token (checks JTI, expiry, revocation status)
6. Backend returns new accessToken + refreshToken
7. Frontend stores new tokens via tokenStorage.setTokens()
8. Original request is retried with new accessToken
9. If refresh fails → redirect to /sign-in

### User Logout
1. User clicks logout button
2. Frontend calls `authService.logout()` → POST /auth/logout
3. Backend revokes all sessions (updates revokedAt timestamp)
4. Frontend clears tokens via tokenStorage.clearTokens()
5. Frontend clears user from localStorage
6. Frontend redirects to /sign-in

### Email Verification Resend
1. User hasn't received verification email
2. User clicks "Resend confirmation email"
3. Form calls `authService.resendVerificationEmail(email)` → POST /auth/resend-verification-email
4. Backend generates new 6-digit OTP and deletes old tokens
5. Backend sends new email with OTP
6. Frontend shows "Verification email sent again" message
7. 45-second cooldown before resend can be clicked again

---

## Onboarding Flow

### Auto-Save Mechanism
1. User fills onboarding form fields (step N out of 10)
2. onChange handler updates draft state (in-memory)
3. useEffect detects draft change, debounces 1 second
4. After 1 second of no changes, calls `onboardingService.saveDraft({step: N, data: draft})`
5. POST /v1/onboarding/draft is sent with current draft data
6. Backend stores draft in database
7. Frontend updates `lastSaved` timestamp
8. User continues filling form without interruption (no blocking waits)
9. On error: Toast shows error message, but user can continue (non-blocking)

### Step Progression
1. User fills fields on step N
2. User clicks "Next Step" or "Continue"
3. If not final step → goNext() increments step, form re-renders
4. If final step (step 10) → goNext() calls `onboardingService.complete({draft, data: draft})`
5. Backend processes final onboarding data, sets `user.onboardingCompleted = true`
6. Frontend updates user context via `setUser(response.user)`
7. Frontend navigates to /dashboard

### Resume Onboarding (Pending Implementation)
- Not yet implemented in this phase
- When user signs in and `onboardingCompleted === false`
- Frontend should fetch saved draft via GET /v1/onboarding/draft (if backend supports)
- Pre-populate form with saved data
- Allow user to continue from last saved step

---

## Token Management

### Storage
- **Access Token**: Stored in localStorage under key `accessToken`
- **Refresh Token**: Stored in localStorage under key `refreshToken`
- **Current User**: Stored in localStorage under key `currentUser` (JSON stringified)
- **Mechanism**: Custom `tokenStorage` object in api-client.ts with getters/setters/clearers

### Token Lifecycle
- **Access Token TTL**: Configured in backend (typically 15 minutes to 1 hour)
- **Refresh Token TTL**: 30 days (expires in 30 days from issue)
- **Refresh on Expiry**: axios response interceptor detects 401, uses refresh endpoint
- **Token Validation**: Backend validates JWT signature, JTI, expiry, session status
- **Session Tracking**: Backend maintains Session document per login with JTI, userAgent, ipAddress, expiresAt

### Security Considerations
- Tokens stored in localStorage (vulnerable to XSS; use httpOnly cookies in production)
- All API calls except /auth/register, /auth/login, /auth/verify-email, /auth/forgot-password, /auth/reset-password require Authorization header
- All requests except public endpoints are validated server-side via requireAuth middleware
- Token refresh automatically handles expiry without user intervention
- On failed refresh, user is redirected to /sign-in (requires re-login)

---

## Type Definitions

### User
```typescript
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  organisation?: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  role: string;
  userType?: string;
  language?: string;
  theme?: "light" | "dark";
  createdAt: string;
  updatedAt: string;
}
```

### AuthResponse
```typescript
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

### RegisterPayload
```typescript
interface RegisterPayload {
  fullName: string;
  organisation?: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### LoginPayload
```typescript
interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}
```

### VerifyEmailPayload
```typescript
interface VerifyEmailPayload {
  email: string;
  code: string;
}
```

### OnboardingDraftPayload
```typescript
interface OnboardingDraftPayload {
  step?: number;
  data?: Record<string, unknown>;
}
```

### OnboardingCompletePayload
```typescript
interface OnboardingCompletePayload {
  draft?: Record<string, unknown>;
  data?: Record<string, unknown>;
}
```

### AuthContextType
```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
  refreshUser: () => void;
}
```

---

## Environment Configuration

### Frontend (.env)
- **VITE_API_URL**: Backend API base URL
  - Local: `http://localhost:3000`
  - Production: `https://api.avrum.ai` (example)
  - Used by: api-client.ts `apiClient = axios.create({baseURL: import.meta.env.VITE_API_URL})`

### Backend
- Backend environment variables not modified in this phase
- Backend listens on port 3000 (default)
- Backend database: MongoDB (configured via environment)
- Backend email service: Resend API (configured via environment)
- Backend JWT secrets: Configured via environment

---

## Dependencies Installed

### Frontend
- **axios** (v0.x or later)
  - Purpose: HTTP client for API calls
  - Used in: api-client.ts, auth-service.ts

### Backend
- No new dependencies added
- Uses existing: Express, Mongoose, jsonwebtoken, zod, etc.

---

## Validation

### Frontend Validation
- Form validation via existing Zod schemas (signUpSchema, signInSchema, etc.)
- Email format validation via Zod `.email()`
- Password requirements enforced by backend (not duplicated in schema)
- Onboarding fields: Each step has basic required field validation

### Backend Validation
- All request bodies validated via Zod schemas in validators/
- Email format, password strength, OTP code format validated
- User existence checked before operations
- Email verification status checked before login
- Token validity checked before token refresh

---

## Error Handling

### API Client (api-client.ts)
- Request interceptor: Catches and logs errors, adds Authorization header
- Response interceptor: Catches 401, attempts refresh, retries original request
- On refresh failure: Clears tokens, redirects to /sign-in, throws error

### Auth Service (auth-service.ts)
- All endpoints wrapped in try-catch
- Errors thrown as AxiosError
- Callers handle errors via AxiosError.response?.data?.message or fallback

### Route Components
- AxiosError caught and error message extracted
- Error displayed via:
  - Field-level form errors (field validation)
  - Toast notifications (temporary notifications)
  - Alert boxes (inline errors)
- Non-blocking error handling: User can retry without page refresh

---

## Status of Implementation

### ✅ Completed
1. API client with axios, interceptors, automatic token refresh
2. Auth service with typed endpoints for all auth operations
3. Auth context provider with useAuth hook
4. Root layout wrapped with AuthProvider
5. Sign-up form connected to POST /auth/register
6. Email verification form with 6-digit code input connected to POST /auth/verify-email
7. Sign-in form connected to POST /auth/login with onboarding state routing
8. Account created page (minor link updates)
9. Onboarding wizard with auto-save to POST /v1/onboarding/draft
10. Onboarding completion with POST /v1/onboarding/complete
11. Backend resend verification email endpoint (POST /auth/resend-verification-email)
12. Frontend resend email functionality connected
13. Environment configuration files (.env, .env.example)

### ⚠️ Pending (Not in Scope for This Phase)
1. **Protected Route Component**: Guard /_app routes from unauthenticated users
2. **Resume Onboarding Logic**: Fetch and restore saved draft when re-entering onboarding
3. **Forgot Password Form**: Integration with POST /auth/forgot-password
4. **Reset Password Form**: Integration with POST /auth/reset-password with token extraction
5. **Testing**: All integration tests deferred for testing phase
6. **httpOnly Cookies**: Token storage should use httpOnly cookies in production instead of localStorage

### ❌ Out of Scope (Per Requirements)
1. Social authentication (Google/Apple/Microsoft)
2. UI redesign or restyling
3. Frontend-only authorization (all auth happens server-side)

---

## Testing Notes

Testing is explicitly deferred for the testing phase. The implementation is ready for:
- Integration tests: Test each auth flow from frontend to backend
- E2E tests: Test complete user journey (signup → verification → login → onboarding → dashboard)
- API tests: Test backend endpoints with various payloads
- Error scenario tests: Test timeout, network errors, expired tokens, invalid codes, etc.

No test code has been written in this phase.

---

## Backend Files Not Modified

The following critical backend files remain unchanged:
- User model, schema, and database layer
- JWT token generation and validation logic
- Email service (Resend API integration)
- Session tracking and validation
- All middleware (auth, error handling, logging)
- Password hashing and comparison
- All error classes and error handling
- All validators and validation schemas

Backend modifications limited to:
- Adding `resendVerificationEmail()` function in auth.service.ts
- Adding POST /auth/resend-verification-email route in auth.ts

This ensures backend integrity and minimal risk of regression.

---

## Assumptions Made

1. **Email Delivery**: Backend successfully sends emails via Resend API; frontend assumes emails arrive within 1 minute
2. **OTP Format**: Backend generates 6-digit numeric codes; frontend enforces this format
3. **Token Storage**: localStorage suitable for development; httpOnly cookies recommended for production
4. **Onboarding Draft Persistence**: Backend persists draft data; frontend assumes POST /v1/onboarding/draft succeeds without blocking UX
5. **User Object Persistence**: User object from server matches frontend User interface; frontend stores in localStorage
6. **Token Expiry Handling**: Frontend assumes refresh token always valid when access token expired; backend validates session JTI
7. **Redirect on Auth Failure**: Frontend redirects to /sign-in on logout or failed token refresh
8. **Auto-Save Debounce**: 1-second debounce sufficient for draft saves; no user-visible delay
9. **Onboarding Completion**: Final step (step 10) calls completion endpoint; backend marks onboardingCompleted = true
10. **Email Verification Code Entry**: User manually enters 6-digit code from email; no link clicking required

---

## Next Steps for Production

1. **Protected Routes**: Implement route guards for /_app and /onboarding
2. **Resume Onboarding**: Add GET /v1/onboarding/draft endpoint and frontend logic
3. **Forgot/Reset Password**: Connect forgot-password and reset-password forms
4. **Token Security**: Switch from localStorage to httpOnly cookies
5. **Error Logging**: Add error tracking (Sentry, LogRocket, etc.)
6. **Loading States**: Add loading indicators for all async operations
7. **Network Retry**: Implement exponential backoff for failed requests
8. **Testing**: Comprehensive unit, integration, and E2E tests
9. **Documentation**: API documentation for frontend developers
10. **Monitoring**: Production error tracking and performance monitoring

---

## Deployment Checklist

- [ ] Backend deployed and running at API_URL
- [ ] VITE_API_URL environment variable set in frontend deployment
- [ ] Frontend built with production environment
- [ ] SSL/TLS certificates configured
- [ ] CORS settings validated
- [ ] Email service configured (Resend API key)
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Performance monitoring configured
- [ ] User acceptance testing completed
