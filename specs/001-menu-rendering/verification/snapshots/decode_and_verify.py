#!/usr/bin/env python3
"""Decode captured base64 menu snapshots to HTML files and verify SHA-256 against the manifest.

Usage: python decode_and_verify.py <target>   where target is 'legacy' or 'current'
Reads <target>/_b64.json  ({ "0": b64, "1": b64, "2": b64, "3": b64 }),
writes <target>/lang-N.html (exact UTF-8 bytes), prints length + sha256, and (for current)
compares against legacy/manifest.json.
"""
import base64, hashlib, json, sys, os

target = sys.argv[1] if len(sys.argv) > 1 else 'legacy'
here = os.path.dirname(os.path.abspath(__file__))
tdir = os.path.join(here, target)

with open(os.path.join(tdir, '_b64.json'), encoding='utf-8') as f:
    blobs = json.load(f)

# Legacy manifest (oracle) for comparison.
manifest_path = os.path.join(here, 'legacy', 'manifest.json')
oracle = {}
if os.path.exists(manifest_path):
    with open(manifest_path, encoding='utf-8') as f:
        oracle = json.load(f).get('languages', {})

ok = True
for n in ['0', '1', '2', '3']:
    raw = base64.b64decode(blobs[n])
    text = raw.decode('utf-8')
    digest = hashlib.sha256(raw).hexdigest()
    out = os.path.join(tdir, 'lang-%s.html' % n)
    # Write exact bytes (no newline translation).
    with open(out, 'wb') as f:
        f.write(raw)
    exp = oracle.get(n, {}).get('sha256')
    match = (exp == digest) if exp else None
    flag = 'OK' if match else ('MISMATCH' if match is False else '--')
    if match is False:
        ok = False
    print('lang-%s  len=%-5d sha256=%s  vs-oracle=%s' % (n, len(text), digest, flag))

print('RESULT:', 'PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
