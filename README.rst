Reverse-ssh-manager
==================

Reverse-ssh-manager allows to manage reverse ssh connections through a web
application.

It also provide a Dockerfile to easily run Reverse-ssh-manager in a docker
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
    (reverse-ssh-manager) $ nodeenv -p --prebuilt
    (reverse-ssh-manager) $ npm install -g bower gulp
    (reverse-ssh-manager) $ npm install
    (reverse-ssh-manager) $ bower install
    (reverse-ssh-manager) $ gulp


Configure
---------

Create a configuration file that looks like::

    $ cat path/to/config.cfg

    [bottle]
    host = 0.0.0.0
    port = 8080
    debug = true

Note that the `[bottle]` section is optional, the defaults are::

    [bottle]
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
    $ git tag vX.X.X
    $ python setup.py sdist bdist_wheel upload
    $ git push --tags


Docker
------

Build
~~~~~

To create the image `bbinet/rsm`, execute the following command::

    docker build -t bbinet/rsm .

You can now push the new image to the public registry::

    docker push bbinet/rsm

Run
~~~

Then, when starting your rsm container, you will want to bind ports `22` and
`80` from the rsm container to a host external port.

You also need to provide a read-only `authorized_keys` file that will be use to
allow some users to create ssh tunnels using their public ssh key.

Note that psutil won't be able to get pids of running ssh connection unless you
specify option `--cap-add SYS_PTRACE` with docker run.

For example:

    $ docker pull bbinet/rsm

    $ docker run --name rsm \
        -v authorized_keys:/config/authorized_keys:ro \
        -p 22:22 \
        --cap-add SYS_PTRACE \
        bbinet/rsm
