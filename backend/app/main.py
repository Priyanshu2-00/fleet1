from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db

from app.routers import auth, shipments, vehicles, locations, trips, optimize, ws, tracking, alerts, analytics, simulation

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="AgriFleet API",
    description="Smart Agricultural Produce Logistics & Fleet Coordination Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(shipments.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(locations.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(optimize.router, prefix="/api")
app.include_router(ws.router)
app.include_router(tracking.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AgriFleet API", "version": "1.0.0"}

# adding a seed endpoint
from app.database import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
@app.post("/api/seed")
async def run_seed(db: AsyncSession = Depends(get_db)):
    from app.seed.seed_data import seed_database
    await seed_database(db)
    return {"message": "Database seeded successfully"}
