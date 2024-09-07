import logging
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Conversation, Message
from django.contrib.auth.models import AnonymousUser


# Create a logger instance
logger = logging.getLogger(__name__)

class ChatAppConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user_profile = None
        self.room_name = None

    def connect(self):
        # Get the authenticated user from the scope, which is set by the JWTWebsocketAuthMiddleware
        self.user_profile = self.scope.get("user")
        
        if self.user_profile is None or isinstance(self.user_profile, AnonymousUser):
            # Log connection rejection due to unauthenticated user
            logger.warning("WebSocket connection rejected: Unauthenticated user")
            self.close(code=4001)
            return
        
        # Log successful connection
        logger.info(f"WebSocket connection accepted for user: {self.user_profile.email}")
        self.accept()

        # Extract channel_id from the URL route parameters
        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]
        
        # Create a unique group name for the conversation
        self.room_name = f"conversation_{self.channel_id}"
        
        # Log joining the conversation group
        logger.info(f"User {self.user_profile.email} joining conversation: {self.room_name}")
        
        # Add the channel to the group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

    def receive_json(self, content, **kwargs):
        message = content.get("message")
        
        if message:
            sender = self.user_profile # use the authenticated user profile
            
            # Ensure the conversation exists, create if it doesn't
            conversation = Conversation.objects.get_or_create(channel_id=self.channel_id)[0]
            
            # Create a new message in the conversation
            new_message = Message.objects.create(
                conversation=conversation,
                sender=sender,
                content=message
            )
            
            
            # Log the received message
            logger.info(f"Message received from {sender.email} in conversation {self.room_name}: {message}")
            
            # Broadcast the message to the group
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "chat_message",
                    "message": {
                        "id": new_message.id,
                        "sender": new_message.sender.first_name,
                        "content": new_message.content,
                        "timestamp": new_message.timestamp.isoformat(),
                    },
                }
            )
        else:
            # Log the case where no message was provided
            logger.warning(f"Empty message received in conversation {self.room_name}")

    def chat_message(self, event):
        message = event.get("message")
        if message:
            # Log the outgoing message
            logger.info(f"Sending message to clients in conversation {self.room_name}: {message['content']}")
            self.send_json(message)

    def disconnect(self, code):
        if self.user_profile:
            logger.info(f"User {self.user_profile.email} disconnected from conversation {self.room_name} with code {code}")
        else:
            logger.info(f"Anonymous user disconnected from conversation {self.room_name} with code {code}")
        
        
        # Leave the conversation group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
