from django.urls import path
from .views import get_products, get_products_by_category, get_product_by_id

urlpatterns = [
    path('products/', get_products, name='get_products'),
    path('products/category/', get_products_by_category, name='get_products_by_category'),
    path('product/id/', get_product_by_id, name='get_product_by_category')
]
