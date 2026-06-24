from django.urls import path
from .views import (
    OrderListCreateView, OrderDetailView, CancelOrderView,
    AdminOrderListView, AdminOrderUpdateView
)

urlpatterns = [
    # Client
    path('',              OrderListCreateView.as_view(), name='order_list_create'),
    path('<int:pk>/',     OrderDetailView.as_view(),     name='order_detail'),
    path('<int:pk>/cancel/', CancelOrderView.as_view(),  name='order_cancel'),

    # Admin
    path('admin/all/',       AdminOrderListView.as_view(),   name='admin_order_list'),
    path('admin/<int:pk>/',  AdminOrderUpdateView.as_view(), name='admin_order_update'),
]
