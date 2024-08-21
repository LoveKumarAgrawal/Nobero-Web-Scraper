# mongodb_config.py

from pymongo import MongoClient

def get_db():
    client = MongoClient('mongodb://localhost:27017/')  # MongoDB server address
    return client['Nobero']  # Updated to 'Nobero' database
