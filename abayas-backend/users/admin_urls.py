from django.urls import path
from .views import (
    AdminStatsView, RevenueDataView,
    AdminOrdersView, AdminOrderUpdateView,
    AdminProductsView, AdminProductDetailView,
    AdminUsersView, AdminUserToggleView,
    AdminProductImagesView, AdminProductImageDeleteView,
)

urlpatterns = [
    path('stats/',                        AdminStatsView.as_view(),              name='admin_stats'),
    path('revenue/',                      RevenueDataView.as_view(),             name='admin_revenue'),
    path('orders/',                       AdminOrdersView.as_view(),             name='admin_orders'),
    path('orders/<int:pk>/',              AdminOrderUpdateView.as_view(),        name='admin_order_update'),
    path('products/',                     AdminProductsView.as_view(),           name='admin_products'),
    path('products/<int:pk>/',            AdminProductDetailView.as_view(),      name='admin_product_detail'),
    path('products/<int:pk>/images/',     AdminProductImagesView.as_view(),      name='admin_product_images'),
    path('images/<int:pk>/delete/',       AdminProductImageDeleteView.as_view(), name='admin_image_delete'),
    path('users/',                        AdminUsersView.as_view(),              name='admin_users'),
    path('users/<int:pk>/toggle/',        AdminUserToggleView.as_view(),         name='admin_user_toggle'),
]