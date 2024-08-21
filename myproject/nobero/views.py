from django.http import JsonResponse
from mongodb_config import get_db

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
