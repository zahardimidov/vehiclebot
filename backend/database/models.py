import uuid

from sqlalchemy import BigInteger, String, Date, Integer, ForeignKey
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship


def generate_uuid():
    return str(uuid.uuid4())


class Base(AsyncAttrs, DeclarativeBase):
    pass


class Vehicle(Base):
    __tablename__ = 'vehicle'

    uuid = mapped_column(String, name="uuid", primary_key=True, default=generate_uuid)
    name = mapped_column(String, nullable=False)
    slug = mapped_column(String, nullable=False)

    def __repr__(self) -> str:
        return self.name


class Row(Base):
    __tablename__ = 'rows'

    uuid = mapped_column(String, name="uuid", primary_key=True, default=generate_uuid)
    
    datetime = mapped_column(Date, nullable=False)
    name = mapped_column(String, nullable=False)
    spending = mapped_column(Integer)

    vehicle_uuid = mapped_column(ForeignKey('vehicle.uuid'))
    vehicle: Mapped["Vehicle"] = relationship()

    def __repr__(self) -> str:
        return self.name
