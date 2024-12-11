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
