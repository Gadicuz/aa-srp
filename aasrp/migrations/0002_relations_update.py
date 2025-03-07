# Generated by Django 3.1.5 on 2021-01-04 21:23

# Django
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

# AA SRP
import aasrp.models


class Migration(migrations.Migration):

    dependencies = [
        ("eveonline", "0012_index_additions"),
        ("eveuniverse", "0004_effect_longer_name"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("aasrp", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="aasrprequest",
            name="ship",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="eveuniverse.evetype",
            ),
        ),
        migrations.AlterField(
            model_name="aasrplink",
            name="creator",
            field=models.ForeignKey(
                blank=True,
                default=None,
                help_text="Who created the SRP link?",
                null=True,
                on_delete=models.SET(aasrp.models.get_sentinel_user),
                related_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="aasrplink",
            name="fleet_commander",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="eveonline.evecharacter",
            ),
        ),
        migrations.AlterField(
            model_name="aasrprequest",
            name="creator",
            field=models.ForeignKey(
                blank=True,
                default=None,
                help_text="Who created the SRP link?",
                null=True,
                on_delete=models.SET(aasrp.models.get_sentinel_user),
                related_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="aasrprequestcomment",
            name="creator",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=models.SET(aasrp.models.get_sentinel_user),
                related_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="aasrprequestcomment",
            name="srp_request",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="+",
                to="aasrp.aasrprequest",
            ),
        ),
    ]
