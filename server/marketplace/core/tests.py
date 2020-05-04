from django.test import TestCase, Client
from core.models import *
from core.views import *
from django.contrib.auth.models import User

client = Client()


class TestCredentials(TestCase):
    """
    check if you have the credential to pay

    """
    def test_check_user_credentials(self):
        user = User.objects.create_user('testuser1', password='userpassword')
        user.is_superuser = False
        user.is_staff = False
        user.save()
        a1 = Listing(seller_id=user,amount=3,price=33,name="tshirt",categories=['Others'],description="testing")
        a1.save()
        id = a1.listing_id
        response = client.post('/core/payment/',{'price':33,'items':[{'listing_id':id, 'amount': 3 }]})
        self.assertEqual(response.status_code,401)



class TestListing(TestCase):
    """
    check if listing is deleting correctly

    """
    def test_check_deleting_list(self):
        user = User.objects.create_user('testuser1', password='userpassword')
        user.is_superuser = False
        user.is_staff = False
        user.save()
        a1 = Listing(seller_id=user,amount=3,price=33,name="tshirt",categories=['Others'],description="testing")
        a1.save()
        listing_id = a1.listing_id
        seller_id = user.id
        response = client.get('/core/deletemylisting/',{'listing_id':listing_id,'seller_id:':seller_id})
        self.assertEqual(Listing.objects.all().count(),0)




class TestMyOrder(TestCase):
    """
    check if you can get all Ordering

    """

    def test_deleteMyOrder(self):
        user = User.objects.create_user('testuser1', password='userpassword')
        user.is_superuser = False
        user.is_staff = False
        user.save()
        a1 = Listing(seller_id=user,amount=3,price=33,name="tshirt",categories=['Others'],description="testing")
        a1.save()
        id = a1.listing_id
        a2 = Order(buyer=user,amount=3,listing_id=id)
        a2.save()
        orderid = a2.order_id
        userid= user.id
        response = client.get('/core/deletemyorders/',{'order_id':orderid, 'id':userid})

        self.assertEqual(Order.objects.all().count(),0)

