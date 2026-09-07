import sys
import os

# Add backend directory to python path for Vercel serverless function
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

# Export app for Vercel Serverless Function handler
handler = app
