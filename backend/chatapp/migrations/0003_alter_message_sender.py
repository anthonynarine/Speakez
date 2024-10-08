# Generated by Django 5.0.6 on 2024-08-22 00:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0002_userprofile"),
        ("chatapp", "0002_alter_conversation_channel_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="sender",
            field=models.ForeignKey(
                help_text="The user responsible for this message.",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="account.userprofile",
                verbose_name="Sender",
            ),
        ),
    ]
