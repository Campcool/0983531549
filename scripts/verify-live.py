"""Read-only post-deployment check against the artifact built in this same workflow."""
import hashlib
from html.parser import HTMLParser
from pathlib import Path
import sys
import time
from urllib.request import Request, urlopen

root = Path(sys.argv[1]).resolve()
origin = 'https://jjf.tw'


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        value = attrs.get('src' if tag == 'script' else 'href', '')
        if tag in ('script', 'link') and value.startswith('/assets/'):
            self.paths.add(value)


expected = {'/': root / 'index.html', '/cases/': root / 'cases/index.html'}
for page in list(expected.values()):
    parser = Assets()
    parser.feed(page.read_text())
    for path in parser.paths:
        expected[path] = root / path.lstrip('/')
expected['/cases/site-cleaning-hero.jpg'] = root / 'cases/site-cleaning-hero.jpg'
expected['/cases/manage/'] = root / 'cases/manage/index.html'

for attempt in range(1, 11):
    try:
        for path, file in expected.items():
            request = Request(origin + path, headers={'Cache-Control': 'no-cache', 'User-Agent': 'JJF-Pages-Verification'})
            with urlopen(request, timeout=20) as response:
                if response.status != 200 or not response.url.startswith(origin + '/'):
                    raise AssertionError(f'{path}: unexpected status or redirect')
                live = response.read()
            if hashlib.sha256(live).digest() != hashlib.sha256(file.read_bytes()).digest():
                raise AssertionError(f'{path}: public content does not match this deployment artifact yet')
        print(f'Live verification passed: {len(expected)} pages/assets match the deployed artifact at {origin}')
        break
    except (OSError, AssertionError) as error:
        print(f'Attempt {attempt}/10: {error}', flush=True)
        if attempt == 10:
            raise
        time.sleep(8)
