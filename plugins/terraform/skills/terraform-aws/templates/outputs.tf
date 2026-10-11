output "assets_bucket_name" {
  description = "Name of the assets S3 bucket."
  value       = aws_s3_bucket.assets.id
}
