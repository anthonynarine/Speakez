from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Message, Conversation
from .serializers import MessageSerializer
from .schemas import list_message_docs

class MessageViewSet(viewsets.ViewSet):
    """
    A ViewSet for viewing and manipulating the Message instances.
    
    list:
    Retrieve a list of messages associated with a specific channel_id.
    """   
    @list_message_docs
    def list(self, request):
        """
        Fetches the list of messages for a provided channel_id.

        The channel_id is required as a query parameter. If the channel_id is not provided or if there's no conversation
        associated with the provided channel_id, appropriate error responses are returned.
        """
        # Fetch channel_id from query parameters.
        channel_id = request.query_params.get("channel_id")
        
        # Return an error response if channel_id is not provided.
        if not channel_id:
            return Response({"detail": "channel_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Try fetching the conversation for the provided channel_id.
        try:
            conversation = Conversation.objects.get(channel_id=channel_id)
        except Conversation.DoesNotExist:
            return Response([], status=status.HTTP_404_NOT_FOUND)  # Changed to 404 to indicate not found
        
        # Fetch all messages associated with the fetched conversation.
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        
        # Return the serialized list of messages.
        return Response(serializer.data, status=status.HTTP_200_OK)  # Explicitly set 200 OK status
