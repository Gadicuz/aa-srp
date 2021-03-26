# Generated by Django 3.1.7 on 2021-03-13 23:36

from django.conf import settings
from django.db import migrations, models

import aasrp.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("aasrp", "0003_aasrprequest_reject_info"),
    ]

    operations = [
        migrations.CreateModel(
            name="AaSrpUserSettings",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("disable_notifications", models.BooleanField(default=False)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=models.SET(aasrp.models.get_sentinel_user),
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "User Settings",
                "verbose_name_plural": "User Settings",
                "default_permissions": (),
            },
        ),
    ]
