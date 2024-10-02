from datetime import datetime as dt

from database.requests import add_row, get_rows, get_vehicles, get_row, delete_row
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response  # type: ignore

router = APIRouter(prefix='', tags=['API сервиса'])


@router.post('/vehicles')
async def vehicles(request: Request):
    elements = await get_vehicles()
    data = jsonable_encoder(elements)

    return JSONResponse(content=data)

@router.post('/rows')
async def rows(request: Request):
    data = await request.json()
    elements = await get_rows(uuid=data['vehicle_id'])

    data: dict = jsonable_encoder(elements)

    for row in data:
        new_date = row['datetime'][-2:] + '/' + row['datetime'][5:7] + '/' + row['datetime'][:4]
        row['date'] = new_date

    return JSONResponse(content=data)


@router.post('/add_row')
async def add_row_(request: Request):
    data = await request.json()

    name = data['name']
    spending = int(data['spending'])
    datetime = dt.strptime(data['date'], "%d/%m/%Y")
    vehicle_id = data['vehicle_id']

    row = await add_row(name=name, spending=spending, datetime=datetime, vehicle_id=vehicle_id)

    return JSONResponse(content=jsonable_encoder(dict(
        name = row.name,
        spending = row.spending,
        date = data['date'],
        uuid = row.uuid
    )))


@router.post('/remove_row')
async def remove_row_(request: Request):
    data: dict = await request.json()

    print('delete', data.get('row_id'))

    if get_row(data.get('row_id')):
        await delete_row(row_uuid=data['row_id'])
        
        return Response(status_code=200)
    return Response(status_code=400)


@router.post('/filterRows')
async def filterRows(request: Request):
    data: dict = await request.json()

    data = await request.json()
    elements = await get_rows(uuid=data['vehicle_id'], range_filter=data['range'])

    data: dict = jsonable_encoder(elements)

    for row in data:
        new_date = row['datetime'][-2:] + '/' + row['datetime'][5:7] + '/' + row['datetime'][:4]
        row['date'] = new_date

    return JSONResponse(content=data)
