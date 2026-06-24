from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    """Lister les commandes de l'utilisateur et en créer une nouvelle"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderDetailView(generics.RetrieveAPIView):
    """Détail d'une commande"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CancelOrderView(APIView):
    """Annuler une commande (seulement si elle est en attente)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            if order.status not in ['pending', 'confirmed']:
                return Response(
                    {"error": "Cette commande ne peut plus être annulée."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            order.status = 'cancelled'
            order.save()
            return Response({"message": "Commande annulée."})
        except Order.DoesNotExist:
            return Response({"error": "Commande non trouvée."}, status=status.HTTP_404_NOT_FOUND)


# ── Admin views (staff only) ──

class AdminOrderListView(generics.ListAPIView):
    """Liste toutes les commandes — Admin uniquement"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = Order.objects.all().prefetch_related('items').select_related('user')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class AdminOrderUpdateView(generics.UpdateAPIView):
    """Modifier le statut d'une commande — Admin uniquement"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset           = Order.objects.all()
    http_method_names  = ['patch']
