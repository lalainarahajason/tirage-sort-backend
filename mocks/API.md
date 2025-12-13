# API Specification (Draft)

This document outlines the API endpoints required by the frontend application.
Based on the TypeScript interfaces defined in `frontend/types/schemas.ts`.

## 1. Draws (Tirages)

### Models
**Draw**
```typescript
{
  id: string; // UUID
  title: string;
  description?: string;
  status: 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  scheduledAt?: string; // ISO Date (Optional)
  settings: {
      mode: 'WITH_REPLACEMENT' | 'NO_REPLACEMENT';
      type: 'UNIQUE' | 'SEQUENTIAL';
      nbWinners: number;
      presentationTheme?: string;
      excludeCategory?: string[];
  };
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  _count?: { // Count of related entities
      participants: number;
      winners: number;
      prizes: number;
  }
}
```

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **List** | `GET` | `/api/draws` | Get all draws | - | `Draw[]` |
| **Get** | `GET` | `/api/draws/:id` | Get specific draw | - | `Draw` |
| **Create** | `POST` | `/api/draws` | Create a new draw | `Partial<Draw>` | `Draw` |
| **Update** | `PATCH` | `/api/draws/:id` | Update draw (status, settings...) | `Partial<Draw>` | `Draw` |
| **Delete** | `DELETE` | `/api/draws/:id` | Delete a draw | - | `void` |

---

## 2. Participants

### Models
**Participant**
```typescript
{
  id: string; // UUID
  drawId: string; // UUID (Foreign Key)
  name: string;
  email?: string;
  category: string; // Default: 'STANDARD'
  ticketCount: number; // Default: 1 ([Weight] - Chance de gagner)
  ticketNumber: string; // [Unique ID] - Généré par le backend (ex: "T-2024-X8J9")
  importBatchId?: string; // Optional (if imported via CSV)
}
```

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **List** | `GET` | `/api/draws/:drawId/participants` | Get participants for a draw (Paginated) | Query: `?page=1&limit=10` | `{ data: Participant[], total: number }` |
| **Create** | `POST` | `/api/draws/:drawId/participants` | Add a single participant | `{ name, email?, category, ticketCount }` | `Participant` |
| **Import** | `POST` | `/api/draws/:drawId/participants/import` | Bulk import (CSV/Excel) | `FormData` (field: `file`) <br/> **Expected CSV Columns:** <br/> `name` (required) <br/> `email` (optional) <br/> `category` (optional, string, default: STANDARD) <br/> `ticketCount` (optional, integer, default: 1) | `{ count: number, batchId: string }` |
| **Delete** | `DELETE` | `/api/participants/:id` | Remove a participant | - | `void` |
| **Clear** | `DELETE` | `/api/draws/:drawId/participants` | Remove ALL participants for a draw | - | `void` |

---

## 3. Prizes (Prix / Lots)

### Models
**Prize**
```typescript
{
  id: string; // UUID
  drawId: string; // UUID (Foreign Key)
  name: string;
  description?: string;
  quantity: number;
  category?: string; // e.g. "High Tech", "Consolation"
  imageUrl?: string;
  displayOrder: number; // For sorting
}
```

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **List** | `GET` | `/api/draws/:drawId/prizes` | Get prizes for a draw | - | `Prize[]` |
| **Create** | `POST` | `/api/draws/:drawId/prizes` | Add a prize | `{ name, description, quantity, category }` | `Prize` |
| **Delete** | `DELETE` | `/api/prizes/:id` | Remove a prize | - | `void` |
| **Update** | `PATCH` | `/api/prizes/:id` | Update prize details | `Partial<Prize>` <br/> **Example Body:** <br/> ```json { "name": "Iphone 15 Pro", "quantity": 2 } ``` | `Prize` |

---

## 4. Draw Execution (Real-time)

*Pending Protocol Definition* via Socket.io.
---

## 5. Authentication

### Models
**User**
```typescript
{
  id: string; // UUID
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}
```

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/api/auth/login` | Authenticate user | `{ email, password }` | `{ token: string, user: User }` |
| **Register** | `POST` | `/api/auth/register` | Create account | `{ email, password, name }` | `{ token: string, user: User }` |
| **Recover** | `POST` | `/api/auth/recover` | Request password reset | `{ email }` | `{ message: string }` |
| **Reset** | `POST` | `/api/auth/reset` | Reset password with token | `{ token, newPassword }` | `{ message: string }` |
