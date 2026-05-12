# campus-resource-booking-system

campus resource booking system API

## API Endpoints

### Base URL

> localhost:8000/api/

---

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
