export const uri = {
  port: Number(process.env.PORT!),
  db_access: process.env.DB_ACCESS!,
  domains: process.env.CORS_DOMAINS!,
  secret_access_key: process.env.SECRET_ACCESS_KEY!,

  aws: {
    bucket_name: process.env.AWS_BUCKET_NAME!,
    default_region: process.env.AWS_DEFAULT_REGION!,
    access_key_id: process.env.AWS_ACCESS_KEY_ID!,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}
