from rest_framework import generics, filters, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Color, Size
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    CategorySerializer, ColorSerializer, SizeSerializer
)
from .filters import ProductFilter


class ProductListView(generics.ListAPIView):
    """
    Liste tous les produits actifs.
    Filtres : category, badge, colors, sizes, min_price, max_price
    Recherche : name, description
    Tri : price, created_at, name
    """
    serializer_class   = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class    = ProductFilter
    search_fields      = ['name', 'description', 'category__name']
    ordering_fields    = ['price', 'created_at', 'name']
    ordering           = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'colors', 'sizes')


class ProductDetailView(generics.RetrieveAPIView):
    """Détail d'un produit par son slug"""
    serializer_class   = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'colors', 'sizes')


class SimilarProductsView(generics.ListAPIView):
    """Produits similaires (même catégorie)"""
    serializer_class   = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class   = None  # Pas de pagination pour les similaires

    def get_queryset(self):
        slug = self.kwargs['slug']
        try:
            product = Product.objects.get(slug=slug, is_active=True)
            return Product.objects.filter(
                category=product.category,
                is_active=True
            ).exclude(slug=slug).select_related('category').prefetch_related('images', 'colors', 'sizes')[:4]
        except Product.DoesNotExist:
            return Product.objects.none()


class CategoryListView(generics.ListAPIView):
    """Liste toutes les catégories"""
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class   = None


class ColorListView(generics.ListAPIView):
    """Liste toutes les couleurs disponibles"""
    queryset           = Color.objects.all()
    serializer_class   = ColorSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class   = None


class SizeListView(generics.ListAPIView):
    """Liste toutes les tailles disponibles"""
    queryset           = Size.objects.all().order_by('order')
    serializer_class   = SizeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class   = None
