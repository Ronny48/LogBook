# Unused Code Report - Data Collection Project

## Summary

This report identifies all unused code, imports, functions, variables, and API endpoints in the project.

---

## Frontend Issues

### 1. **CurrentUser Component** - [src/components/CurrentUser.jsx](src/components/CurrentUser.jsx)

- **UNUSED IMPORT**: `ReceptionBtn` is imported but never used in this component
- **UNUSED IMPORT**: `useState` hook imported but commented out
- **UNUSED CODE**: `useState` hook definition is commented out (line with `setShowAddVisit`)
- **UNUSED JSX**: Commented JSX for Popup component (`{showAddVisit && <Popup...}`)

### 2. **Search Component** - [src/components/Search.jsx](src/components/Search.jsx)

- **UNUSED IMPORT**: `FaFilter` icon from react-icons - imported but never rendered
- **UNUSED PROP**: `onFilterClick` parameter passed to component but never used

### 3. **AllVisits Component** - [src/components/AllVisits.jsx](src/components/AllVisits.jsx)

- **UNUSED FUNCTION**: `handleFilterClick()` - defined on line ~74 but never called anywhere in component

### 4. **OfficeVisit Component** - [src/components/OfficeVisit.jsx](src/components/OfficeVisit.jsx)

- **UNUSED VARIABLE**: `office` variable (line ~26) - retrieved from localStorage but never actually used
- **UNUSED FUNCTION**: `redirectVisit(visitId, newDestinationId)` - defined but never called anywhere
- **UNUSED STATE**: `redirectDestination` state - defined but not utilized
- **UNUSED VARIABLES**:
  - `completedVisits` - filtered but never rendered in JSX
  - `redirectedVisits` - filtered but never rendered in JSX
- **UNUSED CODE**: Status Tabs button (line ~185) - rendered but has no onClick handler or tab-switching logic
- **UNUSED DEPENDENCY**: `office` in useEffect dependency array (line ~68) - not actively used in the effect

### 5. **OfficeBtn Component** - [src/components/OfficeBtn.jsx](src/components/OfficeBtn.jsx)

- No unused code detected ✓

---

## Backend Issues

### 1. **server.js** - [BackEnd/src/server.js](BackEnd/src/server.js)

- **UNUSED CODE**: Commented CORS options line (line ~33) - `app.options("*", cors(corsOptions))` is unnecessary since `app.use(cors(corsOptions))` already enables CORS
- **UNUSED PARAMETER**: `next` parameter in error handler (line ~59) - marked with eslint-disable but genuinely unused

### 2. **auth.js Routes** - [BackEnd/src/routes/auth.js](BackEnd/src/routes/auth.js)

- **UNUSED ENDPOINT**: `GET /auth/me` - defined but never called from the frontend

### 3. **visits.js Routes** - [BackEnd/src/routes/visits.js](BackEnd/src/routes/visits.js)

- **UNUSED ENDPOINT**: `GET /visits/:id` - defined with history retrieval logic but never called from frontend

---

## Summary by Type

### Unused Imports (Frontend)

| File            | Import               | Status         |
| --------------- | -------------------- | -------------- |
| CurrentUser.jsx | ReceptionBtn         | Can be removed |
| CurrentUser.jsx | useState (commented) | Can be removed |
| Search.jsx      | FaFilter             | Can be removed |

### Unused Functions/Methods

| File            | Function            | Status         |
| --------------- | ------------------- | -------------- |
| AllVisits.jsx   | handleFilterClick() | Can be removed |
| OfficeVisit.jsx | redirectVisit()     | Can be removed |

### Unused Variables/State

| File            | Variable                    | Status                                |
| --------------- | --------------------------- | ------------------------------------- |
| OfficeVisit.jsx | office                      | Can be removed                        |
| OfficeVisit.jsx | completedVisits             | Can be removed or implement rendering |
| OfficeVisit.jsx | redirectedVisits            | Can be removed or implement rendering |
| OfficeVisit.jsx | redirectDestination (state) | Can be removed                        |

### Unused Props

| File       | Prop          | Status         |
| ---------- | ------------- | -------------- |
| Search.jsx | onFilterClick | Can be removed |

### Unused API Endpoints (Backend)

| Route       | Method | Status         |
| ----------- | ------ | -------------- |
| /auth/me    | GET    | Can be removed |
| /visits/:id | GET    | Can be removed |

### Unused UI Elements

| File            | Element            | Status                    |
| --------------- | ------------------ | ------------------------- |
| OfficeVisit.jsx | Status Tabs button | Incomplete implementation |

---

## Recommendations

1. **High Priority**: Remove unused imports to reduce bundle size
2. **Medium Priority**: Remove unused functions and state variables that clutter code
3. **Low Priority**: Implement or remove unused UI elements (Status Tabs)
4. **Clean Code**: Verify if `/auth/me` and `/visits/:id` endpoints are truly not needed before removing

---

## Files Marked with Annotations

All files containing unused code have been annotated with `// UNUSED:` comments for easy identification.
