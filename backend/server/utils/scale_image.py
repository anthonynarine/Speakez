import logging
from PIL import Image, ImageOps, ImageSequence
import os
from django.conf import settings

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

# Suppress PIL debug logs
pil_logger = logging.getLogger('PIL')
pil_logger.setLevel(logging.WARNING)

def scale_down_image(image_path, max_size=(400, 400)):
    """
    Scales down an image to a maximum size while maintaining aspect ratio.

    This function opens an image from a given path and scales it down such that its largest dimension
    is no greater than provided in the max_size tuple. If the image is already smaller than max_size,
    then the image will not be resized. The scaled-down image is saved back to the same path, replacing
    the original image.

    If the image_path is None or not a valid path to an image file, the function will immediately return
    and no action will be performed.

    Args:
        image_path (str): The file path to the image to be scaled down.
        max_size (tuple): A tuple containing two integers, the maximum width and height for the scaled-down image.

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
        with Image.open(image_path) as img:
            if img.format == 'GIF':
                frames = []
                for frame in ImageSequence.Iterator(img):
                    frame = frame.convert('RGBA')
                    frame.thumbnail(max_size, Image.LANCZOS)
                    background = Image.new('RGBA', max_size, (255, 255, 255, 0))
                    offset = ((max_size[0] - frame.width) // 2, (max_size[1] - frame.height) // 2)
                    background.paste(frame, offset)
                    frames.append(background)
                frames[0].save(image_path, save_all=True, append_images=frames[1:], loop=0, duration=img.info.get('duration', 100))
                logger.info(f"Scaled GIF and saved at {image_path}")
            else:
                original_size = img.size
                logger.debug(f"Original image size: {original_size}")
                
                img.thumbnail(max_size, Image.LANCZOS)
                new_size = img.size
                logger.debug(f"Resized image size: {new_size}")

                background = Image.new('RGB', max_size, (255, 255, 255))
                offset = ((max_size[0] - new_size[0]) // 2, (max_size[1] - new_size[1]) // 2)
                background.paste(img, offset)
                background.save(image_path)
                logger.info(f"Scaled image from {original_size} to {new_size} and saved at {image_path}")

    except Exception as e:
        logger.error(f"Error scaling image at {image_path}: {e}", exc_info=True)
