from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, RegisterView,
    ProfileView, ChangePasswordView,
    AddressListCreateView, AddressDetailView, SetDefaultAddressView,
)

urlpatterns = [
    # Auth
    path('login/',           CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/',   TokenRefreshView.as_view(),          name='token_refresh'),
    path('register/',        RegisterView.as_view(),               name='register'),

    # Profile
    path('profile/',         ProfileView.as_view(),                name='profile'),
    path('change-password/', ChangePasswordView.as_view(),         name='change_password'),

    # Addresses
    path('addresses/',                      AddressListCreateView.as_view(),  name='address_list'),
    path('addresses/<int:pk>/',             AddressDetailView.as_view(),      name='address_detail'),
    path('addresses/<int:pk>/set-default/', SetDefaultAddressView.as_view(), name='address_set_default'),
]