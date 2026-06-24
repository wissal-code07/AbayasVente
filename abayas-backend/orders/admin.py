from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model          = OrderItem
    extra          = 0
    readonly_fields = ['product_name', 'product_price', 'quantity', 'size', 'color']
    can_delete     = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display   = ['order_number', 'user', 'status', 'delivery_method',
                      'payment_method', 'total', 'created_at']
    list_filter    = ['status', 'delivery_method', 'payment_method', 'created_at']
    search_fields  = ['order_number', 'user__email', 'shipping_name']
    list_editable  = ['status']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines        = [OrderItemInline]
    ordering       = ['-created_at']
