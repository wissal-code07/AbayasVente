from django.db import models
from users.models import User, Address
from products.models import Product, Color, Size


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',   'En attente'),
        ('confirmed', 'Confirmée'),
        ('shipped',   'Expédiée'),
        ('delivered', 'Livrée'),
        ('cancelled', 'Annulée'),
    ]

    PAYMENT_CHOICES = [
        ('cod',      'Paiement à la livraison'),
        ('card',     'Carte bancaire'),
        ('virement', 'Virement bancaire'),
    ]

    DELIVERY_CHOICES = [
        ('standard', 'Livraison Standard'),
        ('express',  'Livraison Express'),
        ('relay',    'Point Relais'),
    ]

    user              = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    order_number      = models.CharField(max_length=20, unique=True)
    status            = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Adresse de livraison (snapshot au moment de la commande)
    shipping_name     = models.CharField(max_length=200)
    shipping_address  = models.TextField()
    shipping_city     = models.CharField(max_length=100)
    shipping_wilaya   = models.CharField(max_length=100)
    shipping_phone    = models.CharField(max_length=20)

    # Livraison & paiement
    delivery_method   = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default='standard')
    delivery_price    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method    = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cod')

    # Totaux
    subtotal          = models.DecimalField(max_digits=10, decimal_places=2)
    total             = models.DecimalField(max_digits=10, decimal_places=2)

    notes             = models.TextField(blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering            = ['-created_at']

    def __str__(self):
        return f"Commande {self.order_number} — {self.user}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"CMD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)

    # Snapshot des données produit au moment de la commande
    product_name  = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity      = models.PositiveIntegerField(default=1)
    size          = models.CharField(max_length=10, blank=True)
    color         = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name        = 'Article de commande'
        verbose_name_plural = 'Articles de commande'

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"

    @property
    def total_price(self):
        return self.product_price * self.quantity
