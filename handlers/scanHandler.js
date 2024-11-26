const axios = require('axios');

const scanHandler = {

uploadEntry : async (request, h) => {
    try {
        // Get the image URL from the request payload
        const { image_url } = request.payload;
        
        // Send request to FastAPI prediction endpoint
        const response = await axios.post('http://0.0.0.0:3500/predict_url', {
            image_url: image_url
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Prediction error:', error);
        
        // Check if the error is from the FastAPI backend
        if (error.response) {
            return h.response({
                error: 'Failed to predict fish disease',
                details: error.response.data
            }).code(error.response.status);
        }
        
        // Generic error handling
        return h.response({
            error: 'Failed to predict fish disease',
            details: error.message
        }).code(500);
    }
}};

module.exports = scanHandler;
