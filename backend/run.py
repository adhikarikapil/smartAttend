from app import create_app, db
from dotenv import load_dotenv

# Load environment variables from .env and .flaskenv files
load_dotenv()

app = create_app()

if (__name__) == '__main__':
    app.run(debug=True, use_reloader=True)