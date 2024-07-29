# Command starts a Uvicorn server for a Django ASGI application.
uvicorn chat_core.asgi:application --port 8000 --workers 4 --log-level debug --reload