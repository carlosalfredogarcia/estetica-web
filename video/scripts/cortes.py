"""Mide los bordes de cada tramo sobre el audio (RMS cada 10 ms), no con Whisper.

Uso: python3 scripts/cortes.py work/audio.wav
Lee las ventanas aproximadas de VENTANAS y escribe los tramos en data/edit.json.
"""
import json
import sys
import wave

import numpy as np

# (id, inicio aproximado de la voz, fin aproximado de la voz) en la grabación.
VENTANAS = [
    ("A", 0.0, 52.40),
    ("B", 53.38, 76.48),
    ("C", 77.80, 83.94),
    ("D", 84.84, 96.42),
    ("E", 97.36, 100.46),
    ("F", 105.20, 108.16),
]

w = wave.open(sys.argv[1])
sr = w.getframerate()
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
hop = int(sr * 0.01)
n = len(a) // hop
rms = 20 * np.log10(np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-6) - 90
dur = n * 0.01


def inicio_de_voz(desde, hasta, confirma=-40, umbral=-47):
    # La voz se confirma con 50 ms por encima de -40 dB (las respiraciones de las
    # pausas no llegan) y luego se retrocede hasta donde cruzó -47 dB.
    for i in range(int(desde / 0.01), int(hasta / 0.01)):
        if all(rms[i + k] > confirma for k in range(5)):
            while i > int(desde / 0.01) and rms[i - 1] > umbral:
                i -= 1
            return i * 0.01
    return desde


def fin_de_voz(t1, margen=0.6, umbral=-50):
    # Primer momento tras la última palabra en que la energía se queda abajo 50 ms.
    for i in range(int((t1 - 0.15) / 0.01), int((t1 + margen) / 0.01)):
        if all(rms[i + k] < umbral for k in range(5)):
            return i * 0.01
    return t1 + margen


words = json.load(open("work/words.json"))

tramos = []
for k, (id_, t0, t1) in enumerate(VENTANAS):
    # Se busca desde el silencio que sigue a la palabra anterior de la toma, no desde
    # lo que marca Whisper, que adelanta la primera palabra tras una pausa.
    previa = [x["end"] for x in words if x["end"] <= t0 - 0.05]
    desde = max(fin_de_voz(previa[-1]) if previa else 0.0, t0 - 0.6)
    # El primer tramo empieza en suave ("La"): ahí basta con -45 dB para confirmar.
    ini = inicio_de_voz(desde, t0 + 1.2, confirma=-45 if k == 0 else -40)
    fin = fin_de_voz(t1)
    entra = max(0.0, ini - (0.02 if k == 0 else 0.12))
    sale = min(dur, fin + 0.25)
    tramos.append({"id": id_, "from": round(entra, 2), "to": round(sale, 2), "mode": "full"})
    print(f"{id_}: voz {ini:6.2f}–{fin:6.2f}  corte {entra:6.2f}–{sale:6.2f}")

for x, y in zip(tramos, tramos[1:]):
    assert x["to"] <= y["from"], f"{x['id']} pisa a {y['id']}"

d = json.load(open("data/edit.json"))
d["tramos"] = tramos
json.dump(d, open("data/edit.json", "w"), ensure_ascii=False, indent=1)
print("total", round(sum(t["to"] - t["from"] for t in tramos), 2))
