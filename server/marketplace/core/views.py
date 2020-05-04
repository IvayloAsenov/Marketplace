from django.contrib.auth.models import User
from django.http import JsonResponse,HttpResponse,HttpResponseBadRequest
from django.conf import settings
from rest_framework import permissions, status
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
import json
import stripe
from .models import *
from .serializers import UserSerializer, UserSerializerWithToken, ListingSerializer, OrderSerializer

class OrderView(APIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def get(self, request, *args, **kwargs):                                            #use order_id as key, as listing id may be the same (more products)
        queryset = Order.objects.filter(buyer=request.GET.get('id')).values('order_id','listing__listing_id', 'listing__name', 'listing__price', 'listing__photo','listing__description','amount')
        # serializer = OrderSerializer(queryset, many=True)
        return JsonResponse({'results': list(queryset)})

    def post(self, request, *args, **kwargs):
        order_serializer = OrderSerializer(data=request.data)
        if order_serializer.is_valid():
            order_serializer.save()
            return Response(order_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentView(APIView):
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body.decode('utf-8'))
        price = int(round(float((body.get("price")))))*100
        print(price)
        items = body.get('items')

        #update listing
        for e in items:
            listing_id = e['listing_id']
            amount = e['amount']
            listing = Listing.objects.filter(listing_id=listing_id)
            if((listing.count()==0) or (listing[0].amount<1)):
                return HttpResponseBadRequest('<h1>Bad Request (400)</h1>', content_type='text/html')
            # new_amount = listing[0].amount - amount  #amount issue, returning stock instead of real choices
            new_amount=listing[0].amount-1
            listing.update(amount=new_amount)

        stripe.api_key = settings.STRIPE_SECRET_KEY
        intent = stripe.PaymentIntent.create(
            amount=price,
            currency="cad"
        )
        res = {
            'publishableKey': settings.STRIPE_PUBLISHABLE_KEY,
            'clientSecret': intent.client_secret
        }

        return JsonResponse(res)


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
def all_users(request):
    users = User.objects.all()
    return Response(
        users.values_list('username', flat=True)
    )


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """    

    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        queryset = User.objects.get(id=request.GET.get('id'))
        serializer = UserSerializer(queryset, many=False)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListingView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        queryset = Listing.objects.all()
        serializer = ListingSerializer(queryset, many=True)
        print(serializer)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        listings_serializer = ListingSerializer(data=request.data)
        if listings_serializer.is_valid():
            listings_serializer.save()
            return Response(listings_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(listings_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateMyListings(APIView):
    '''
    method for updating listing in profile page

    '''

    def post(self, request, *args, **kwargs):
        listing_id = request.data['listing_id']

        filtered_item = Listing.objects.filter(listing_id=listing_id)
        filtered_item.update(amount=request.data['amount'], price=request.data['price'], name=request.data['name'], categories=request.data['categories'], description=request.data['description'])
        # save inmemeoryobject into imagefield.
        image = request.data['photo']
        filtered_item[0].photo.save(image.name, image)

        #filter to refresh page.
        queryset = Listing.objects.filter(seller_id_id=request.data['seller_id']).values()
        return JsonResponse({'results': list(queryset)})

    def get(self, request, *args, **kwargs):
        queryset = Listing.objects.all()
        serializer = ListingSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

'''
method for displaying listing/ delete listing in profile page
'''

def getMyListings(request):
    queryset = Listing.objects.filter(seller_id_id=request.GET.get('seller_id')).values()
    return JsonResponse({'results': list(queryset)})

def deleteMyListings(request):
    Listing.objects.filter(listing_id=request.GET.get('listing_id')).delete()
    #return new listings after delete
    queryset = Listing.objects.filter(seller_id_id=request.GET.get('seller_id')).values()
    return JsonResponse({'results': list(queryset)})

def deleteMyOrders(request):
    try:
        Order.objects.filter(order_id=request.GET.get('order_id')).delete()
        queryset = Order.objects.filter(buyer=request.GET.get('id')).values('order_id','listing__listing_id', 'listing__name', 'listing__price', 'listing__photo','amount')
        return JsonResponse({'results': list(queryset)})
    except:
        return HttpResponseBadRequest('<h1>Bad Request (400)</h1>', content_type='text/html')