import AWS from 'aws-sdk'
import { uri } from './access'

AWS.config.update({
  accessKeyId: uri.aws.access_key_id,
  secretAccessKey: uri.aws.secret_access_key,
  region: uri.aws.default_region,
})

export { AWS }
