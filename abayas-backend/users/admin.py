from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address, Product, Order, OrderItem


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ['email', 'first_name', 'last_name', 'phone', 'is_active', 'is_staff', 'created_at']
    list_filter    = ['is_active', 'is_staff', 'created_at']
    search_fields  = ['email', 'first_name', 'last_name']
    ordering       = ['-created_at']

    fieldsets = (
        (None,           {'fields': ('email', 'password')}),
        ('Informations', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Permissions',  {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates',        {'fields': ('last_login', 'created_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone', 'password1', 'password2'),
        }),
    )
    readonly_fields = ['created_at', 'last_login']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display  = ['user', 'label', 'city', 'wilaya', 'is_default']
    list_filter   = ['wilaya', 'is_default']
    search_fields = ['user__email', 'first_name', 'last_name', 'city']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'sold', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock', 'is_active']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'shipping_name', 'shipping_wilaya', 'status', 'total', 'created_at']
    list_filter = ['status', 'created_at', 'shipping_wilaya']
    search_fields = ['order_number', 'shipping_name', 'shipping_phone']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    list_editable = ['status']
    fieldsets = (
        ('Commande', {'fields': ('order_number', 'user', 'status', 'total', 'delivery_price')}),
        ('Livraison', {'fields': ('shipping_name', 'shipping_address', 'shipping_city', 'shipping_wilaya', 'shipping_phone')}),
        ('Paiement', {'fields': ('delivery_method', 'payment_method', 'notes')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'product_price', 'size', 'color']
    list_filter = ['order__status']
    search_fields = ['product_name', 'order__order_number']