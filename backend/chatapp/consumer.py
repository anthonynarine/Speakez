from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync

class ChatAppConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = "testserver"

    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)

    def receive_json(self, content, **kwargs):
        # Ensure the message content is processed correctly
        message = content.get('message')
        if message:
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {"type": "chat.message", "message": message},
            )

    def chat_message(self, event):
        # Ensure the outgoing message is structured correctly
        message = event.get('message')
        if message:
            self.send_json({
                'message': message
            })

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
