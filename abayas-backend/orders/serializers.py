from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price',
                  'quantity', 'size', 'color', 'total_price']
        read_only_fields = ['id', 'product_name', 'product_price']


class OrderItemCreateSerializer(serializers.Serializer):
    """Utilisé pour créer les items lors de la création de commande"""
    product_id = serializers.IntegerField()
    quantity   = serializers.IntegerField(min_value=1)
    size       = serializers.CharField(max_length=10, required=False, allow_blank=True)
    color      = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_product_id(self, value):
        try:
            Product.objects.get(pk=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Produit non trouvé.")
        return value


class OrderCreateSerializer(serializers.Serializer):
    """Créer une nouvelle commande"""
    items            = OrderItemCreateSerializer(many=True)
    shipping_name    = serializers.CharField(max_length=200)
    shipping_address = serializers.CharField()
    shipping_city    = serializers.CharField(max_length=100)
    shipping_wilaya  = serializers.CharField(max_length=100)
    shipping_phone   = serializers.CharField(max_length=20)
    delivery_method  = serializers.ChoiceField(choices=['standard', 'express', 'relay'])
    payment_method   = serializers.ChoiceField(choices=['cod', 'card', 'virement'])
    notes            = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("La commande doit contenir au moins un article.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user       = self.context['request'].user

        # Calcul des prix
        delivery_prices = {'standard': 0, 'express': 600, 'relay': 300}
        delivery_price  = delivery_prices.get(validated_data['delivery_method'], 0)

        subtotal = 0
        for item_data in items_data:
            product   = Product.objects.get(pk=item_data['product_id'])
            subtotal += float(product.price) * item_data['quantity']

        total = subtotal + delivery_price

        # Créer la commande
        order = Order.objects.create(
            user           = user,
            delivery_price = delivery_price,
            subtotal       = subtotal,
            total          = total,
            **validated_data
        )

        # Créer les items
        for item_data in items_data:
            product = Product.objects.get(pk=item_data['product_id'])
            OrderItem.objects.create(
                order         = order,
                product       = product,
                product_name  = product.name,
                product_price = product.price,
                quantity      = item_data['quantity'],
                size          = item_data.get('size', ''),
                color         = item_data.get('color', ''),
            )
            # Décrémenter le stock
            product.stock = max(0, product.stock - item_data['quantity'])
            product.save()

        return order


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'order_number', 'status',
            'shipping_name', 'shipping_address', 'shipping_city',
            'shipping_wilaya', 'shipping_phone',
            'delivery_method', 'delivery_price', 'payment_method',
            'subtotal', 'total', 'notes', 'items',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']
