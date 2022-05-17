from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse


def index(request):
    return render(request, 'kof/index.html')


def getinfo(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': 'fail',
        })
    return JsonResponse({
        'result': 'success',
        'username': user.username,
    })


def logging_in(request):
    username = request.GET.get('username')
    password = request.GET.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse({
            'result': 'fail',
        })
    login(request, user)
    return JsonResponse({
        'result': 'success',
    })


def logging_out(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': 'success',
        })
    logout(request)
    return JsonResponse({
        'result': 'success',
    })


def register(request):
    username = request.GET.get('username').strip()
    password1 = request.GET.get('password1').strip()
    password2 = request.GET.get('password2').strip()
    if not username or not password1:
        return JsonResponse({
            'result': 'fail',
            'message': 'username or password is null',
        })
    if password1 != password2:
        return JsonResponse({
            'result': 'fail',
            'message': 'two passwords is not the same',
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': 'fail',
            'message': 'username is existed',
        })
    user = User(username=username)
    user.set_password(password1)
    user.save()
    login(request, user)
    return JsonResponse({
        'result': 'success',
    })
