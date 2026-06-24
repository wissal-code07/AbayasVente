from rest_framework import serializers
from .models import Product, Category, Color, Size, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Color
        fields = ['id', 'name', 'hex']


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Size
        fields = ['id', 'name']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer léger pour la liste des produits"""
    category         = CategorySerializer(read_only=True)
    colors           = ColorSerializer(many=True, read_only=True)
    sizes            = SizeSerializer(many=True, read_only=True)
    primary_image    = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'slug', 'category', 'price', 'old_price',
            'badge', 'colors', 'sizes', 'primary_image',
            'discount_percent', 'stock', 'is_active', 'created_at',
        ]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if image:
            request = self.context.get('request')
            return request.build_absolute_uri(image.image.url) if request else image.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer complet pour le détail d'un produit"""
    category         = CategorySerializer(read_only=True)
    colors           = ColorSerializer(many=True, read_only=True)
    sizes            = SizeSerializer(many=True, read_only=True)
    images           = ProductImageSerializer(many=True, read_only=True)
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'old_price', 'discount_percent',
            'badge', 'colors', 'sizes', 'images',
            'stock', 'is_active', 'created_at', 'updated_at',
        ]
