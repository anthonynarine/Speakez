from http.client import responses
from multiprocessing import managers
import logging

from django.shortcuts import render
import drf_spectacular
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from .models import Category, Server
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import ServerSerializer, CategorySerializer
from rest_framework.response import Response
from django.db.models import Count
# from .schema import server_list_docs
from typing import Dict, Any
from drf_spectacular.utils import extend_schema

# Configure logging
logger = logging.getLogger(__name__)


class CategoryListViewSet(viewsets.ViewSet):
    queryset = Category.objects.all().order_by("-name")
    
    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)
    


class ServerListViewSet(viewsets.ViewSet):
    """
    A ViewSet for listing or retrieving servers.

    Attributes:
        queryset: The initial queryset of Server objects from the database.
    """
    # permission_classes = [IsAuthenticated]
    queryset = Server.objects.all()
    
    @extend_schema(responses=ServerSerializer)
    def list(self, request)-> Dict[str, Any]:
        """
        Retrieve a list of servers based on provided query parameters.

        The **ServerListViewSet** allows for _rich querying and filtering_ of servers.
        This method handles the query parameters and shapes the response accordingly.

        ## Query Parameters:
            - `category` (str, optional): Filter servers by the name of the category.
            - `num_results` (int, optional): Limits the number of servers returned in the response.
            - `by_user` (bool, optional): Filters servers by the user ID. Only valid if user is authenticated.
            - `by_serverid` (str, optional): Filters servers by a specific server ID.
            - `with_num_members` (bool, optional): Annotates each server in the response with the number of members it has.

        Args:
            `request` (Request): Django REST Framework request object.

        Returns:
            `Response`: Contains serialized server data based on the applied filters and annotations. Each object in the response represents a server.

        Raises:
            `AuthenticationFailed`: Raised when an unauthenticated user tries to filter servers by user or by server id.
            `ValidationError`: Raised when an invalid server id is provided or when the server id specified for filtering does not exist.
        """
        queryset = self.queryset
        
        # Fetch query parameters
        category = request.query_params.get("category")
        num_results = request.query_params.get("num_results")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"
        
        # Log the received query parameters
        logger.info("Received query parameters: category=%s, num_results=%s, by_user=%s, by_serverid=%s, with_num_members=%s",
                    category, num_results, by_user, by_serverid, with_num_members)


        # If user-specific or server-specific requests are made, check authentication
        # if (by_user or by_serverid) and not request.user.is_authenticated:
        #     # raise AuthenticationFailed()

        # If by_user is true, filter the queryset by the user
        if by_user:
            self.queryset = self.queryset.filter(member=request.user.id)
            logger.info("Filtered servers by user: %s", request.user.id)

        # If a category is specified, filter the queryset by the category
        if category:
            self.queryset = self.queryset.filter(category__name=category)
            logger.info("Filtered servers by category: %s", category)

        # If with_num_members is true, annotate the queryset with a count of members
        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("members"))
            logger.info("Annotated servers with number of members")

        # If num_results is specified, limit the queryset to the specified number of results
        if num_results:
            self.queryset = self.queryset[: int(num_results)]
            logger.info("Limited number of servers to: %s", num_results)

        # If by_serverid is specified, filter the queryset by the server id
        if by_serverid:
            self.queryset = self.queryset.filter(id=by_serverid)
            if not self.queryset.exists():
                raise ValidationError(detail=f"Server with id {by_serverid} not found")
            logger.info("Filtered servers by server id: %s", by_serverid)
            

        # Serialize the queryset and return the serialized data
        serializer = ServerSerializer(self.queryset, many=True)
        return Response(serializer.data)


# Tutorial on the annotate() method
# https://cyber-fibre-739.notion.site/Leveraging-Django-Annotations-in-Django-REST-Framework-f4ecb3c5c139424f8531f602142d5b63?pvs=4