Reverse-ssh-manager
==================

Reverse-ssh-manager is an application to manage reverse ssh connections through a web
interface.

It provides a Dockerfile to easily run Reverse-ssh-manager in a Docker
container.

Docker
------

Run inside a Docker container
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The command below will pull the image from the Docker Hub if it's not already downloaded
and run `Reverse-ssh-manager` in a Docker container named `rsm`.
::

        docker run --name rsm \
        -v authorized_keys:/config/authorized_keys:ro \
        -p 22:22 -p 8888:8888 \
        --cap-add SYS_PTRACE \
        bbinet/reverse-ssh-manager 
 

``authorized_keys`` file from current directory will be used to
allow some users to create SSH tunnels using their public SSH key.

``--cap-add SYS_PTRACE`` will allow to get pids of running SSH connections.


Build
~~~~~

You can also build a Docker image from scratch. First, clone this repository
``cd`` to its contents and run::

    docker build -t bbinet/reverse-ssh-manager .

To push image to public registry::

    docker push bbinet/rsm



Manual installation
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



Run
~~~

Run the reverse-ssh-manager server by running the following command::

    (reverse-ssh-manager) $ reverse-ssh-manager path/to/config.cfg

Then visit http://localhost:8888/, it should display a web interface to manage
reverse SSH tunnels.


Configuration
---------

Create a configuration file that looks like::

    $ cat path/to/config.cfg

    [bottle]
    host = 0.0.0.0
    port = 8080
    server = cherrypy
    debug = true

Note that the `[bottle]` section is optional, the defaults are::

    [bottle]
    host = localhost
    port = 8888
    server = wsgiref
    debug = false


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


