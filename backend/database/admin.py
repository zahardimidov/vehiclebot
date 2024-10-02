from fastapi import Request
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend

from config import ADMIN_PASSWORD, ADMIN_USERNAME
from database.models import Vehicle, Row


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]

        if not (username == ADMIN_USERNAME and password == ADMIN_PASSWORD):
            return False

        request.session.update(
            {"token": "fdbb0dd1-a368-4689-bd71-5888f69b438e"})

        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        if not token == 'fdbb0dd1-a368-4689-bd71-5888f69b438e':
            return False
        return True


authentication_backend = AdminAuth(secret_key="secret")


class VehicleAdmin(ModelView, model=Vehicle):
    column_list = [Vehicle.name, Vehicle.slug, Vehicle.uuid]

class RowAdmin(ModelView, model=Row):
    column_list = [Row.name, Row.spending, Row.datetime, Row.vehicle]

def init_admin(app, engine):
    admin = Admin(app, engine=engine,
                  authentication_backend=authentication_backend)
    admin.add_view(VehicleAdmin)
    admin.add_view(RowAdmin)
