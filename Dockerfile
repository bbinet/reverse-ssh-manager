FROM debian:wheezy

MAINTAINER Bruno Binet <bruno.binet@helioslite.com>

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
  openssh-server python-pip build-essential python-dev libzmq-dev

# psutil==1.2.1 ?
RUN pip install circus chaussette waitress

RUN adduser --system --shell /bin/sh --no-create-home autossh --uid 500

RUN mkdir /var/run/sshd /var/log/circus

ADD . /rsm
RUN pip install /rsm

# sshd, reverse-ssh-manager
EXPOSE 22 8888

CMD ["/usr/local/bin/circusd", "/rsm/docker/circus/circusd.ini"]
