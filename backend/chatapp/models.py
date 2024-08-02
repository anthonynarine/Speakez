from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Conversation(models.Model):
    """
    A chat channel between users.
    
    Attributes:
        channel_id (str): Distinct identifier for each conversation.
        created_at (datetime): Date and time marking the start of the conversation.
    """

    channel_id = models.CharField(
        max_length=255,
        verbose_name="Channel ID",
        help_text="Distinct identifier for each conversation."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time marking the start of the conversation."
    )

    def __str__(self):
        return f"Conversation {self.channel_id}"


class Message(models.Model):
    """
    An individual message within a Conversation.
    
    Attributes:
        conversation (Conversation): The chat channel this message belongs to.
        sender (User): The user responsible for this message.
        content (str): The actual text of the message.
        timestamp (datetime): Date and time marking when the message was dispatched.
    """

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
        verbose_name="Conversation",
        help_text="The chat channel this message belongs to."
    )
    sender = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name="Sender",
        help_text="The user responsible for this message."
    )
    content = models.TextField(
        verbose_name="Content",
        help_text="The actual text of the message."
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Timestamp",
        help_text="Date and time marking when the message was dispatched."
    )

    def __str__(self):
        return f"Message from {self.sender} in conversation {self.conversation.channel_id} at {self.timestamp}"