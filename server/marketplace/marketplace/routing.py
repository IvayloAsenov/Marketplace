from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from chat import consumers


websocket_urlpatterns = [
    re_path(r'ws/chat$', consumers.ChatConsumer),
]

application = ProtocolTypeRouter({
    # http is channels.http.AsgiHandler by default
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
