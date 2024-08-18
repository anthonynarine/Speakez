from django.core.management.base import BaseCommand
from account.consumer import start_consumer

class Command(BaseCommand):
    help = 'Start the RabbitMQ consumer'

    def handle(self, *args, **kwargs):
        start_consumer()  # Call the function to start the consumer


# to run - python manage.py start_consumer_command
