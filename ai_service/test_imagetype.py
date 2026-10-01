import json
import os
from urllib.request import urlopen,Request
from google.genai import types
image_url=input("Enter the image URL of the crop: ")

req = Request(image_url)
req.add_header("User-Agent", "Mozilla/5.0")

with urlopen(req) as response:
    image_bytes = response.read()
    mime_type = response.headers.get("Content-Type", "").split(";")[0]

print("Image URL:", image_url)
print("MIME type:", mime_type)
print("Image size:", len(image_bytes))

SUPPORTED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
}

if mime_type not in SUPPORTED_MIME_TYPES:
    raise ValueError(
        f"URL did not return a supported image. "
        f"Received Content-Type: {mime_type}"
    )

image_part = types.Part.from_bytes(
    data=image_bytes,
    mime_type=mime_type,
)