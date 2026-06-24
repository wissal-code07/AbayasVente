from django.contrib import admin
from .models import Product, Category, Color, Size, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['name', 'category', 'price', 'old_price', 'stock', 'badge', 'is_active', 'created_at']
    list_filter    = ['category', 'badge', 'is_active', 'created_at']
    search_fields  = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal   = ['sizes', 'colors']
    inlines        = [ProductImageInline]
    list_editable  = ['price', 'stock', 'is_active']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ['name', 'hex']


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display  = ['name', 'order']
    list_editable = ['order']
