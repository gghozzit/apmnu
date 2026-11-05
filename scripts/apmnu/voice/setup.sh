#!/bin/sh
# One-time setup for the male narration voice: a small Python venv with Praat bindings.
# `sh scripts/apmnu/voice/setup.sh`   (macOS; the base voice is the built-in Indonesian "Damayanti")
set -e
cd "$(dirname "$0")/../../.."
python3 -m venv .venv-tts
.venv-tts/bin/pip install --quiet praat-parselmouth numpy
.venv-tts/bin/python -c "import parselmouth, numpy; print('voice tools ready:', parselmouth.__version__)"
