@echo off
REM Windows dispatcher so the model can run `ccmetr submit ...` (mirrors the unix
REM `ccmetr` script). Forwards every arg to the Python client. Requires Python 3
REM on PATH (`python`). %~dp0 is this script's directory.
python "%~dp0ccmetr-client.py" %*
