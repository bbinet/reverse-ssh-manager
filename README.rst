Reverse-ssh-server
==================

Reverse-ssh-server allows to manage reverse ssh connections through a web
application.

It also provide a Dockerfile to easily run Reverse-ssh-server in a docker
container.

Install
-------

You can install `reverse-ssh-server` in a virtualenv (with `virtualenvwrapper`
and `pip`)::

    $ mkvirtualenv reverse-ssh-server
    (reverse-ssh-server) $ pip install reverse-ssh-server

Or if you want to contribute some patches to `reverse-ssh-server`::

    $ git clone git@github.com:bbinet/reverse-ssh-server.git
    $ cd reverse-ssh-server/
    $ mkvirtualenv reverse-ssh-server
    (reverse-ssh-server) $ python setup.py develop

Configure
---------

Create a configuration file that looks like::

    $ cat path/to/config.cfg

    [server]
    host = 0.0.0.0
    port = 8080
    server = cherrypy
    debug = true

Note that the `[server]` section is optional, the defaults are::

    [server]
    host = localhost
    port = 8888
    server = wsgiref
    debug = false

Run
---

Run the reverse-ssh-server server by running the following command::

    (reverse-ssh-server) $ reverse-ssh-server path/to/config.cfg

Then visit http://localhost:8888/, it should display a web interface to manage
reverse ssh tunnels.

Release
-------

To make a new release, do the following steps::

    $ vi setup.py  # bump version
    $ git add setup.py
    $ git commit -m "bump version to X.X.X"
    $ git tag vX.X.X
    $ git push --tags
    $ python setup.py sdist upload
