import multer from 'multer';

// Configure multer to store uploaded files in the 'profilePictures' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'profilePictures/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.username}.jpg`);
  },
});

export const upload = multer({ storage }).single('photo');
