import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { Blob } from 'buffer'
import { v4 as uuid } from 'uuid'
import { uri } from 'config/access'
import { AWS } from 'config/aws'
import { validate } from 'validators/globalValidator'

type FileOption = 'image' | 'video'

type UploadResultType = {
  validation: {
    error: boolean
    status: number
    message: string
  }
  data: AWS.S3.ManagedUpload.SendData | null
}

export class StorageService {
  private s3: AWS.S3 = {} as any
  private path: string = ''
  private fileType: FileOption = 'image'

  private image = {
    maxMB: 5 * 1024 ** 2, // 5 MB
    allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/gif'],
  }

  private video = {
    maxMB: 35 * 1024 ** 2, // 35 MB
    allowedMimes: ['video/mp4', 'video/mkv'],
  }

  constructor(fileType: FileOption) {
    this.s3 = new AWS.S3()
    this.fileType = fileType
  }

  private getParams(path: string, filename: string, buffer: Buffer) {
    const blob = new Blob([buffer])

    const params: PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${path}/${uuid()}-magic-note-${filename}`,
      Body: buffer,
      ContentType: blob.type,
      ACL: 'private',
    }

    return { params, blob }
  }

  private async validation(file: Express.Multer.File) {
    switch (this.fileType) {
      case 'image':
        return await validate(file, [
          ({ size }) => ({
            error: size > this.image.maxMB,
            status: 422,
            message: 'Image is large',
          }),
          ({ mimetype }) => ({
            error: !this.image.allowedMimes.includes(mimetype),
            status: 422,
            message: 'Invalid file format',
          }),
        ])

      case 'video':
        return await validate(file, [
          ({ size }) => ({
            error: size > this.video.maxMB,
            status: 422,
            message: 'Video is large',
          }),
          ({ mimetype }) => ({
            error: !this.video.allowedMimes.includes(mimetype),
            status: 422,
            message: 'Invalid file format',
          }),
        ])

      default:
        return {
          error: false,
          status: 200,
          message: 'saved',
        }
    }
  }

  async upload(path: string, file: Express.Multer.File): Promise<UploadResultType> {
    const { params } = this.getParams(path, file.originalname, file.buffer)

    const { error, status, message } = await this.validation(file)

    if (error) {
      return {
        data: null,
        validation: { error, status, message },
      }
    }

    const uploadPromise: Promise<AWS.S3.ManagedUpload.SendData> = new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => (err ? reject(err) : resolve(data)))
    })

    return {
      data: await uploadPromise,
      validation: { error, status, message },
    }
  }

  delete(src: string): Promise<AWS.S3.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: uri.aws.bucket_name,
          Key: src,
        },
        (err, data) => (err ? reject(err) : resolve(data))
      )
    })
  }

  fetchFile(src: string): Promise<AWS.S3.GetObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.getObject(
        {
          Bucket: uri.aws.bucket_name,
          Key: src,
        },
        (err, data) => (err ? reject(err) : resolve(data))
      )
    })
  }
}
