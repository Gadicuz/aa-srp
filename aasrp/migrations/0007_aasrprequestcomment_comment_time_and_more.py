# Generated by Django 4.0.7 on 2022-08-04 18:06

# Django
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("aasrp", "0006_related_names"),
    ]

    operations = [
        migrations.AddField(
            model_name="aasrprequestcomment",
            name="comment_time",
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name="aasrprequestcomment",
            name="comment_type",
            field=models.CharField(
                choices=[
                    ("Comment", "Comment"),
                    ("Request Added", "SRP Request Added"),
                    ("Request Information", "Additional Information"),
                    ("Reject Reason", "Reject Reason"),
                    ("Status Changed", "Status Changed"),
                    ("Reviser Comment", "Reviser Comment"),
                ],
                default="Comment",
                max_length=19,
            ),
        ),
    ]
