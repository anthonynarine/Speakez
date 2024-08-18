import pika
import json
import logging
from decouple import config
import time
from .models import UserProfile

# Initialize the logger
logger = logging.getLogger(__name__)

# Reduce Pika's log level to WARNING to avoid overwhelming logs
pika_logger = logging.getLogger('pika')
pika_logger.setLevel(logging.WARNING)  # Use WARNING to suppress DEBUG logs, or INFO for minimal output


def create_chat_profile(user_data):
    """
    Create a user profile in the chat app's database.

    Args:
        user_data (dict): A dictionary containing user information 
                        with keys 'email', 'first_name', and 'last_name'.

    Logs:
        Information when a user profile is successfully created.
        Errors if the profile creation fails.
    """
    try:
        # Attempt to create a new user profile using the provided data
        UserProfile.objects.create(
            email=user_data["email"], 
            first_name=user_data["first_name"],
            last_name=user_data["last_name"]
        )
        # Log success message indicating the user profile was created
        logger.info(f"User profile created for {user_data['email']}")
    except Exception as e:
        # Log error message if profile creation fails, capturing the exception
        logger.error(f"Failed to create user profile: {e}")


def callback(channel, method, properties, body):
    """
    Callback function to process messages from the RabbitMQ queue.

    Args:
        channel: The channel object from RabbitMQ for message communication.
        method: Delivery method containing metadata such as exchange and routing key.
        properties: Message properties (e.g., headers, content type).
        body (bytes): The message body containing user data as JSON.

    Process:
        - Deserialize the message body from JSON to a Python dictionary.
        - Call `create_chat_profile` to store the user data in the database.
        - Acknowledge the message if processing is successful.
        - Reject and requeue the message if processing fails.
        - Retry limit of 5 attempts with exponential backoff to prevent infinite retries. 
    Logs:
        Errors if the message processing or user profile creation fails.
    """
    max_retries = 5  # Maximum number of retries allowed
    base_backoff = 2  # Base backoff time in seconds
    
    try:
        # Deserialize the message body from JSON to a dictionary
        user_data = json.loads(body)
        
        # Check the retry count in the message properties (default to 0 if not present)
        retry_count = int(properties.headers.get("retry_count", 0)) if properties.headers else 0
        
        # Create the chat profile using the deserialized user data
        create_chat_profile(user_data)
        
        # Acknowledge successful message processing to RabbitMQ
        channel.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        # Check if retry count has reached the max allowed retries
        if retry_count >= max_retries:
            # Log and move the message to the dead-letter queue (DLQ)
            logger.error(f"Message failed after {retry_count} retries. Moving to DLQ: {e}")
            channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        else:
            # Increment the retry count and apply exponential backoff
            headers = properties.headers or {}
            headers["retry_count"] = retry_count + 1
            
            backoff_time = base_backoff ** retry_count  # Exponential backoff
            logger.error(f"Retrying message in {backoff_time} seconds, attempt {retry_count + 1}: {e}")
            
            # Delay the retry by the calculated backoff time
            time.sleep(backoff_time)
            
            # Create new properties with the updated headers
            new_properties = pika.BasicProperties(headers=headers)
            
            # Requeue the message for another attempt with updated headers
            channel.basic_publish(
                exchange='',
                routing_key=method.routing_key,
                body=body,
                properties=new_properties
            )


def start_consumer():
    """
    Start the RabbitMQ consumer to listen for messages on the 'user_registration_queue'.
    
    Process:
        - Establish a connection to RabbitMQ using credentials from environment variables.
        - Declare the dead-letter exchange for handling failed messages.
        - Declare a retry queue with TTL for automatic message reprocessing.
        - Bind the retry queue to the dead-letter exchange.
        - Declare the main queue ('user_registration_queue') with dead-letter settings.
        - Begin consuming messages from the main queue using the `callback` function.

    Logs:
        Information when the consumer starts successfully.
        Errors if the connection or channel setup fails.
    """
    try:
        # Establish a connection to RabbitMQ using the CloudAMQP URL from environment variables
        connection = pika.BlockingConnection(pika.URLParameters(config("CLOUDAMQP_URL")))
        channel = connection.channel()
        
        # Declare the fanout exchange "user_events"
        channel.exchange_declare(exchange="user_events", exchange_type="fanout")
        
        # Delcare the main queue ("user_registration_queue") and ensure it's durable
        channel.queue_declare(queue="user_registration_queue", durable=True)
        
        # Bind the main queue to the fanout exchange to receive all the boradcasted messages
        channel.queue_bind(exchange="user_events", queue="user_registration_queue")
        
        # Declare the dead-letter exchange to handle messages that fail to process
        channel.exchange_declare(exchange="dead_letter_exchange", exchange_type="direct")
        
        # Declare the retry queue with a TTL of 60 seconds to allow message reprocessing
        channel.queue_declare(queue="retry_queue", arguments={
            'x-message-ttl': 60000,  # Time to live for messages (60 seconds)
            'x-dead-letter-exchange': '',  # Use the default exchange for rerouting
            'x-dead-letter-routing-key': 'user_registration_queue'  # Requeue messages to the original queue
        })
        
        # Bind the retry queue to the dead-letter exchange for message routing
        channel.queue_bind(queue="retry_queue", exchange="dead_letter_exchange")
        
        # Declare the actual DLQ where messages that exhaust retries will be routed
        channel.queue_declare(queue="dead_letter_queue", durable=True)
        channel.queue_bind(queue="dead_letter_queue", exchange="dead_letter_exchange")
        
        # Start consuming messages from the main queue using the `callback` function
        channel.basic_consume(queue="user_registration_queue", on_message_callback=callback)
        
        logger.info("Consumer started, waiting for messages.")
        
        # Start the blocking loop to continuously consume and process messages
        channel.start_consuming()
    except Exception as e:
        # Log error if the consumer fails to start or encounters an issue
        logger.error(f"Failed to start consumer: {e}")
