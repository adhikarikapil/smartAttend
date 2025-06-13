from app import create_app, db
from dotenv import load_dotenv
from app.extentions import socketio
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log')
    ]
)

# Set specific loggers
logging.getLogger('socketio').setLevel(logging.DEBUG)
logging.getLogger('engineio').setLevel(logging.DEBUG)
logging.getLogger('werkzeug').setLevel(logging.INFO)

# Load environment variables from .env and .flaskenv files
load_dotenv()

app = create_app()

if __name__ == '__main__':
    logging.info("Starting SmartAttend server...")
    socketio.run(app, host='127.0.0.1', port=5000, debug=True, allow_unsafe_werkzeug=True)