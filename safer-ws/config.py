"""[General Configuration Params]
"""
from os import environ, path
from dotenv import load_dotenv
import os


basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))

MONGODB_URI = environ.get('MONGODB_URI')
