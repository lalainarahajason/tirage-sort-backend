# API Specification (Draft)

This document outlines the API endpoints required by the frontend application.
Based on the TypeScript interfaces defined in `frontend/types/schemas.ts`.

## 1. Draws (Tirages)

### Models
**Draw**
```typescript
{
  id: string; // UUID
  userId: string; // UUID - Owner of the draw
  title: string;
  description?: string;
  status: 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE'; // Access control level
  shareToken?: string; // UUID - Token for share URL generation
  shortCode?: string; // 8-char code for short share URLs (e.g., /s/X8K7m2nP)
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

### Visibility Levels
| Level | Description |
| :--- | :--- |
| `PUBLIC` | Anyone can view the presentation page via short URL |
| `PRIVATE` | Only the owner can view (requires authentication) |

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **List** | `GET` | `/api/draws` | Get all draws | - | `Draw[]` |
| **Get** | `GET` | `/api/draws/:id` | Get specific draw | - | `Draw` |
| **Create** | `POST` | `/api/draws` | Create a new draw | `Partial<Draw>` | `Draw` |
| **Update** | `PATCH` | `/api/draws/:id` | Update draw (status, settings, visibility...) | `Partial<Draw>` | `Draw` |
| **Delete** | `DELETE` | `/api/draws/:id` | Delete a draw | - | `void` |
| **Share** | `POST` | `/api/draws/:id/share` | Generate short URL code | - | `{ shareToken: string, shortCode: string }` |
| **Get by ShortCode** | `GET` | `/api/s/:code` | Get draw by short code (PUBLIC only) | - | `Draw` |

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
| **History** | `GET` | `/api/participants/history` | Get unique participants from past draws | Query: `?excludeDrawId=...` | `Participant[]` |

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

## 4. Winners

### Models
**Winner**
```typescript
{
  id: string; // UUID
  drawId: string; // UUID
  participantId: string; // UUID
  prizeId: string; // UUID
  wonAt: string; // ISO Date
}

**WinnerWithDetails**
```typescript
{
  ...Winner,
  participant: Participant;
  prize: Prize;
}
```
```

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **List** | `GET` | `/api/draws/:drawId/winners` | Get winners for a draw | - | `WinnerWithDetails[]` |

---

## 5. Cron (Vercel)

### Endpoints
| Type | Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Process** | `POST` | `/api/cron/process-scheduled-draws` | Execute scheduled draws (Vercel Cron) | - (Bearer: CRON_SECRET) | `{ success, processedCount, results[] }` |

> **Note**: This endpoint is called automatically by Vercel Cron every minute. It finds draws where `scheduledAt` has passed and executes them.

---

## 6. Authentication

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
