from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
import time


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email      = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    phone      = models.CharField(max_length=20, blank=True)
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name        = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering            = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Address(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label      = models.CharField(max_length=50, blank=True, default='Domicile')
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    address    = models.TextField()
    city       = models.CharField(max_length=100)
    wilaya     = models.CharField(max_length=100)
    phone      = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Adresse'
        verbose_name_plural = 'Adresses'
        ordering            = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.label} — {self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Classique', 'Classique'),
        ('Soirée', 'Soirée'),
        ('Moderne', 'Moderne'),
        ('Premium', 'Premium'),
    ]
    name        = models.CharField(max_length=200)
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    stock       = models.PositiveIntegerField(default=0)
    sold        = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    image       = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('shipped', 'Expédiée'),
        ('delivered', 'Livrée'),
        ('cancelled', 'Annulée'),
    ]
    # ✅ related_name modifié pour éviter le conflit avec une autre application
    user            = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_orders')
    order_number    = models.CharField(max_length=20, unique=True, blank=True)
    shipping_name   = models.CharField(max_length=200)
    shipping_address = models.TextField()
    shipping_city   = models.CharField(max_length=100)
    shipping_wilaya = models.CharField(max_length=100)
    shipping_phone  = models.CharField(max_length=20)
    delivery_method = models.CharField(max_length=50, blank=True)
    payment_method  = models.CharField(max_length=50, blank=True)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total           = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_price  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes           = models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"CMD-{int(time.time() * 1000)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order       = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product     = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=200)
    quantity    = models.PositiveIntegerField()
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    size        = models.CharField(max_length=20, blank=True)
    color       = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name = 'Article de commande'
        verbose_name_plural = 'Articles de commande'

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"