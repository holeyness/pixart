import json

from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import render

from home.models import Pixel


CANVAS_DEFAULT_WIDTH = 250
CANVAS_DEFAULT_HEIGHT = 250


def home(request):
    return render(request, 'home.html')


def pixel(request):
    if request.method == 'GET':
        # Return JSON list of x,y,hex
        pixels = Pixel.objects.all()
        return JsonResponse({
            'canvas': {
                'width': CANVAS_DEFAULT_WIDTH,
                'height': CANVAS_DEFAULT_HEIGHT
            },
            'pixels': [{
                'x': p.x_coord,
                'y': p.y_coord,
                'hex': p.hex
            } for p in pixels]
        })
    elif request.method == 'POST':
        # Get x, y, hex from POST and save
        x_coord = int(request.body.get('x'))
        y_coord = int(request.POST.get('y'))
        hex = request.POST.get('hex')

        if len(hex) != 6:
            return HttpResponseBadRequest(content=json.dumps({
                'error': 'Invalid hex length'
            }), content_type='application/json')

        bad_coord = False
        if x_coord < 0 or x_coord >= CANVAS_DEFAULT_WIDTH:
            bad_coord = True
        if y_coord < 0 or y_coord >= CANVAS_DEFAULT_HEIGHT:
            bad_coord = True

        if bad_coord:
            return HttpResponseBadRequest(content=json.dumps({
                'error': 'Invalid coordinates outside bounds'
            }), content_type='application/json')

        try:
            Pixel.objects.get(x_coord=x_coord, y_coord=y_coord)
            return HttpResponseBadRequest(content=json.dumps({
                'error': 'That pixel has already been filled'
            }), content_type='application/json')
        except Pixel.DoesNotExist:
            Pixel.objects.create(x_coord=x_coord, y_coord=y_coord, hex=hex)
            return JsonResponse({
                'x': x_coord,
                'y': y_coord,
                'hex': hex
            })
