import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "server.app:app",
        host="192.168.0.10",
        port=8000,
        log_level="debug",
        reload=True
    )
