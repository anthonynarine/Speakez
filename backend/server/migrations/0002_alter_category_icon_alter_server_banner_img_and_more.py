# Generated by Django 5.0.6 on 2024-07-29 23:04

import server.utils.image_path
import server.validators.image_validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("server", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="category",
            name="icon",
            field=models.FileField(
                blank=True,
                default=server.utils.image_path.default_category_icon,
                null=True,
                upload_to=server.utils.image_path.category_icon_upload_path,
                validators=[
                    server.validators.image_validators.validate_icon_image_size,
                    server.validators.image_validators.validate_image_file_extension,
                ],
            ),
        ),
        migrations.AlterField(
            model_name="server",
            name="banner_img",
            field=models.ImageField(
                blank=True,
                default=server.utils.image_path.default_server_banner_img_path,
                null=True,
                upload_to=server.utils.image_path.server_banner_img_upload_path,
                validators=[
                    server.validators.image_validators.validate_image_file_extension
                ],
            ),
        ),
        migrations.AlterField(
            model_name="server",
            name="icon",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to=server.utils.image_path.server_icon_upload_path,
                validators=[
                    server.validators.image_validators.validate_image_file_extension
                ],
            ),
        ),
    ]
