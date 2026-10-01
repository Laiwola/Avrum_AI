from google import genai
from dotenv import load_dotenv
import os
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print("API key loaded:", bool(api_key))
client = genai.Client(
    api_key=api_key
)

print("Testing Gemini connection...")

try:
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Say hello"
    )

    print("SUCCESS!")
    print(response.text)

except Exception as e:
    print("FAILED")
    print("Type:", type(e).__name__)
    print("Error:", repr(e))