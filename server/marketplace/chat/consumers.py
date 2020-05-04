from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
import json
import os
from django.contrib.auth.models import User

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"


class ChatConsumer(AsyncWebsocketConsumer):
    async def init_chat(self, data):
        username = data['username']
        user, created = User.objects.get_or_create(username=username)
        content = {
            'command': 'init_chat'
        }
        if not user:
            content['error'] = 'Unable to get or create User with username : ' + username
        content['success'] = 'Chatting success with username : ' + username
        await self.send(text_data=json.dumps(content))

    async def fetch_messages(self, data):
        seller_id = data['chatroom']
        messages = Message.objects.order_by('-created_at').all().filter(chatroom=seller_id)[:50]
        messages_list = []
        for message in messages:
            messages_list.append({
                'id': str(message.id),
                'author': message.author.username,
                'chatroom': message.chatroom,
                'content': message.content,
                'created_at': str(message.created_at)
            })
        print('*' * 50)
        content = {
            'command': 'messages',
            'messages': messages_list
        }
        print(content)
        await self.send(text_data=json.dumps(content))

    async def new_message(self, data):
        author, text, chatroom = data['from'], data['text'], data['chatroom']
        print(author, text)
        author_user, created = User.objects.get_or_create(username=author)
        print('Creation of a new author : ', author_user, created)
        message = Message.objects.create(author=author_user, content=text, chatroom=chatroom)
        content = {
            'command': 'new_message',
            'message': {
                'id': str(message.id),
                'author': message.author.username,
                'chatroom': message.chatroom,
                'content': message.content,
                'created_at': str(message.created_at)
            }
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': content
            }
        )

    commands = {
        'init_chat': init_chat,
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    async def connect(self):
        self.room_name = 'room'
        self.room_group_name = 'chat_' + self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive message from WebSocket
        print("text_data: " + text_data)
        json_data = json.loads(text_data)
        await self.commands[json_data['command']](self, json_data)

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        print(message)
        await self.send(text_data=json.dumps(message))
