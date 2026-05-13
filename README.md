# campus-resource-booking-system

campus resource booking system API

## Problem Description
Campuses often manage shared resources manually (paper logs, spreadsheets, ad-hoc chats), which causes:
- Double bookings and time conflicts
- Lack of visibility into resource availability
- No centralized access control for students/staff/admins
- Difficult tracking of booking history
A centralized digital booking API is needed to streamline scheduling and improve resource utilization.
---
## Proposed Solution
This project provides a RESTful API that allows users to:
- Register and log in securely
- View available resources
- Create and manage bookings
- Prevent overlapping bookings for the same resource/time slot
- Manage resources through admin-level operations (can be extended with role-based controls)
The system uses MongoDB for persistence and Express.js for API routing and business logic.

---

## API Endpoints

### Base URL

> localhost:8000/api/

---

### User APIs

Base Path:  
`/api/auth`

### Register User
**POST** `/auth/register`

**Body Example:**

```json
{
  "name": "Kamal Silva",
  "email": "kamal@campus.edu",
  "password": "StrongPass123"
}
```
### User Login
**POST** `/auth/login`

**Body Example:**

```json
{
  "email": "kamal@campus.edu",
  "password": "StrongPass123"
}
```

### Resources APIs

Base Path:  
`/api/resources`

#### Get All Resources

**GET** `/api/resources/`  
Returns all resources.

#### Get Resource by ID

**GET** `/api/resources/:id`  
Returns a single resource.

#### Create Resource

**POST** `/api/resources/`

**Body Example:**

```json
{
  "name": "Lecture Hall A",
  "capcity": "Hall",
  "location": "applied Building",
  "status": "available"
}
```

#### update Resource

**put** `/api/resources/:id`

#### Delete Resource

**DELETE** `/api/resources/:id`

---

### Bookings APIs

Base Path:  
`/api/bookings`

#### Get All bookings

**GET** `/api/bookings/`  
Returns all bookings.

#### Get bookings by ID

**GET** `/api/bookings/:id`  
Returns a single bookings.

#### Create bookings

**POST** `/api/bookings/`

**Body Example:**

```json
{
  "userName": "kamal",
  "resourceId": "6a01714644c1a8dc0ad8323e",
  "date": "2026-05-20",
  "startTime": "10:00",
  "endTime": "12:00"
}
```

#### Delete bookings

**DELETE** `/api/bookings/:id`
