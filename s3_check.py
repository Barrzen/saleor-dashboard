import os
import sys
import uuid

import boto3
from botocore.exceptions import ClientError, NoCredentialsError

# 🔹 OPTIONAL: Define AWS credentials inside the script
# (Better to set them in the environment, but this works too)
os.environ["AWS_ACCESS_KEY_ID"] = "6005a803f524"
os.environ["AWS_SECRET_ACCESS_KEY"] = "a35f6fc4ced226e46244"
os.environ["AWS_DEFAULT_REGION"] = "auto"  # Change if needed
AWS_S3_ENDPOINT_URL = "https://a8b3bfc44d3008d6f8bdedaac7e697a3.r2.cloudflarestorage.com"  # Change if needed

s3 = boto3.client("s3", endpoint_url=AWS_S3_ENDPOINT_URL)

def check_s3(bucket_name):
    test_key = f"test-object-{uuid.uuid4()}.txt"
    test_content = b"Hello, this is a test object for S3 check."

    try:
        print("1️⃣ Checking bucket access...")
        s3.head_bucket(Bucket=bucket_name)
        print(f"✅ Bucket '{bucket_name}' is accessible.")

        print("2️⃣ Uploading test object...")
        s3.put_object(Bucket=bucket_name, Key=test_key, Body=test_content)
        print("✅ Upload successful.")

        print("3️⃣ Listing objects...")
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=test_key)
        if "Contents" in response:
            print("✅ Object listed successfully.")
        else:
            print("❌ Object not found in list.")
            return False

        print("4️⃣ Downloading test object...")
        obj = s3.get_object(Bucket=bucket_name, Key=test_key)
        data = obj["Body"].read()
        if data == test_content:
            print("✅ Download successful and content matches.")
        else:
            print("❌ Content mismatch.")
            return False

        print("5️⃣ Deleting test object...")
        s3.delete_object(Bucket=bucket_name, Key=test_key)
        print("✅ Object deleted successfully.")

        print("\n🎉 All S3 operations completed successfully!")

        return True

    except NoCredentialsError:
        print("❌ AWS credentials not found. Please configure them.")
        return False
    except ClientError as e:
        print(f"❌ AWS ClientError: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def cleanup_bucket(bucket_name):
    confirm = input(f"⚠️ Are you sure you want to delete ALL objects in bucket '{bucket_name}'? (yes/no): ")

    if confirm.lower() != "yes":
        print("❌ Cleanup cancelled.")
        return

    try:
        print(f"🗑️ Cleaning up bucket '{bucket_name}'...")
        paginator = s3.get_paginator("list_objects_v2")

        for page in paginator.paginate(Bucket=bucket_name):
            if "Contents" in page:
                for obj in page["Contents"]:
                    print(f"   Deleting: {obj['Key']}")
                    s3.delete_object(Bucket=bucket_name, Key=obj["Key"])

        print("✅ Bucket cleanup completed.")
    except ClientError as e:
        print(f"❌ AWS ClientError: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python check_s3.py <bucket-name> [check|cleanup]")
        sys.exit(1)

    bucket = sys.argv[1]
    action = sys.argv[2]

    if action == "check":
        success = check_s3(bucket)
        sys.exit(0 if success else 1)
    elif action == "cleanup":
        cleanup_bucket(bucket)
    else:
        print("❌ Unknown action. Use 'check' or 'cleanup'.")
