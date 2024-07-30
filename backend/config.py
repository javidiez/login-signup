import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/local')
    SQLALCHEMY_TRACK_MODIFICATIONS = False