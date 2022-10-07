import AWS from 'aws-sdk'
import { access } from './access'

AWS.config.update({
  accessKeyId: access.aws.access_key_id,
  secretAccessKey: access.aws.secret_access_key,
  region: access.aws.default_region,
})

export { AWS }
