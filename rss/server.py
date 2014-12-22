import time
import sys
import logging

import psutil
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
port_counter = app.config['rss.port-start']


def netstat(port):
    status = {
        'listen': False,
        'established': [],
        }
    for c in psutil.net_connections(kind='tcp'):
        if port in c.laddr and c.status == 'LISTEN':
            status['listen'] = True
        if port in c.raddr and c.status == 'ESTABLISHED':
            status['established'].append(c.pid)
    return status


@bottle.get('/')
def index():
    for uuid in db:
        db[uuid].update(netstat(db[uuid]['port']))
    resp = {
        'success': True,
        'db': db.values(),
        }
    return resp


@bottle.get('/<uuid>')
def status(uuid):
    global port_counter
    if not uuid in db:
        db[uuid] = {
            'uuid': uuid,
            'name': bottle.request.query.get('name'),
            'port': port_counter,
            'active': False,
            'listen': False,
            'established': [],
            }
        port_counter += 1
    db[uuid]['name'] = bottle.request.query.get('name')
    db[uuid]['time'] = int(time.time())
    db[uuid].update(netstat(db[uuid]['port']))
    return db[uuid]


def run():
    global port_counter
    if len(sys.argv) > 1:
        for cfg in sys.argv[1:]:
            app.config.load_config(cfg)
    port_counter = app.config['rss.port-start']
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
