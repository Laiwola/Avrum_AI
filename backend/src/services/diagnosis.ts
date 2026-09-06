import { analyzeCrop } from "./ai.service.js";
import { Diagnosis } from "../models/Diagnosis.js";

export async function analyzeCropImage(
  crop: string,
  imageUrl: string
) {
  const diagnosis = await analyzeCrop({
    crop,
    image_url: imageUrl,
  });

  return diagnosis;
}




export async function saveDiagnosis(
  diagnosis: Awaited<ReturnType<typeof analyzeCrop>>,
  imageUrl: string,
  imageKey?: string,
  userId?: string
) {
  const savedDiagnosis = await Diagnosis.create({
    userId: userId || undefined,

    crop: diagnosis.crop,

    imageUrl,

    imageKey,

    healthStatus: diagnosis.health_status,

    disease: {
      name: diagnosis.disease.name,
      confidence: diagnosis.disease.confidence,
    },

    observations: diagnosis.observations,

    agronomistAdvice: {
      overview: diagnosis.agronomist_advice.overview,
      symptoms: diagnosis.agronomist_advice.symptoms,
      causes: diagnosis.agronomist_advice.causes,
      treatment: diagnosis.agronomist_advice.treatment,
      prevention: diagnosis.agronomist_advice.prevention,
      severity: diagnosis.agronomist_advice.severity,
      recommendedAction:
        diagnosis.agronomist_advice.recommended_action,
    },
  });

  return savedDiagnosis;
}
