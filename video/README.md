# Vídeo MiFinanzas (Remotion)

Reel/TikTok vertical de 1080x1920 a 30 fps: la grabación de la app dentro de un
Android genérico, gancho al principio, focos y rótulos de datos y subtítulos.

- `data/edit.json`: todo el montaje. Tramos, palabras, focos y rótulos van en
  segundos de la grabación original, así que recortar no los descoloca.
- `public/clips/app.mp4`: la grabación preparada (no se sube al repo).

```bash
npm install
# la grabación, escalada x2 y a 30 fps
ffmpeg -i GRABACION.mp4 -vf "scale=784:1700:flags=lanczos,fps=30" -c:v libx264 -crf 16 -c:a aac public/clips/app.mp4
# audio y transcripción (necesita acceso a huggingface.co para el modelo)
mkdir -p work && ffmpeg -i GRABACION.mp4 -map 0:a:0 -ac 1 -ar 16000 work/audio.wav
python3 scripts/transcribir.py work/audio.wav

npm run studio
REMOTION_CHROME=/ruta/a/chrome-headless-shell npm run render
```
