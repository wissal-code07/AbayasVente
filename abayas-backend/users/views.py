from rest_framework import generics, status, permissions, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import User, Address
from products.models import Product, ProductImage
from orders.models import Order, OrderItem
from .serializers import (
    CustomTokenObtainPairSerializer, RegisterSerializer,
    UserSerializer, UpdateProfileSerializer,
    ChangePasswordSerializer, AddressSerializer,
    AdminProductSerializer, OrderSerializer, AdminUserSerializer  # ← corrigé
)


# ── Auth views ──

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "Compte créé avec succès.",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


# ── Profile views ──

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdateProfileSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({"message": "Mot de passe modifié avec succès."})


# ── Address views ──

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class SetDefaultAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            address = Address.objects.get(pk=pk, user=request.user)
            address.is_default = True
            address.save()
            return Response({"message": "Adresse par défaut mise à jour."})
        except Address.DoesNotExist:
            return Response({"error": "Adresse non trouvée."}, status=status.HTTP_404_NOT_FOUND)


# ── Admin views ──

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_revenue = Order.objects.filter(status='delivered').aggregate(total=Sum('total'))['total'] or 0
        total_orders  = Order.objects.count()
        total_clients = User.objects.filter(is_staff=False).count()
        avg_order     = total_revenue / total_orders if total_orders else 0

        return Response({
            'revenue':  {'value': f"{total_revenue:,.0f} DA", 'change': '+0%', 'up': True},
            'orders':   {'value': total_orders,               'change': '+0%', 'up': True},
            'clients':  {'value': total_clients,              'change': '+0%', 'up': True},
            'avgOrder': {'value': f"{avg_order:,.0f} DA",     'change': '+0%', 'up': True},
        })


class RevenueDataView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        end_date   = timezone.now().date()
        start_date = end_date - timedelta(days=6)
        data = []
        for i in range(7):
            day     = start_date + timedelta(days=i)
            revenue = Order.objects.filter(
                created_at__date=day, status='delivered'
            ).aggregate(total=Sum('total'))['total'] or 0
            data.append({'day': day.strftime('%a'), 'value': float(revenue)})
        return Response(data)


class AdminOrdersView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class   = OrderSerializer
    queryset           = Order.objects.all().order_by('-created_at')

    def get_queryset(self):
        qs     = super().get_queryset()
        status = self.request.query_params.get('status')
        if status and status != 'tous':
            qs = qs.filter(status=status)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(order_number__icontains=search) | qs.filter(shipping_name__icontains=search)
        return qs


class AdminOrderUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset           = Order.objects.all()
    serializer_class   = OrderSerializer
    partial            = True


class AdminProductsView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset           = Product.objects.all()
    serializer_class   = AdminProductSerializer  # ← corrigé

    def get_queryset(self):
        qs     = super().get_queryset()
        status = self.request.query_params.get('status')
        if status == 'actif':
            qs = qs.filter(is_active=True)
        elif status == 'inactif':
            qs = qs.filter(is_active=False)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)
        return qs


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset           = Product.objects.all()
    serializer_class   = AdminProductSerializer  # ← corrigé


class AdminUsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset           = User.objects.filter(is_staff=False)
    serializer_class   = AdminUserSerializer

    def get_queryset(self):
        qs     = super().get_queryset()
        status = self.request.query_params.get('status')
        if status == 'actif':
            qs = qs.filter(is_active=True)
        elif status == 'inactif':
            qs = qs.filter(is_active=False)
        search = self.request.query_params.get('search')
        if search:
            qs = (
                qs.filter(email__icontains=search) |
                qs.filter(first_name__icontains=search) |
                qs.filter(last_name__icontains=search)
            )
        return qs


class AdminUserToggleView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            user      = User.objects.get(pk=pk, is_staff=False)
            is_active = request.data.get('is_active')
            if is_active is not None:
                user.is_active = is_active
                user.save()
            return Response(AdminUserSerializer(user).data)
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=404)


# ── Admin Product Images ──

class AdminProductImagesView(APIView):
    permission_classes = [permissions.IsAdminUser]
    parser_classes     = [parsers.MultiPartParser, parsers.FormParser]

    def get(self, request, pk):
        images = ProductImage.objects.filter(product_id=pk)
        data   = [{'id': img.id, 'image': request.build_absolute_uri(img.image.url), 'is_primary': img.is_primary} for img in images]
        return Response(data)

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Produit non trouvé'}, status=404)
        image = request.FILES.get('image')
        if not image:
            return Response({'error': 'Image requise'}, status=400)
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        if is_primary:
            ProductImage.objects.filter(product=product, is_primary=True).update(is_primary=False)
        img = ProductImage.objects.create(product=product, image=image, is_primary=is_primary)
        return Response({
            'id':         img.id,
            'image':      request.build_absolute_uri(img.image.url),
            'is_primary': img.is_primary
        }, status=201)


class AdminProductImageDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            img = ProductImage.objects.get(pk=pk)
            img.image.delete(save=False)
            img.delete()
            return Response({'status': 'ok'})
        except ProductImage.DoesNotExist:
            return Response({'error': 'Image non trouvée'}, status=404)