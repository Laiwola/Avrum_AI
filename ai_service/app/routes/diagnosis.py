from fastapi import APIRouter, HTTPException
import traceback
from app.schemas.diagnosis import (
    DiseaseDetectionRequest,
    FullDiagnosisResponse,
)
from app.services.vision import detect_crop_disease
from app.services.agronomist import generate_agronomist_advice


router = APIRouter(
    prefix="/api/v1",
    tags=["Diagnosis"],
)


@router.post(
    "/diagnosis/analyze",
    response_model=FullDiagnosisResponse,
)
async def analyze_crop(
    request: DiseaseDetectionRequest,
):

    try:
        # 1. Analyze crop image
        detection = await detect_crop_disease(
            crop=request.crop,
            image_url=request.image_url,
        )

        # 2. Generate agronomist explanation
        advice = await generate_agronomist_advice(
            detection=detection,
        )

        # 3. Combine both results
        result = FullDiagnosisResponse(
            crop=detection.crop,
            health_status=detection.health_status,
            disease=detection.disease,
            observations=detection.observations,
            agronomist_advice=advice,
        )

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        print(f"Diagnosis error: {error}")
        print("========== DIAGNOSIS ERROR ==========")
        print(f"Error type: {type(error).__name__}")
        print(f"Error message: {str(error)}")
        print("Full traceback:")
        traceback.print_exc()
        print("=====================================")


        raise HTTPException(
            status_code=500,
            detail="Unable to analyze crop image",
        )