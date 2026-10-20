"""Transcribe por palabras y enseña los bloques separados por pausas.

Uso: python3 scripts/transcribir.py work/audio.wav
Escribe work/words.json (tiempos en segundos de la grabación original).
"""
import json
import sys
import wave

import numpy as np

from faster_whisper import WhisperModel

# El WAV (mono, 16 kHz) se lee aquí: el lector de faster-whisper depende de PyAV
# y falla con algunas versiones.
w = wave.open(sys.argv[1])
audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
model = WhisperModel("large-v3", device="cpu", compute_type="int8")
segments, _ = model.transcribe(audio, language="es", word_timestamps=True, vad_filter=False)
words = [
    {"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
    for s in segments
    for w in s.words
]
json.dump(words, open("work/words.json", "w"), ensure_ascii=False, indent=1)

# Bloques por pausas de más de 0,6 s: así se ven las tomas repetidas.
block = []
for i, w in enumerate(words):
    if block and w["start"] - words[i - 1]["end"] > 0.6:
        print(f'{block[0]["start"]:7.2f}–{block[-1]["end"]:7.2f}  {" ".join(x["text"] for x in block)}')
        block = []
    block.append(w)
if block:
    print(f'{block[0]["start"]:7.2f}–{block[-1]["end"]:7.2f}  {" ".join(x["text"] for x in block)}')
