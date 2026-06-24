from django.urls import path
from .views import (
    ProductListView, ProductDetailView, SimilarProductsView,
    CategoryListView, ColorListView, SizeListView
)

urlpatterns = [
    path('',                              ProductListView.as_view(),     name='product_list'),
    path('<slug:slug>/',                  ProductDetailView.as_view(),   name='product_detail'),
    path('<slug:slug>/similar/',          SimilarProductsView.as_view(), name='product_similar'),
    path('categories/list/',             CategoryListView.as_view(),    name='category_list'),
    path('colors/list/',                 ColorListView.as_view(),       name='color_list'),
    path('sizes/list/',                  SizeListView.as_view(),        name='size_list'),
]
