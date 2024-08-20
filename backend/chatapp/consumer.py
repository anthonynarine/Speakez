from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Conversation, Message
from account.models import UserProfile


class ChatAppConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.upser_profile = None
        self.room_name = None

    def connect(self):
        self.accept()

        # Extract channel_id from the URL route parameters
        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]
        self.user = User.objects.get(id=1)  # For demonstration purposes; replace with actual user identification logic
        
        # Create a unique group name for the conversation
        self.room_name = f"conversation_{self.channel_id}"
        
        # Add the channel to the group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

    def receive_json(self, content, **kwargs):
        message = content["message"]
        sender = self.user
        
        # Ensure the conversation exists, create if it doesn't
        conversation = Conversation.objects.get_or_create(channel_id=self.channel_id)[0]
        
        # Create a new message in the conversation
        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message
        )
        
        # Broadcast the message to the group
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "chat_message",
                "message": {
                    "id": new_message.id,
                    "sender": new_message.sender.username,
                    "content": new_message.content,
                    "timestamp": new_message.timestamp.isoformat(),
                },
            }
        )

    def chat_message(self, event):
        message = event.get("message")
        if message:
            self.send_json(message)

    def disconnect(self, code):
        # Leave the conversation group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
