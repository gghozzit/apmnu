"""Turns a narration WAV into a lower, male-timbred voice with Praat's "Change gender".

    male_voice.py in.wav out.wav --pitch 120 --formant 0.86 --range 1.2

pitch    new median F0 in Hz (the source voice sits near 208 Hz)
formant  formant shift ratio; below 1 lengthens the vocal tract, so the voice sounds bigger
range    pitch-range factor; above 1 widens the intonation, which keeps the delivery lively
"""
import argparse
import wave

import numpy as np
import parselmouth
from parselmouth.praat import call


def read_wav(path):
    with wave.open(path) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    return x, sr


def write_wav(path, x, sr):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--pitch", type=float, default=120)
    ap.add_argument("--formant", type=float, default=0.86)
    ap.add_argument("--range", type=float, default=1.2)
    args = ap.parse_args()

    x, sr = read_wav(args.src)
    out = call(parselmouth.Sound(x, sampling_frequency=sr), "Change gender", 75, 500, args.formant, args.pitch, args.range, 1.0)
    write_wav(args.dst, out.values[0], int(out.sampling_frequency))


if __name__ == "__main__":
    main()
