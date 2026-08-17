import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import async_sessionmaker_instance, init_db
from app.models.location import Location
from app.models.user import User, Farmer, Driver
from app.models.vehicle import Vehicle
from app.models.shipment import Shipment
from app.core.enums import LocationType, UserRole, VehicleStatus, ShipmentStatus, Priority
from app.core.auth import hash_password

async def seed_database(db: AsyncSession):
    # Check if we already have data
    result = await db.execute(select(User).limit(1))
    if result.scalars().first():
        return

    # Locations
    depot = Location(name="AgriFleet Depot", latitude=18.5204, longitude=73.8567, type=LocationType.DEPOT)
    cc1 = Location(name="Pune Collection Center", latitude=18.5314, longitude=73.8446, type=LocationType.COLLECTION_CENTER)
    cc2 = Location(name="Hinjewadi Collection Center", latitude=18.5912, longitude=73.7390, type=LocationType.COLLECTION_CENTER)
    
    db.add_all([depot, cc1, cc2])
    
    farm_locations = []
    # 15 farms
    for i in range(1, 16):
        loc = Location(name=f"Farm Location {i}", latitude=18.50 + (i*0.01), longitude=73.50 + (i*0.01), type=LocationType.FARM)
        farm_locations.append(loc)
    
    db.add_all(farm_locations)
    await db.flush()

    # Users
    hashed_pwd = hash_password("demo123")
    
    admin = User(name="Admin User", phone="9999999999", email="admin@agrifleet.com", password_hash=hashed_pwd, role=UserRole.ADMIN)
    fm1 = User(name="Rajesh Patil", phone="8888888881", email="rajesh@agrifleet.com", password_hash=hashed_pwd, role=UserRole.FLEET_MANAGER)
    fm2 = User(name="Sunita Deshmukh", phone="8888888882", email="sunita@agrifleet.com", password_hash=hashed_pwd, role=UserRole.FLEET_MANAGER)
    
    db.add_all([admin, fm1, fm2])

    driver_names = ['Arun Kumar', 'Vijay Singh', 'Mahesh Jadhav', 'Suresh Pawar', 'Ramesh Gaikwad']
    drivers = []
    for name in driver_names:
        u = User(name=name, phone=f"777777777{len(drivers)}", email=f"{name.split()[0].lower()}@driver.com", password_hash=hashed_pwd, role=UserRole.DRIVER)
        db.add(u)
        await db.flush()
        d = Driver(user_id=u.id, license_number=f"MH12{len(drivers)}1234")
        db.add(d)
        drivers.append(d)

    farmer_names = ["Anil", "Baban", "Chandu", "Datta", "Eknath", "Ganesh", "Hari", "Ishwar", "Janardan", "Kiran", "Laxman", "Maruti", "Narayan", "Omkar", "Prakash"]
    farmers = []
    for i, name in enumerate(farmer_names):
        u = User(name=f"{name} Farmer", phone=f"66666666{i:02d}", email=f"{name.lower()}@farmer.com", password_hash=hashed_pwd, role=UserRole.FARMER)
        db.add(u)
        await db.flush()
        f = Farmer(user_id=u.id, farm_name=f"{name}'s Farm", location_id=farm_locations[i].id)
        db.add(f)
        farmers.append(f)

    # Vehicles
    v1 = Vehicle(registration_number="AGR-01", vehicle_type="Tata Ace", capacity=2.0, status=VehicleStatus.AVAILABLE, current_location_id=depot.id)
    v2 = Vehicle(registration_number="AGR-02", vehicle_type="Mahindra Bolero Pickup", capacity=1.5, status=VehicleStatus.AVAILABLE, current_location_id=depot.id)
    v3 = Vehicle(registration_number="AGR-03", vehicle_type="Eicher Pro", capacity=5.0, status=VehicleStatus.AVAILABLE, current_location_id=depot.id)
    v4 = Vehicle(registration_number="AGR-04", vehicle_type="Ashok Leyland Dost", capacity=2.5, status=VehicleStatus.AVAILABLE, current_location_id=depot.id)
    v5 = Vehicle(registration_number="AGR-05", vehicle_type="Tata 407", capacity=4.0, status=VehicleStatus.AVAILABLE, current_location_id=depot.id)
    
    db.add_all([v1, v2, v3, v4, v5])
    await db.flush()

    # Shipments
    produce_types = ["Onions", "Tomatoes", "Potatoes", "Wheat", "Rice", "Sugarcane", "Grapes", "Pomegranate", "Soybean", "Jowar"]
    for i in range(15):
        s = Shipment(
            farmer_id=farmers[i].id,
            pickup_location_id=farm_locations[i].id,
            destination_location_id=cc1.id if i % 2 == 0 else cc2.id,
            produce_type=produce_types[i % len(produce_types)],
            quantity=0.3 + (i % 5)*0.3,
            priority=Priority.NORMAL,
            status=ShipmentStatus.REQUESTED
        )
        db.add(s)

    await db.commit()

async def main():
    await init_db()
    async with async_sessionmaker_instance() as db:
        await seed_database(db)

if __name__ == '__main__':
    asyncio.run(main())
