import logging
from PIL import Image, ImageOps
import os

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

# Suppress PIL debug logs
pil_logger = logging.getLogger('PIL')
pil_logger.setLevel(logging.WARNING)

def resize_and_fit_image(image_path, target_size=(413, 531)):
    """
    Resizes and fits an image to the specified dimensions.

    This function opens an image from a given path, scales it down while maintaining aspect ratio,
    and then crops or pads it to fit the exact target dimensions. The processed image is saved back
    to the same path, replacing the original image.

    If the image_path is None or not a valid path to an image file, the function will immediately return
    and no action will be performed.

    Args:
        image_path (str): The file path to the image to be resized and fitted.
        target_size (tuple): A tuple containing two integers, the target width and height for the image.

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
        # Assuming that image_path is relative to the media root
        image_path = os.path.join(settings.MEDIA_ROOT, image_path)
        logger.debug(f"Converted to absolute image path: {image_path}")

    if not os.path.isfile(image_path):
        logger.warning(f"Image path is not a valid file: {image_path}")
        return

    try:
        # Open the image file at the provided path
        with Image.open(image_path) as img:
            original_size = img.size
            # Log the original size of the image
            logger.debug(f"Original image size: {original_size}")
            
            # Resize the image while maintaining its aspect ratio
            img.thumbnail(target_size)
            new_size = img.size
            logger.debug(f"Resized image size: {new_size}")

            # Create a new image with the target size and white background
            background = Image.new('RGB', target_size, (255, 255, 255))
            offset = ((target_size[0] - new_size[0]) // 2, (target_size[1] - new_size[1]) // 2)
            background.paste(img, offset)

            # Save the fitted image back to the original path, replacing the original image
            background.save(image_path)

        logger.info(f"Resized and fitted image to {target_size} and saved at {image_path}")

    except Exception as e:
        logger.error(f"Error resizing and fitting image at {image_path}: {e}", exc_info=True)
