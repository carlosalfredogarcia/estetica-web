"""Energía del audio cada 10 ms, en dB. Uso: python3 scripts/rms.py work/audio.wav T0 T1"""
import sys
import wave

import numpy as np

w = wave.open(sys.argv[1])
sr = w.getframerate()
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
hop = int(sr * 0.01)
n = len(a) // hop
rms = 20 * np.log10(np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-6) - 90
t0, t1 = float(sys.argv[2]), float(sys.argv[3])
for i in range(int(t0 / 0.01), int(t1 / 0.01), 2):
    print(f"{i * 0.01:7.2f} {rms[i]:6.1f} " + "#" * max(0, int(rms[i] + 70)))
