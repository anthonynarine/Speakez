from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync


class ChatAppConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
       self.room_name = "testserver"
       
    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )
        
    def recei.