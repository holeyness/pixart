from django.db import models


class Pixel(models.Model):
    x_coord = models.IntegerField()
    y_coord = models.IntegerField()
    hex = models.TextField()
