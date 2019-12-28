'use-strict'

const gcsUpload = require('gcs-upload')
module.exports = gcsUpload({    
    limits: {
      fileSize: 1e6
    },
    gcsConfig: {
      keyFilename: './google-credential.json',
      bucketName: 'royhan-mardista-image'
    }
})