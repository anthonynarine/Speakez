from http.client import responses
from multiprocessing import managers
import logging

from django.shortcuts import render
import drf_spectacular
from rest_framework.exceptions import ValidationError, AuthenticationFailed, NotFound
from .models import Category, Server
from rest_framework import viewsets, status
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
    serializer_class = CategorySerializer
    
    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        """
        Handles the GET request to list all categories.

        If no categories are found, raises a NotFound exception.
        Otherwise, serializes the queryset and returns it with a 200 OK status.

        Args:
            request (Request): The request object.

        Returns:
            Response: A DRF Response object containing the serialized data and HTTP status code.
        """
        queryset = self.queryset
        # Check if the queryset is empty
        if not queryset.exists():
            # Raise a NotFound exception if no categories are found
            raise NotFound(detail="No categories found.")
        
        # Serialize the queryset to convert it to JSON format
        serializer = CategorySerializer(queryset, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ServerListViewSet(viewsets.ViewSet):
    """
    A ViewSet for listing or retrieving servers.

    Attributes:
        queryset: The initial queryset of Server objects from the database.
    """
    queryset = Server.objects.all()
    
    @extend_schema(responses=ServerSerializer)
    def list(self, request) -> Response:
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
            request (Request): Django REST Framework request object.

        Returns:
            Response: Contains serialized server data based on the applied filters and annotations. Each object in the response represents a server.

        Raises:
            AuthenticationFailed: Raised when an unauthenticated user tries to filter servers by user or by server id.
            ValidationError: Raised when an invalid server id is provided or when the server id specified for filtering does not exist.
        """
        queryset = self.queryset
        
        # Fetch query parameters
        category = request.query_params.get("category")
        num_results = request.query_params.get("num_results")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"
        
        # Log the received query parameters
        logger.info(
            "Received query parameters: category=%s, num_results=%s, by_user=%s, by_serverid=%s, with_num_members=%s",
            category, num_results, by_user, by_serverid, with_num_members
        )

        # If user-specific or server-specific requests are made, check authentication
        if (by_user or by_serverid) and not request.user.is_authenticated:
            raise AuthenticationFailed(detail="Authentication required for this request.")

        # If by_user is true, filter the queryset by the user
        if by_user:
            queryset = queryset.filter(member=request.user.id)
            logger.info("Filtered servers by user: %s", request.user.id)

        # If a category is specified, filter the queryset by the category
        if category:
            queryset = queryset.filter(category__name=category)
            logger.info("Filtered servers by category: %s", category)

        # If with_num_members is true, annotate the queryset with a count of members
        if with_num_members:
            queryset = queryset.annotate(num_members=Count("members"))
            logger.info("Annotated servers with number of members")

        # If num_results is specified, limit the queryset to the specified number of results
        if num_results:
            queryset = queryset[: int(num_results)]
            logger.info("Limited number of servers to: %s", num_results)

        # If by_serverid is specified, filter the queryset by the server id
        if by_serverid:
            queryset = queryset.filter(id=by_serverid)
            if not queryset.exists():
                raise ValidationError(detail=f"Server with id {by_serverid} not found")
            logger.info("Filtered servers by server id: %s", by_serverid)

        # Serialize the queryset and return the serialized data
        serializer = ServerSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Tutorial on the annotate() method
# https://cyber-fibre-739.notion.site/Leveraging-Django-Annotations-in-Django-REST-Framework-f4ecb3c5c139424f8531f602142d5b63?pvs=4