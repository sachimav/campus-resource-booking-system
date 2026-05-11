# campus-resource-booking-system
campus resource booking system API 

## API Endpoints

### Base URL
> localhost:8000/api/

---

### Resources APIs
Base Path:  
`/api/dashboard/resources`


#### Get All Resources
**GET** `/api/dashboard/resources/`  
Returns all resources.


#### Get Resource by ID
**GET** `/api/dashboard/resources/:id`  
Returns a single resource.


#### Create Resource
**POST** `/api/dashboard/resources/`

**Body Example:**
```json
{
  "name": "Lecture Hall A",
  "capcity": "Hall",
  "location":"applied Building",
  "status":"available"
}

```

#### update Resource
**put** `/api/dashboard/resources/:id`

#### Create Resource
**POST** `/api/dashboard/resources/`

---