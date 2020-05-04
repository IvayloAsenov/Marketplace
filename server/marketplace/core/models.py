from django.contrib.auth.models import User
from django.db import models
from django_mysql.models import ListCharField
from django.core.files.storage import FileSystemStorage
from django.conf import settings


image_storage = FileSystemStorage(
    # Physical file location ROOT
    location=f'{settings.MEDIA_ROOT}/listing/',
    # Url for file
    base_url=f'{settings.MEDIA_URL}listing/',
)


def image_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/listing/images/<filename>
    return f'images/{filename}'


class Listing(models.Model):
    listing_id = models.AutoField(primary_key=True)
    seller_id = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    price = models.DecimalField(max_digits=9, decimal_places=2)
    photo = models.ImageField(upload_to=image_directory_path, storage=image_storage)
    name = models.CharField(max_length=100)
    categories = ListCharField(
        base_field=models.CharField(max_length=20),
        size=6,
        max_length=(6 * 21)  # 6 * 10 character nominals, plus commas
    )
    description = models.TextField()
    listed_on = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name


class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    amount = models.IntegerField(default=1)
