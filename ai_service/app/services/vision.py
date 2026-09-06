import json
import os
from urllib.request import urlopen,Request

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas.diagnosis import (
    DiseaseDetectionResponse,
)

load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


SUPPORTED_CROPS = {
    "maize",
    "cassava",
    "rice",
    "tomato",
    "pepper",
}


async def detect_crop_disease(
    crop: str,
    image_url: str,
) -> DiseaseDetectionResponse:

    crop = crop.lower().strip()

    if crop not in SUPPORTED_CROPS:
        raise ValueError(
            f"Unsupported crop: {crop}. "
            f"Supported crops: {', '.join(SUPPORTED_CROPS)}"
        )
    req = Request(image_url)
    req.add_header("User-Agent", "Mozilla/5.0")
    # Download image from URL
    with urlopen(req) as response:
        image_bytes = response.read()

    prompt = f"""
You are an agricultural crop disease detection AI.

Analyze the provided image of a {crop} crop.

Your task is ONLY to identify the health condition
visible in the image.

Supported crop:
{crop}

Determine:

1. Whether the crop appears healthy or diseased.
2. If diseased, identify the most likely disease.
3. Estimate your confidence from 0.0 to 1.0.
4. List the important visible observations that support
   your diagnosis.

Important rules:

- Do not invent a disease if there is insufficient evidence.
- If the crop appears healthy, return health_status as "healthy"
  and disease name as null.
- If the image is unclear, damaged, poorly visible, or insufficient
  for reliable diagnosis, say so in the observations.
- Only analyze the visible evidence in the image.
- Return ONLY valid JSON.

Return exactly this structure:

{{
    "crop": "{crop}",
    "health_status": "healthy or diseased",
    "disease": {{
        "name": "disease name or null",
        "confidence": 0.0
    }},
    "observations": [
        "observation 1",
        "observation 2"
    ]
}}
"""

    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type="image/jpeg",
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[
            image_part,
            prompt,
        ],
        config=types.GenerateContentConfig(
            temperature=0.1,
            response_mime_type="application/json",
        ),
    )

    result = json.loads(response.text)

    return DiseaseDetectionResponse(**result)