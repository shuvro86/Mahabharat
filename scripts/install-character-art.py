"""Copy generated originals into optimized, local web assets; no creative edits."""
import json
import pathlib
import subprocess
import sys

root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'src/assets/characters'
out.mkdir(parents=True, exist_ok=True)
for item in json.load(open(sys.argv[1])):
    destination = out / (item['id'] + '.jpg')
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '85', '-Z', '960', item['source'], '--out', str(destination)], check=True, capture_output=True)
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '480', item['source'], '--out', str(out / (item['id'] + '-card.jpg'))], check=True, capture_output=True)
    print(item['id'], destination.stat().st_size)
