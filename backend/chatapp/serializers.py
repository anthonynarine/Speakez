from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    # StringRelatedField is used to represent the 'sender' field as a string
    # This is useful when the related object (in this case, the sender) has a meaningful __str__() method
    # in its model definition, which will be used to display a human-readable representation of the object.
    sender = serializers.StringRelatedField()

    class Meta:
        model = Message  # The model that this serializer is based on
        fields = ('sender', 'content', 'timestamp', 'id',)  # Fields to be serialized and deserialized
