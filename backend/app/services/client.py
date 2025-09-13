import typesense
from app.config import settings

client = typesense.Client({
    'nodes': [{
        'host': settings.TYPESENSE_HOST,
        'port': settings.TYPESENSE_PORT,
        'protocol': 'http'
    }],
    'api_key': settings.TYPESENSE_API_KEY,
    'connection_timeout_seconds': 2
})
