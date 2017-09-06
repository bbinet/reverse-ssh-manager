import time
import sys
import logging

import psutil
import bottle
from pkg_resources import resource_filename


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
log = logging.getLogger(__name__)

app = bottle.Bottle()

app.config.meta_set('port', 'filter', int)
app.config.meta_set('debug', 'filter', lambda s: str(s).lower() == 'true')
app.config.meta_set('rsm.port-start', 'filter', int)
app.config.load_dict({
    'host': 'localhost',
    'port': 8888,
    'server': 'wsgiref',
    'debug': False,
    'rsm': {
        'port-start': 10000
        }
    })

db = {}
port_counter = app.config['rsm.port-start']


def netstat(port):
    status = {
        'listen': False,
        'established': [],
        }
    for c in psutil.net_connections(kind='tcp'):
        if port in c.laddr and c.status == 'LISTEN':
            status['listen'] = c.pid
        if port in c.raddr and c.status == 'ESTABLISHED':
            status['established'].append(c.pid)
    return status


@app.route('/debug/<filepath:path>')
def static_debug(filepath):
    if not app.config['debug']:
        raise bottle.HTTPError(status=404)
    return bottle.static_file(filepath, root='static')


@app.route('/dist/<filepath:path>')
def static_dist(filepath):
    return bottle.static_file(
        filepath, root=resource_filename(__name__, 'static'))


@app.route('/')
def index():
    if app.config['debug']:
        return bottle.redirect('/debug/index.html')
    return bottle.redirect('/dist/index.html')


@app.get('/uuids')
def uuids():
    for uuid in db:
        db[uuid].update(netstat(db[uuid]['port']))
    return {
        'success': True,
        'db': db,
        }


@app.get('/uuid/<uuid>')
def check(uuid):
    global port_counter
    if uuid not in db:
        db[uuid] = {
            'uuid': uuid,
            'port': port_counter,
            'active': False,
            'listen': False,
            'established': [],
            'data': '',
            'message': '',
            }
        port_counter += 1
    db[uuid]['name'] = bottle.request.query.get('name')
    if 'message' in bottle.request.query:
        db[uuid]['message'] = bottle.request.query.get('message')
    db[uuid]['time'] = int(time.time())
    db[uuid].update(netstat(db[uuid]['port']))
    d = db[uuid].copy()
    if 'message' not in bottle.request.query:
        db[uuid]['data'] = ''
    return d


@app.post('/bulk_delete')
def bulk_delete():
    for uuid in bottle.request.json:
        if uuid in db:
            del db[uuid]
    return {
        'success': True
        }


@app.post('/bulk_update_data')
def bulk_update_data():
    for uuid, data in bottle.request.json.iteritems():
        if uuid in db:
            db[uuid]['data'] = data
    return {
        'success': True
        }


@app.post('/uuid/<uuid>')
def update(uuid):
    if uuid not in db:
        raise bottle.HTTPError(status=404)
    db[uuid].update(netstat(db[uuid]['port']))
    db[uuid]['active'] = bottle.request.json['active'] is True
    if not db[uuid]['active']:
        terminate(uuid)
    return db[uuid]


@app.get('/uuid/<uuid>/terminate')
def terminate(uuid):
    if uuid not in db:
        raise bottle.HTTPError(status=404)
    db[uuid].update(netstat(db[uuid]['port']))
    pid = db[uuid]['listen']
    if pid:
        psutil.Process(pid).terminate()
    db[uuid].update(netstat(db[uuid]['port']))
    return db[uuid]


def run():
    global port_counter
    if len(sys.argv) > 1:
        for cfg in sys.argv[1:]:
            app.config.load_config(cfg)
    port_counter = app.config['rsm.port-start']
    if app.config['debug']:
        log.setLevel(logging.DEBUG)
        bottle.debug(True)
    app.run(
        server=app.config['server'],
        host=app.config['host'],
        port=app.config['port'],
        reloader=app.config['debug'],
        )


if __name__ == '__main__':
    app.config['debug'] = True
    run()
