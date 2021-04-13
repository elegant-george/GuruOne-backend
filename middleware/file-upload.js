const multer = require('multer');
const {v1: uuid} = require('uuid');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

aws.config.update({
  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.AWS_ACCESS_KEY}`,
  region: `${process.env.AWS_REGION}`
});

const s3 = new aws.S3();

const fileUpload = dest => multer({
  limits: 500000,
  storage: multerS3({
    s3: s3,
    bucket: 'guru-one',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuid() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

module.exports = fileUpload;