import time
import sys
import logging

import bottle


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
log = logging.getLogger(__name__)

app = bottle.Bottle()

app.config.meta_set('port', 'filter', int)
app.config.meta_set('debug', 'filter', lambda s: str(s).lower() == 'true')
app.config.meta_set('rss.port-start', 'filter', int)
app.config.load_dict({
    'host': 'localhost',
    'port': 8888,
    'server': 'wsgiref',
    'debug': False,
    'rss': {
        'port-start': 10000
        }
    })

db = {}


@bottle.get('/')
def index():
    resp = {
        'success': True,
        'db': db.values(),
        }
    return resp


@bottle.get('/<uuid>')
def hook(uuid):
    if not uuid in db:
        db[uuid] = {}
    db[uuid]['time'] = int(time.time())
    return db[uuid]


def run():
    if len(sys.argv) > 1:
        for cfg in sys.argv[1:]:
            app.config.load_config(cfg)
    if app.config['debug']:
        log.setLevel(logging.DEBUG)
        bottle.debug(True)
    bottle.run(
        server=app.config['server'],
        host=app.config['host'],
        port=app.config['port'],
        reloader=app.config['debug'],
        )


if __name__ == '__main__':
    app.config['debug'] = True
    run()
