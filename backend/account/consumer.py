# account/consumer/rabbitmq_consumer.py
import pika
import json
from decouple import config
from django.auth.models import user
