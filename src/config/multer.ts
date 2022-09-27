import { S3Client } from '@aws-sdk/client-s3'
import { Options } from 'multer'
import multerS3 from 'multer-s3'
import { v4 as uuid } from 'uuid'
import { uri } from 'config/access'

type ConfigOptionsType = {
  path: string
  maxMB: number
  allowedMimes: string[]
}

export function createMulterConfig({ path, maxMB, allowedMimes }: ConfigOptionsType) {
  const multerConfig: Options = {
    storage: multerS3({
      s3: new S3Client({ region: uri.aws.default_region }),
      bucket: uri.aws.bucket_name,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function (req, file, cb) {
        cb(null, `${path}/${uuid()}-magic-note-st-${file.originalname}`)
      },
    }),
    fileFilter: function (req, file, cb) {
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)

        return
      }

      new Error('Invalid file type')
    },
    limits: {
      fileSize: maxMB * 1024 * 1024, // 2 MB
    },
  }

  return multerConfig
}
