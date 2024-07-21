def category_icon_upload_path(instance, filename):
    """
    Determines the upload path for category icons.

    This function is used in the `upload_to` option of a `FileField` in Django.
    When a file is uploaded to the `icon` field of a `Category` instance, Django
    calls this function to determine where to store the file.

    Args:
        instance (Category): The instance of the `Category` model that the file is being uploaded to.
        filename (str): The original name of the file that was uploaded.

    Returns:
        str: The upload path for the file. This is a string that specifies where Django will store the file.

    Example:
        Assuming the category's ID is 1 and the uploaded file is named `my_file.png`, this function
        will return the string "category/1/category_icon/my_file.png". Django will then store the file
        at that location.
    """
    # The f-string `f"category/{instance.id}/category_icon/{filename}"` constructs the upload path.
    # The `{instance.id}` part is replaced with the ID of the category, and the `{filename}` part
    # is replaced with the original name of the file. The resulting string is a path like
    # "category/1/category_icon/my_file.png".
    return f"category/{instance.id}/category_icon/{filename}"

def server_icon_upload_path(instance, filename):
    """
    Determines the upload path for channel icons.

    Args:
        instance (Channel): The instance of the `Channel` model that the file is being uploaded to.
        filename (str): The original name of the file that was uploaded.

    Returns:
        str: The upload path for the file.
    """
    return f"server/{instance.id}/server_icons/{filename}"


def server_banner_img_upload_path(instance, filename):
    """
    Determines the upload path for channel banners.

    Args:
        instance (Channel): The instance of the `Channel` model that the file is being uploaded to.
        filename (str): The original name of the file that was uploaded.

    Returns:
        str: The upload path for the file.
    """
    return f"server/{instance.id}/server_banners/{filename}"
