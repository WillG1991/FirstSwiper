const fetch = require('node-fetch');

async function verifyRecaptcha(token) {
    const secretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; //test key//
    // real key "6LfWD7AmAAAAABfLjOsUPtb0aVUCO1X0cBZnqxgP"

    // Send a POST request to the reCAPTCHA verification endpoint
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${secretKey}&response=${token}`
    });

    // Parse the response data
    const data = await response.json();

    // Log the response from the reCAPTCHA server
    console.log('Response from reCAPTCHA server:', {
        token,
        responseStatus: response.status,
        responseData: data
    });

    // Check if the reCAPTCHA verification is successful
    if (response.ok && data.success) {
        console.log('reCAPTCHA verification successful');
        return true;
    } else {
        console.log('reCAPTCHA verification failed');
        return false;
    }
}

module.exports = verifyRecaptcha;