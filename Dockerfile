FROM debian:stretch

MAINTAINER Bruno Binet <bruno.binet@helioslite.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -yq --no-install-recommends \
    curl openssh-server python python-pip python-setuptools python-wheel gcc python-dev linux-libc-dev \
  && rm -rf /var/lib/apt/lists/*

# https://github.com/giampaolo/psutil/issues/824
# Once psutils supports wheels on Linux, install will be:
#RUN apt-get update && apt-get install -yq --no-install-recommends \
#    curl openssh-server python \
#  && rm -rf /var/lib/apt/lists/*
#RUN curl https://bootstrap.pypa.io/get-pip.py | python

RUN pip install dumb-init reverse-ssh-manager

RUN adduser --system --shell /bin/sh rsm --uid 1000

RUN mkdir -p /var/run/sshd
ADD docker /rsm

# sshd, reverse-ssh-manager
EXPOSE 22 80

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

ENV HOST_KEY /etc/ssh/ssh_host_rsa_key
ENV AUTHORIZED_KEYS_FILE /etc/ssh/authorized_keys

CMD ["bash", "-c", "/usr/sbin/sshd -f /rsm/sshd_config -h $HOST_KEY -o AuthorizedKeysFile=$AUTHORIZED_KEYS_FILE && exec reverse-ssh-manager /rsm/prod.cfg"]
