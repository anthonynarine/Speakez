# server/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ServerListViewSet, CategoryListViewSet

# Create an instance of DefaultRouter
# This router will automatically generate the URL patterns for our viewsets
router = DefaultRouter()

# Register the ServerListViewSet and CategoryListViewSet with the router
router.register("server/select", ServerListViewSet)
router.register("server/category", CategoryListViewSet)

# The router.urls attribute generates and returns a list of URL patterns
# based on the registered viewsets. These patterns include the standard
# actions provided by viewsets like list, create, retrieve, update, and destroy.
urlpatterns = router.urls

# Now, urlpatterns will include the following routes:
# - GET /server/select/         -> list action of ServerListViewSet
# - POST /server/select/        -> create action of ServerListViewSet
# - GET /server/select/{pk}/    -> retrieve action of ServerListViewSet
# - PUT /server/select/{pk}/    -> update action of ServerListViewSet
# - PATCH /server/select/{pk}/  -> partial_update action of ServerListViewSet
# - DELETE /server/select/{pk}/ -> destroy action of ServerListViewSet
# - GET /server/category/       -> list action of CategoryListViewSet
# - POST /server/category/      -> create action of CategoryListViewSet
# - GET /server/category/{pk}/  -> retrieve action of CategoryListViewSet
# - PUT /server/category/{pk}/  -> update action of CategoryListViewSet
# - PATCH /server/category/{pk}/-> partial_update action of CategoryListViewSet
# - DELETE /server/category/{pk}/-> destroy action of CategoryListViewSet
