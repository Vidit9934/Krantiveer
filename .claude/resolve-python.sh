#!/bin/bash
# Sourced by the Python-based hooks. Sets $PYTHON to an interpreter that actually
# runs, or "" if none does.
#
# Why not just `python3`: on Windows, `python3`/`python` on PATH are often the
# Microsoft Store stubs (they print "Python was not found" and exit 49/9009), and
# python.org installs ship python.exe but no python3.exe. `command -v python3`
# happily returns the stub, so hooks failed silently and every gate fell open.
#
# PYTHONUTF8=1: native Windows Python otherwise decodes hook JSON on stdin as
# cp1252 and chokes on non-ASCII tool input (em dashes, emoji in file contents).

export PYTHONUTF8=1
PYTHON=""
for _py_candidate in python3 python py \
    "$HOME"/AppData/Local/Programs/Python/Python3*/python.exe \
    /c/Program\ Files/Python3*/python.exe; do
  if command -v "$_py_candidate" >/dev/null 2>&1 &&
     "$_py_candidate" -c "import sys; sys.exit(sys.version_info < (3, 6))" >/dev/null 2>&1; then
    PYTHON=$(command -v "$_py_candidate")
    break
  fi
done
unset _py_candidate

# Native Windows Python can't open MSYS paths like /c/Users/...; convert when we can.
native_path() {
  cygpath -m "$1" 2>/dev/null || printf '%s' "$1"
}
