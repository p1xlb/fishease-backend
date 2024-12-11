# Fishease Backend with Hapi.js
### Completed Features
- User Register / Login
- User Email Change
- User Forgot Password
- User Authentication for protected contents
- Pulling Scan History Data per user basis with token bearer
- Pulling Scan History per entry basis
- Deleting a Scan history
- Uploading Image to Google Cloud Storage Bucket
- Calling the model prediction API for image predictions

### Dependencies used
- Hapi.js
- Axios
- JWT
- Joi
- Nodemailer
- Bcrypt
- Crypto
- Swagger
- MySQL2
- Inert
- Vision
- Google Cloud Storage

## How to use
1. Install dependencies
```
npm install
```
2. Setup environment (.env)
```
PORT=3000
HOST=0.0.0.0
JWT_SECRET=

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

GOOGLE_USER=
GOOGLE_PASS=

GOOGLE_CLOUD_KEY_PATH=
GOOGLE_CLOUD_PROJECT_ID=

GOOGLE_CLOUD_BUCKET_NAME=

FRONTEND_URL=
ML_API_URL=
```
3. Run application
```
npm run start
```

## Routes
Swagger documentations can be found in /documentation
- POST /login<br/>
Logs in a user and gets a token
```
// Body Request
{
  "email": "string",
  "password": "string"
}

// Body Response
{
    "token": "token_here"
    "message": "Login successful"
}
```

- POST /register<br/>
Registers a new user
```
// Body Request
{
  "email": "string",
  "password": "string",
  "name": "string",
  "phone": "string"
}

// Body Response
{
    "status":"success",
    "message":"User created successfully",
    "data":{
        "id":int,
        "email":"string",
        "name":"string",
        "phone":"string",
        "created_at":"current_timestamp"
    }
}
```

- POST /requestReset<br/>
Request a password reset
```
// Body Request
{
    "email": "string"
}

// Body Response
{ 
    "status": 'success', 
    "message": 'Password reset link sent' 
}
```

- POST /resetPassword<br/>
Reset password with token authentication
```
// Body Request
{
    "token": "string"
    "newPassword" : "string"
}

// Body Response
{ 
    "status": 'success', 
    "message": 'Password reset successfully' 
}
```

- POST /update-mail<br/>
Update user's email
```
// Body Request
{
    "newEmail": "string"
    "password": "string"
}

// Body Response
{ 
    "status": 'success', 
    "message": 'Password reset link sent' 
}
```

- GET /userInfo<br/>
Get logged in user info
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Body Response
{ 
    "status": 'success', 
    "data":{
        "id":int,
        "email":"string",
        "name":"string",
        "phone":"string",
        "created_at":"current_timestamp"
    }
}
```

- POST /disease-info<br/>
Get disease details from database
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Body Request
{
    "disease_name": "string"
}

// Body Response
{ 
    "status": 'success', 
    "data":{
        "disease_id":int,
        "disease_name":"string",
        "description":"string",
        "affected_fish":"string"
    } 
}
```

- GET /scan-history<br/>
Get user's scan history
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Body Response
{ 
    "status": 'success', 
    "total_scans": int
    "data":[
        {
            "id_entry": "string",
            "img_url": "string",
            "disease_name": "string",
            "confidence_score": float,
            "created_at": "timestamp",
            "request_completed": "timestamp"
        }
    ]
}
```

- GET /scan-history/{id_entry}<br/>
Get user's scan history
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Body Response
{ 
    "status": 'success', 
    "total_scans": int
    "data":{
        "id_entry": "string",
        "img_url": "string",
        "disease_name": "string",
        "confidence_score": float,
        "created_at": "timestamp",
        "request_completed": "timestamp"
    }
}
```

- DELETE /scan-history/{id_entry}<br/>
Deletes a scan entry
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Body Response
{ 
    "status": 'success',
    "message": 'Scan entry deleted successfully',
    "deleted_entry_id": id_entry
}
```

- GET /service/classes<br/>
Get disease classes from model API
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Body Response
[
    "classes"
]
```

- POST /service/predict<br/>
Predict disease from uploaded image
```
// Headers
{
    "Authorization: Bearer {token}"
}

// Form Data
{
    "file": image
}

// Body Response
{
    "entryId": "string",
    "imageUrl": "string",
    "diseaseName": "string",
    "confidence": float
}