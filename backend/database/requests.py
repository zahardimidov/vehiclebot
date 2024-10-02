from sqlalchemy import select, delete, desc

from database.models import Vehicle, Row
from database.session import async_session
from datetime import datetime as dt

async def get_vehicle(slug) -> Vehicle:
    async with async_session() as session:
        user = await session.scalar(select(Vehicle).where(Vehicle.uuid == slug))

        return user

async def get_vehicles() -> list[Vehicle]:
    async with async_session() as session:
        vehicles = await session.scalars(select(Vehicle))

        return list(vehicles)
    
async def get_rows(uuid, range_filter = None) -> list[Row]:
    async with async_session() as session:
        if range_filter and range_filter[0]:
            start = dt.fromisoformat(range_filter[0][:-1]).date()
            if not range_filter[1]:
                rows = await session.scalars(select(Row).where(Row.vehicle_uuid == uuid, Row.datetime == start).order_by(desc(Row.datetime)))
            else:
                end = dt.fromisoformat(range_filter[1][:-1]).date()
                rows = await session.scalars(select(Row).where(Row.vehicle_uuid == uuid, Row.datetime >= start, Row.datetime <= end).order_by(desc(Row.datetime)))

            return list(rows)

        rows = await session.scalars(select(Row).where(Row.vehicle_uuid == uuid).order_by(desc(Row.datetime)))

        return list(rows)
    
async def add_row(name, spending, datetime, vehicle_id):
    async with async_session() as session:
        row = Row(name = name, spending = spending, datetime = datetime, vehicle_uuid = vehicle_id)

        session.add(row)
        await session.commit()
        await session.refresh(row)

    return row

async def get_row(row_uuid) -> Row:
    async with async_session() as session:
        row = await session.scalar(select(Row).where(Row.uuid == row_uuid))

        return row
    
async def delete_row(row_uuid) -> Row:
    async with async_session() as session:
        await session.execute(delete(Row).where(Row.uuid == row_uuid))
        await session.commit()