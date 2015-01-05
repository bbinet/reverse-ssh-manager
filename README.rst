Reverse-ssh-server
==================

Reverse-ssh-server allows to manage reverse ssh connections through a web
application.

It also provide a Dockerfile to easily run Reverse-ssh-server in a docker
container.


Install
-------

You can install `reverse-ssh-manager` in a virtualenv (with `virtualenvwrapper`
and `pip`)::

    $ mkvirtualenv reverse-ssh-manager
    (reverse-ssh-manager) $ pip install reverse-ssh-manager

Or if you want to contribute some patches to `reverse-ssh-manager`::

    $ git clone git@github.com:bbinet/reverse-ssh-manager.git
    $ cd reverse-ssh-manager/
    $ mkvirtualenv reverse-ssh-manager
    (reverse-ssh-manager) $ python setup.py develop

Then, do the following steps::

    (reverse-ssh-manager) $ pip install nodeenv
    (reverse-ssh-manager) $ nodeenv -p
    (reverse-ssh-manager) $ npm install -g bower gulp
    (reverse-ssh-manager) $ npm install
    (reverse-ssh-manager) $ bower install
    (reverse-ssh-manager) $ gulp


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

Run the reverse-ssh-manager server by running the following command::

    (reverse-ssh-manager) $ reverse-ssh-manager path/to/config.cfg

Then visit http://localhost:8888/, it should display a web interface to manage
reverse ssh tunnels.


Release
-------

To make a new release, do the following steps::

    (reverse-ssh-manager) $ npm install
    (reverse-ssh-manager) $ bower install
    (reverse-ssh-manager) $ gulp
    (reverse-ssh-manager) $ deactivate
    $ vi setup.py  # bump version
    $ git add setup.py
    $ git commit -m "bump version to X.X.X"
    $ git dch -s <commit_hash_from_last_release>
    $ vi debian/changelog  # edit changelog
    $ git add debian/changelog
    $ git ci -m "update debian changelog to version X.X.X+hl~1"
    $ ../pdebuild.sh build reverse-ssh-manager

If debian package was correctly generated, you can create a tag in git, and
push the debian package to reprepro with dput::

    $ git tag vX.X.X
    $ git push --tags
    $ dput kimsufi /home/bruno/dev/build/reverse-ssh-manager/amd64/reverse-ssh-manager_X.X.X+hl~1_amd64.changes


Docker
------

Build
~~~~~

To create the image `bbinet/rss`, execute the following command::

    docker build -t bbinet/rss .

You can now push the new image to the public registry::

    docker push bbinet/rss

Run
~~~

Then, when starting your rss container, you will want to bind ports `22` and
`8888` from the rss container to a host external port.

You also need to provide a read-only `authorized_keys` file that will be use to
allow some users to create ssh tunnels using their public ssh key.

For example:

    $ docker pull bbinet/rss

    $ docker run --name rss \
        -v authorized_keys:/config/authorized_keys:ro \
        -p 22:22 \
        bbinet/rss
