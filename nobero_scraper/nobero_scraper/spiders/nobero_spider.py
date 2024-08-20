import scrapy
import pymongo
import re

class NoberoSpider(scrapy.Spider):
    name = "nobero"
    allowed_domains = ["nobero.com"]
    start_urls = ["https://nobero.com/pages/men"]

    subcategory_names = [
        "oversized t-shirts",
        "t-shirts",
        "co-ords",
        "joggers",
        "shorts",
        "plus size t-shirts"
    ]

    def __init__(self, *args, **kwargs):
        super(NoberoSpider, self).__init__(*args, **kwargs)
        # Connect to MongoDB
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.client["Nobero"]
        self.collection = self.db["Products"]

    def parse(self, response):
        # Extract subcategory links
        items = response.css(".custom-page-season-grid-item")
        base_url = "https://nobero.com"
        
        for i, item in enumerate(items):
            # Extract the links within each item
            link = item.css("a::attr(href)").get()
            full_link = base_url + link.strip()
            subcategory_name = self.subcategory_names[i]  # Get the corresponding subcategory name
            
            self.log(f"Found subcategory link: {full_link}")
            
            # Pass the subcategory name as meta data
            yield scrapy.Request(url=full_link, callback=self.parse_subcategory, meta={'subcategory': subcategory_name, 'page': 1})

    def parse_subcategory(self, response):
        base_url = "https://nobero.com"
        subcategory = response.meta['subcategory']
        page = response.meta['page']

        # Extract product links on the current page
        product_links = response.css(".product-card-container a::attr(href)").getall()
        
        if product_links:
            for link in product_links:
                full_link = base_url + link.strip()
                self.log(f"Found product link: {full_link}")
                
                # Pass the subcategory name as meta data to the parse_product function
                yield scrapy.Request(url=full_link, callback=self.parse_product, meta={'subcategory': subcategory})
        
            # Increment the page number and construct the next page URL
            next_page_url = f"{response.url.split('?')[0]}?page={page + 1}&section_id=template--16047755788454__product-grid"
            
            self.log(f"Following pagination to: {next_page_url}")
            
            # Make a request to the next page
            yield scrapy.Request(url=next_page_url, callback=self.parse_subcategory, meta={'subcategory': subcategory, 'page': page + 1})

    def parse_product(self, response):
        # Extract product details
        product_name = response.css('h1.capitalize::text').get()
        product_price_text = response.css('h2#variant-price spanclass::text').get()
        product_mrp_text = response.css('span#variant-compare-at-price spanclass::text').get()
        
        # Ensure product_name and prices are not None before processing
        product_name = product_name.strip() if product_name else None
        product_price = (
            product_price_text.strip().replace('₹', '').replace(',', '').strip()
            if product_price_text else None
        )
        product_mrp = (
            product_mrp_text.strip().replace('₹', '').replace(',', '').strip()
            if product_mrp_text else None
        )

        bought_count_text = response.css('div.product_bought_count span::text').get()
        last_7_day_sale = None
        match = None
        
        if bought_count_text:
            # Use a regular expression to find the number in the text
            match = re.search(r'\d+', bought_count_text)
        
        if match:
            last_7_day_sale = match.group()
        
        # Retrieve the subcategory name from the meta data
        subcategory = response.meta.get('subcategory', None)

        # Extract product information from the product information container
        fit = response.css('div.product-metafields-values:nth-of-type(1) p::text').get()
        fabric = response.css('div.product-metafields-values:nth-of-type(2) p::text').get()
        neck = response.css('div.product-metafields-values:nth-of-type(3) p::text').get()
        sleeve = response.css('div.product-metafields-values:nth-of-type(4) p::text').get()
        pattern = response.css('div.product-metafields-values:nth-of-type(5) p::text').get()
        length = response.css('div.product-metafields-values:nth-of-type(6) p::text').get()

        # Extract the product description using strong and span tags
        description_parts = []
        description_content = response.css('div#description_content').get()
        if description_content:
            strong_tags = response.css('div#description_content strong::text').getall()
            span_tags = response.css('div#description_content span::text').getall()
            br_tags = response.css('div#description_content br::text').getall()
            
            # Format the description
            for strong in strong_tags:
                description_parts.append(f"{strong}:")
                # Add the corresponding span text if exists
                index = strong_tags.index(strong)
                if index < len(span_tags):
                    description_parts.append(span_tags[index].strip())
                
            for span in span_tags:
                if span not in strong_tags:
                    description_parts.append(span.strip())
            
            # Join parts with newline
            description = "\n".join(description_parts).strip()
        else:
            description = None

        # Extract size information
        size_elements = response.css('fieldset.grid label input::attr(value)').getall()
        sizes = list(set(size_elements))  # Remove duplicates

        # Extract color information (for demonstration, assuming color extraction logic is similar)
        colors = response.css('div.color-section fieldset label input::attr(value)').getall()
        unique_colors = list(set(colors))  # Remove duplicates

        # Create available_skus dictionary
        available_skus = [
            {
                "color": color,
                "size": sizes
            }
            for color in unique_colors
        ]

        # Create a product dictionary
        product = {
            'title': product_name,
            'price': product_price,
            'MRP': product_mrp,
            'last_7_day_sale': last_7_day_sale,
            'url': response.url,
            'category': subcategory,
            'available_skus': available_skus,
            'fit': fit.strip() if fit else None,
            'fabric': fabric.strip() if fabric else None,
            'neck': neck.strip() if neck else None,
            'sleeve': sleeve.strip() if sleeve else None,
            'pattern': pattern.strip() if pattern else None,
            'length': length.strip() if length else None,
            'description': description
        }

        # Insert the product into MongoDB
        self.collection.insert_one(product)

        # Log the extracted product details
        self.log(f"Product extracted and inserted into MongoDB: {product}")
