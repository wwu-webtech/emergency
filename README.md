# Simple Rave Poll Site

This is a minimal static page that polls https://content.getrave.com/cap/wwu/channel1 every 30 seconds and displays the response.

To run locally (recommended to avoid some browser CORS issues), serve the directory with a simple static server. Example:

```bash
# from the folder containing index.html
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

If you encounter CORS errors, run a local proxy (e.g., using Node's `http-proxy` or a small server) to forward requests to the target.
