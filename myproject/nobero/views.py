from django.http import JsonResponse
from mongodb_config import get_db
from bson import ObjectId
from django.views.decorators.http import require_http_methods

def get_products(request):
    db = get_db()
    products_collection = db['Products']
    products = list(products_collection.find({}))
    for product in products:
        product['_id'] = str(product['_id'])
    return JsonResponse(products, safe=False)

def get_products_by_category(request):
    db = get_db()
    products_collection = db['Products']
    
    # Retrieve the 'category' query parameter
    category = request.GET.get('category', None)
    
    if category:
        # Query the collection to find documents matching the category
        products = list(products_collection.find({"category": category}))
    else:
        # If no category is provided, return an error message
        return JsonResponse({"error": "Category query parameter is required."}, status=400)
    
    # Convert ObjectId to string for JSON serialization
    for product in products:
        product['_id'] = str(product['_id'])
    
    return JsonResponse(products, safe=False)

def get_product_by_id(request):
    db = get_db()
    products_collection = db['Products']
    
    # Retrieve the 'id' query parameter
    product_id = request.GET.get('id', None)
    
    if not product_id:
        return JsonResponse({"error": "ID query parameter is required."}, status=400)
    
    try:
        # Convert the string ID to an ObjectId
        product_id = ObjectId(product_id)
    except Exception:
        return JsonResponse({"error": "Invalid ID format."}, status=400)
    
    # Query the collection to find the product with the given ID
    product = products_collection.find_one({"_id": product_id})
    
    if not product:
        return JsonResponse({"error": "Product not found."}, status=404)
    
    # Convert ObjectId to string for JSON serialization
    product['_id'] = str(product['_id'])
    
    return JsonResponse(product)
