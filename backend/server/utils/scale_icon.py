import logging
from PIL import Image, ImageOps, ImageSequence
import os
from django.conf import settings

from backend.server.utils import image_path

# Logging config
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

# Suppress PIL debug logs
pil_logger = logging.getLogger("PIL")
pil_logger.setLevel(logging.WARNING)

def scale_down_icon(image_path, max_size=(70, 70)):
    """
    Scales down an image to a maximum size while maintaining aspect ratio.

    This function opens an image from a given path and scales it down such that its largest dimension
    is no greater than provided in the max_size tuple. If the image is already smaller than max_size,
    then the image will not be resized. The scaled-down image is saved back to the same path, replacing 
    the original image.

    The image path should follow the format:
    "media/server/{instance.id}/server_icons/{filename}"

    If the image_path is None or not a valid path to an image file, the function will immediately return 
    and no action will be performed. 

    Args:
        image_path (str): The file path to the image to be scaled down. 
        max_size (tuple): A tuple containing two integers, the max width & height for the scaled down image.

    Returns:
        None
    """
    
    # Log the received image path
    logger.debug(f"Received image path: {image_path}")
    
    # Check if the image path is None or does not exist
    if image_path is None:
        logger.warning("Image path is None")
        return
    
    if not os.path.isabs(image_path):
        # Assuming the image_path is relative to the media root
        image_path = os.path.join(settings.MEDIA_ROOT, image_path)
        logger.debug(f"Converted to absolute image path: {image_path}")
        
    if not os.path.isfile(image_path):
        logger.warning(f"Image path is not a valid file: {image_path}")
        return
    
    try:
        # Open the image file
        with Image.open(image_path) as icon_img:
            original_size = icon_img.size
            logger.debug(f"Original image size: {original_size}")
            
            # Resize the image while maintaining aspect ratio
            icon_img.thumbnail(max_size, Image.LANCZOS)
            new_size = icon_img.size
            logger.debug(f"Resized image size: {new_size}")
            
            # Create a new blank image with the desired size
            background = Image.new("RGBA", max_size, (255, 255, 255, 0))
            # Calculate the position to paste the resized image onto the blank image
            offset = ((max_size[0] - new_size[0]) // 2, (max_size[1] - new_size[1]) // 2)
            background.paste(icon_img, offset)
            # Save the new image back to the same path
            background.save(image_path)
        logger.info(f"Scaled image from {original_size} to {new_size} and saved at {image_path}")
    
    except Exception as e:
        logger.error(f"Error scaling image at {image_path}: {e}", exc_info=True)
