import { getEnv, loadEnvironment } from "../config/env.js";

loadEnvironment();
const env=getEnv();

interface DiagnosisRequest {
  crop: string;
  image_url: string;
}

export interface DiagnosisResponse {
  crop: string;
  health_status: "healthy" | "diseased" | "unknown";
  disease: {
    name: string | null;
    confidence: number;
  };
  observations: string[];
  agronomist_advice: {
    overview: string;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    prevention: string[];
    severity: string;
    recommended_action: string;
  };
}

export async function analyzeCrop(
  data: DiagnosisRequest
): Promise<DiagnosisResponse> {
  const response = await fetch(
    `${env.AI_SERVICE_URL}/api/v1/diagnosis/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crop: data.crop,
        image_url: data.image_url,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("AI service error:", {
      status: response.status,
      body: errorText,
    });

    throw new Error("AI service failed to analyze crop image");
  }

  return (await response.json()) as DiagnosisResponse;
}