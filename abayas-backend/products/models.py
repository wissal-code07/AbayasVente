from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name       = models.CharField(max_length=100, unique=True)
    slug       = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering            = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)
    hex  = models.CharField(max_length=7, default='#000000')

    def __str__(self):
        return self.name


class Size(models.Model):
    name  = models.CharField(max_length=10, unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Product(models.Model):
    BADGE_CHOICES = [
        ('new',   'Nouveau'),
        ('promo', 'Promotion'),
        ('',      'Aucun'),
    ]

    name        = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    old_price   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock       = models.PositiveIntegerField(default=0)
    sizes       = models.ManyToManyField(Size,  blank=True)
    colors      = models.ManyToManyField(Color, blank=True)
    badge       = models.CharField(max_length=10, choices=BADGE_CHOICES, blank=True, default='')
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Produit'
        verbose_name_plural = 'Produits'
        ordering            = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return round(((self.old_price - self.price) / self.old_price) * 100)
        return None


class ProductImage(models.Model):
    product    = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    order      = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary']

    def __str__(self):
        return f"Image de {self.product.name}"
