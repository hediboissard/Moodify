const multer = require('multer')
const path = require('path')

// Chemin de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads') // <== ce dossier doit exister
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  }
})

const upload = multer({ storage })
module.exports = upload
