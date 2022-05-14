import imp
from django.shortcuts import render


def index(request):
    return render(request, 'campus/index.html')
