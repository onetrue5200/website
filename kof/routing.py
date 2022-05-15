from django.urls import path
from kof.consumers.game_consumer import GameConsumer

websocket_urlpatterns = [
    path("kof/wss/game/", GameConsumer.as_asgi()),
]
