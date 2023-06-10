import multer from 'multer';
import path from 'path';

// Configure multer to store uploaded files in the 'profilePictures' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../profilePictures'));
  },
  filename: (req: any, file, cb) => {
    cb(null, `${req.user.username}.jpg`);
  },
});

export const upload = multer({ storage }).single('photo');
