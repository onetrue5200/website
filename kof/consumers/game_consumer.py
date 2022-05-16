from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        # find a proper room
        self.room_name = None
        i = 0
        while True:
            i += 1
            name = f"room-{i}"
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break
        print(f"connect to {self.room_name}")
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)

        # if the room has player, we should inform the client
        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({
                'event': 'create_player',
                'uuid': player['uuid'],
                'order': 0,
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        players = cache.get(self.room_name)
        players.append({
            'uuid': data['uuid'],
        })
        cache.set(self.room_name, players, 3600)
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_create_player',
                'event': 'create_player',
                'uuid': data['uuid'],
                'order': 1,
            }
        )

    async def group_create_player(self, data):
        await self.send(text_data=json.dumps(data))

    async def location(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_location',
                'event': 'location',
                'uuid': data['uuid'],
                'x': data['x'],
                'y': data['y'],
                'status': data['status'],
            }
        )

    async def group_location(self, data):
        await self.send(text_data=json.dumps(data))

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if event == 'create_player':
            await self.create_player(data)
        elif event == 'location':
            await self.location(data)
