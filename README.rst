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

Then, do the following steps::

    (reverse-ssh-server) $ pip install nodeenv
    (reverse-ssh-server) $ nodeenv -p
    (reverse-ssh-server) $ npm install -g bower gulp
    (reverse-ssh-server) $ npm install
    (reverse-ssh-server) $ bower install
    (reverse-ssh-server) $ gulp


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

    (reverse-ssh-server) $ npm install
    (reverse-ssh-server) $ bower install
    (reverse-ssh-server) $ gulp
    (reverse-ssh-server) $ deactivate
    $ vi setup.py  # bump version
    $ git add setup.py
    $ git commit -m "bump version to X.X.X"
    $ git dch -s <commit_hash_from_last_release>
    $ vi debian/changelog  # edit changelog
    $ git add debian/changelog
    $ git ci -m "update debian changelog to version X.X.X+hl~1"
    $ ../pdebuild.sh build reverse-ssh-server

If debian package was correctly generated, you can create a tag in git, and
push the debian package to reprepro with dput::

    $ git tag vX.X.X
    $ git push --tags
    $ dput kimsufi /home/bruno/dev/build/reverse-ssh-server/amd64/reverse-ssh-server_X.X.X+hl~1_amd64.changes
