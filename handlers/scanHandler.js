const Hapi = require('@hapi/hapi');
const axios = require('axios');
const FormData = require('form-data');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();

// Configure Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH, // Path to your service account key
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

const scanHandler = {
    async getClasses(request, h) {
        try {
          const response = await axios.get(`${process.env.ML_API_URL}/classes`);
          return h.response(response.data).code(200);
        } catch (error) {
          console.error('Error fetching disease classes:', error);
          return h.response({ 
            message: 'Unable to retrieve disease classes', 
            error: error.message 
          }).code(500);
        }
      },

  async predictDisease(request, h) {
    console.log('Full Request Payload:', request.payload);
    const transaction = await pool.getConnection();

    try {
      // Detailed file extraction and validation
      const file = request.payload.image;
      
      if (!file) {
        console.error('No file in payload');
        return h.response({ message: 'No image file uploaded' }).code(400);
      }

      console.log('File Object:', {
        filename: file.filename,
        path: file.path,
        headers: file.headers
      });

      // Verify file path exists
      if (!file.path || !fs.existsSync(file.path)) {
        console.error('File path is invalid or file does not exist');
        return h.response({ message: 'Invalid file upload' }).code(400);
      }
      // Start transaction
      await transaction.beginTransaction();

      // Extract user info from auth credentials
      const userEmail = request.auth.credentials.email;
      const [userRows] = await transaction.execute(
        'SELECT user_id FROM user WHERE email = ?', 
        [userEmail]
      );
      const userId = userRows[0].user_id;

      // Generate unique entry ID
      const entryId = `scan${Math.floor(Math.random() * 1000).toString().padStart(5, '0')}`;

      // Prepare file metadata
      const originalFilename = file.filename;
      const fileExtension = originalFilename.split('.').pop();
      const cloudFilename = `fish-disease-scans/${entryId}_${Date.now()}.${fileExtension}`;
      
      // Upload file to Google Cloud Storage
      const bucket = storage.bucket(bucketName);
      const cloudFile = bucket.file(cloudFilename);
      
      await cloudFile.save(fs.readFileSync(file.path), {
        metadata: {
          contentType: file.headers['content-type']
        }
      });

      // Make the file publicly accessible
      await cloudFile.makePublic();
      const publicUrl = cloudFile.publicUrl();

      // Prepare for prediction API using pure Node.js approach
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path), {
        filename: originalFilename,
        contentType: file.headers['content-type']
      });

      // Prediction API call with raw axios configuration
      const predictionResponse = await axios({
        method: 'post',
        url: `${process.env.ML_API_URL}/predict`,
        data: formData,
        headers: {
          ...formData.getHeaders()
        }
      });

      const { class_name: diseaseName, confidence } = predictionResponse.data;

      // Check if the prediction is NOT a fish
      if (diseaseName === 'Not Fish') {
        // Optional: Clean up temporary file
        fs.unlinkSync(file.path);

        // Return warning response without saving to database or storage
        return h.response({
            message: 'Warning: Image does not contain a fish',
            diseaseName,
            confidence
        }).code(400);
    }

      // Insert entry into history
      const [result] = await transaction.execute(
        `INSERT INTO entry_history 
        (id_entry, user_id, img_url, disease_name, confidence_score, created_at, request_completed) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          entryId, 
          userId, 
          publicUrl, 
          diseaseName, 
          confidence
        ]
      );

      // Commit transaction
      await transaction.commit();

      // Optional: Clean up temporary file
      fs.unlinkSync(file.path);

      // Return response
      return h.response({
        entryId,
        imageUrl: publicUrl,
        diseaseName,
        confidence
      }).code(200);

    } catch (error) {
      // More comprehensive error logging and handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Prediction API Error:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        });
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
    } else {
        // Something happened in setting up the request
        console.error('Request Setup Error:', error.message);
    }
  
    // Rollback transaction
    await transaction.rollback();
  
    // More informative error response
    return h.response({
        message: 'Prediction processing failed',
        error: error.message,
        details: error.response?.data || 'Unknown error occurred',
        statusCode: error.response?.status || 500
    }).code(error.response?.status || 500);
    } finally {
      // Release the connection
      transaction.release();
    }
  }
};

module.exports = scanHandler;
