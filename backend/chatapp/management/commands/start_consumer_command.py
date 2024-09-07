from django.core.management.base import BaseCommand
from backend.account.rabbitmq_consumer import start_consumer

# TODO lEARN HOW TO RECONFIGURE IN PRODUCTION TO AN INDEPENDENT DYNO ON HEROKU

class Command(BaseCommand):
    help = 'Start the RabbitMQ consumer'

    def handle(self, *args, **kwargs):
        start_consumer()  # Call the function to start the consumer


# to run - python manage.py start_consumer_command
