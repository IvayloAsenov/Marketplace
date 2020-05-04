from django.contrib import admin

from .models import Listing
from .models import Order


class ListingAdmin(admin.ModelAdmin):
    list_display = ('seller_id', 'amount', 'price', 'photo', 'name', 'categories', 'description', 'listed_on', )


class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'listing', 'buyer', 'date')


admin.site.register(Listing, ListingAdmin)
admin.site.register(Order, OrderAdmin)
