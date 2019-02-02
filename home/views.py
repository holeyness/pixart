from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import render

from home.models import Pixel


def home(request):
    return render(request, 'home.html')


def pixel(request):
    if request.method == 'GET':
        # Return JSON list of x,y,hex
        pixels = Pixel.objects.all()
        return JsonResponse({
            'pixels': [{
                'x': p.x_coord,
                'y': p.y_coord,
                'hex': p.hex
            } for p in pixels]
        })
    elif request.method == 'POST':
        # Get x, y, hex from POST and save
        x_coord = int(request.POST.get('x'))
        y_coord = int(request.POST.get('y'))
        hex = request.POST.get('hex')

        if len(hex) != 6:
            return HttpResponseBadRequest('Invalid hex length')

        try:
            Pixel.objects.get(x_coord=x_coord, y_coord=y_coord)
            return HttpResponseBadRequest('That pixel has already been filled')
        except Pixel.DoesNotExist:
            Pixel.objects.create(x_coord=x_coord, y_coord=y_coord, hex=hex)
            return JsonResponse({
                'x': x_coord,
                'y': y_coord,
                'hex': hex
            })
