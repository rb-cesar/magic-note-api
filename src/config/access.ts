export const access = {
  port: Number(process.env.PORT!),
  db_access: process.env.DB_ACCESS!,
  secret_access_key: process.env.SECRET_ACCESS_KEY!,
  is_production: JSON.parse(process.env.PRODUCTION!) as boolean,

  aws: {
    bucket_name: process.env.AWS_BUCKET_NAME!,
    default_region: process.env.AWS_DEFAULT_REGION!,
    access_key_id: process.env.AWS_ACCESS_KEY_ID!,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}

export const whitelist = process.env.CORS_DOMAINS!.split(' | ').map(item => item.trim())
