import multer from 'multer';
import bcrypt from 'bcrypt';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads');
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // file.originalname
    // file.
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// const uploader = multer({ storage: storage })
export const uploader = multer({ storage });

export const generaHash = (password) => bcrypt.hashSync(password, 10);

export const validaPass = (pass, hash) => bcrypt.compareSync(pass, hash);
