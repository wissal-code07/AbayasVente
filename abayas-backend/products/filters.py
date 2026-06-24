import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category  = django_filters.CharFilter(field_name='category__slug')
    color     = django_filters.CharFilter(field_name='colors__name', lookup_expr='iexact')
    size      = django_filters.CharFilter(field_name='sizes__name',  lookup_expr='iexact')
    badge     = django_filters.CharFilter(field_name='badge', lookup_expr='exact')

    class Meta:
        model  = Product
        fields = ['category', 'color', 'size', 'badge', 'min_price', 'max_price']
