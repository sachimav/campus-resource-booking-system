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
  "capcity": "130",
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

---

## How Install And Run 

1. **Clone the repository**
   ```bash
   git clone https://github.com/sachimav/campus-resource-booking-system.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd campus-resource-booking-system
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory and add the necessary environment variables (e.g., database connection string):
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## How Run Frontend
   
   open another terminal

    ```bash
   cd frontend 
   npm run dev
   ```

### Enjoy 😉

