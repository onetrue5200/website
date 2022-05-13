from curses.ascii import HT
from django.http import HttpResponse


def index(request):
    print("H")
    return HttpResponse("homepage")
