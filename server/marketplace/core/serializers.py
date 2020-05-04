from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import Listing
from .models import Order


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ('listing_id', 'seller_id', 'amount', 'price', 'photo', 'name', 'categories', 'description', 'listed_on')

    def update(self, instance, validated_data):
        # instance.listing_id = validated_data.get('listing_id', instance.email)
        instance.seller_id = validated_data.get('seller_id', instance.seller_id)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.price = validated_data.get('price', instance.price)
        instance.photo = validated_data.get('photo', instance.photo)
        instance.categories = validated_data.get('categories', instance.categories)
        instance.description = validated_data.get('name', instance.description)
        # instance.listed_on = validated_data.get('name', instance.listed_on)
        instance.save()
        return instance


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('order_id', 'listing', 'buyer', 'date')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')


# Used whenever user signs up as we want to send the JWT token as well
class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    @staticmethod
    def get_token(obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password', 'id')

