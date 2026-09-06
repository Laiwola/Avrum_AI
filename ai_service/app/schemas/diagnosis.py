from typing import Optional

from pydantic import BaseModel, Field, field_validator


class DiseaseDetectionRequest(BaseModel):
    crop: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Crop being analyzed",
    )

    image_url: str = Field(
        ...,
        min_length=10,
        description="URL of the crop image",
    )

    @field_validator("crop")
    @classmethod
    def validate_crop(cls, value: str) -> str:
        return value.strip().lower()


class DiseaseInfo(BaseModel):
    name: Optional[str] = None

    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
    )


class DiseaseDetectionResponse(BaseModel):
    crop: str
    health_status: str
    disease: DiseaseInfo
    observations: list[str]


class AgronomistAdvice(BaseModel):
    overview: str
    symptoms: list[str]
    causes: list[str]
    treatment: list[str]
    prevention: list[str]
    severity: str
    recommended_action: str


class FullDiagnosisResponse(BaseModel):
    crop: str
    health_status: str
    disease: DiseaseInfo
    observations: list[str]
    agronomist_advice: AgronomistAdvice