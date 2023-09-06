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
const messageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../messageImages'));
  },
  filename: (req: any, file, cb) => {
    cb(null, `${req.params.messageId}.${file.mimetype.split('/')[1]}`);
  },
});

export const upload = multer({ storage }).single('photo');
export const messageUpload = multer({ storage: messageStorage }).single('image');