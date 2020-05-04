from django.urls import path,include

from .views import *

urlpatterns = [
    path('current_user/', current_user),
    path('all_users/', all_users),
    path('users/', UserList.as_view()),
    path('listings/', ListingView.as_view()),
    path('payment/', PaymentView.as_view()),
    path('orders/', OrderView.as_view()),
    path('updatemylistings/', UpdateMyListings.as_view()),
    path('getmylisting/', getMyListings),
    path('deletemylisting/', deleteMyListings),
    path('deletemyorders/', deleteMyOrders),
]

