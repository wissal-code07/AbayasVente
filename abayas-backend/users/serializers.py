from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.db.models import Sum
from .models import User, Address
from products.models import Product, Category, Color, Size
from orders.models import Order, OrderItem


# ── Auth serializers ──

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email']      = user.email
        token['first_name'] = user.first_name
        token['last_name']  = user.last_name
        token['is_staff']   = user.is_staff
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['email', 'first_name', 'last_name', 'phone', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


# ── User serializers ──

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'phone']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mot de passe actuel incorrect.")
        return value


# ── Address serializers ──

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Address
        fields = ['id', 'label', 'first_name', 'last_name',
                  'address', 'city', 'wilaya', 'phone', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# ── Admin Product serializer ──

class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField(read_only=True)
    colors        = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    sizes         = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    colors_names  = serializers.SerializerMethodField(read_only=True)
    sizes_names   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'category_name',
            'price', 'old_price', 'stock', 'badge', 'is_active', 'created_at',
            'colors', 'sizes', 'colors_names', 'sizes_names'
        ]
        extra_kwargs = {'slug': {'required': False}}

    def get_category_name(self, obj):
        return obj.category.name if obj.category else ""

    def get_colors_names(self, obj):
        return [{'id': c.id, 'name': c.name, 'hex': c.hex} for c in obj.colors.all()]

    def get_sizes_names(self, obj):
        return [{'id': s.id, 'name': s.name} for s in obj.sizes.all()]

    def update(self, instance, validated_data):
        colors = self.initial_data.getlist('colors') if hasattr(self.initial_data, 'getlist') else self.initial_data.get('colors', [])
        sizes  = self.initial_data.getlist('sizes')  if hasattr(self.initial_data, 'getlist') else self.initial_data.get('sizes',  [])
        instance = super().update(instance, validated_data)
        if colors is not None:
            instance.colors.set(colors)
        if sizes is not None:
            instance.sizes.set(sizes)
        return instance

    def create(self, validated_data):
        colors = self.initial_data.getlist('colors') if hasattr(self.initial_data, 'getlist') else self.initial_data.get('colors', [])
        sizes  = self.initial_data.getlist('sizes')  if hasattr(self.initial_data, 'getlist') else self.initial_data.get('sizes',  [])
        instance = super().create(validated_data)
        if colors:
            instance.colors.set(colors)
        if sizes:
            instance.sizes.set(sizes)
        return instance
    
# ── Order serializers ──

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'product_price', 'size', 'color']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = '__all__'


# ── Admin User serializer ──

class AdminUserSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()
    total_spent  = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone', 'is_active', 'created_at',
            'orders_count', 'total_spent'
        ]

    def get_orders_count(self, obj):
        return obj.orders.count()

    def get_total_spent(self, obj):
        result = obj.orders.filter(status='delivered').aggregate(total=Sum('total'))
        return float(result['total'] or 0)