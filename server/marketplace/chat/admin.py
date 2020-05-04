from django.contrib import admin

from .models import Message


class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'chatroom', 'content', 'created_at', )


admin.site.register(Message, MessageAdmin)

