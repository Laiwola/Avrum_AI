import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas.diagnosis import (
    AgronomistAdvice,
    DiseaseDetectionResponse,
)


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def generate_agronomist_advice(
    detection: DiseaseDetectionResponse,
) -> AgronomistAdvice:

    disease_name = detection.disease.name

    # Healthy crop
    if detection.health_status.lower() == "healthy":

        prompt = f"""
You are an experienced agricultural agronomist assisting
a farmer.

The crop analyzed is: {detection.crop}

The AI vision system determined that the crop appears healthy.

Visible observations:
{json.dumps(detection.observations, indent=2)}

Provide useful agricultural guidance for maintaining the
health of this crop.

Do NOT invent a disease.

Return ONLY valid JSON using exactly this structure:

{{
    "overview": "...",
    "symptoms": [],
    "causes": [],
    "treatment": [],
    "prevention": [
        "..."
    ],
    "severity": "none",
    "recommended_action": "..."
}}

The response should be practical and understandable to a farmer.
"""

    else:

        prompt = f"""
You are an experienced agricultural agronomist.

Analyze the following AI crop disease detection and provide
practical agricultural guidance to the farmer.

Crop:
{detection.crop}

Detected disease:
{disease_name}

AI confidence:
{detection.disease.confidence}

Visible observations:
{json.dumps(detection.observations, indent=2)}

Provide:

1. A clear overview of the disease.
2. Common symptoms.
3. Likely causes and conditions that encourage the disease.
4. Practical treatment recommendations.
5. Prevention strategies.
6. Severity assessment.
7. The most important action the farmer should take now.

Important instructions:

- Base your explanation on the detected disease and visible
  observations.
- Do not claim certainty beyond what the evidence supports.
- Do not invent unsupported pesticide names, dosages, or
  application rates.
- If chemical treatment may be appropriate, advise the farmer
  to follow the product label and local agricultural guidance.
- Prioritize practical and safe agricultural recommendations.
- Make the explanation understandable to farmers.
- Do not give irrelevant information.
- Return ONLY valid JSON.

Return exactly this structure:

{{
    "overview": "...",
    "symptoms": [
        "...",
        "..."
    ],
    "causes": [
        "...",
        "..."
    ],
    "treatment": [
        "...",
        "..."
    ],
    "prevention": [
        "...",
        "..."
    ],
    "severity": "low, moderate, high, or severe",
    "recommended_action": "..."
}}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )

    result = json.loads(response.text)

    return AgronomistAdvice(**result)