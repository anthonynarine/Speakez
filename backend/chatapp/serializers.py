from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()

    class Meta:
        model = Message  # The model that this serializer is based on
        fields = ('sender', 'content', 'timestamp', 'id',)  # Fields to be serialized and deserialized
        
    def get_sender(self, obj):
        # Return the sender's first name instead of the string representation
        return obj.sender.first_name
