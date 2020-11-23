const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
    cloud_name: 'niesder',
    api_key: '424128613469254',
    api_secret: 'KWCGXP6A489KSYu-WuO6mziFDhc'
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fotos-webuild',
        format: async (req, file) => 'jpg'
    }
})

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud