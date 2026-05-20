from datetime import datetime
import random
import string

def generate_sku(category_prefix: str) -> str:
    # Format: CAT-YYYYMMDD-XXXX
    date_str = datetime.now().strftime("%Y%m%d")
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    
    # ensure category prefix is 3 uppercase letters
    cat_code = category_prefix[:3].upper() if category_prefix else "GEN"
    if len(cat_code) < 3:
        cat_code = cat_code.ljust(3, 'X')
        
    return f"{cat_code}-{date_str}-{random_chars}"
