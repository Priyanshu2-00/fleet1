from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./agrifleet.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    JWT_SECRET_KEY: str = "supersecretkey"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    OSRM_BASE_URL: str = "http://router.project-osrm.org"
    
    OPT_WEIGHT_DISTANCE: float = 1.0
    OPT_WEIGHT_DELAY: float = 2.0
    OPT_WEIGHT_UNUSED_CAPACITY: float = 0.5
    OPT_WEIGHT_OPERATIONAL_COST: float = 1.0
    
    SIM_UPDATE_INTERVAL_SECONDS: int = 3
    SIM_VEHICLE_SPEED_KMPH: int = 40

    class Config:
        env_file = ".env"

settings = Settings()
