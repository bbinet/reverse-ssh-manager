FROM debian:wheezy

MAINTAINER Bruno Binet <bruno.binet@helioslite.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -yq --no-install-recommends \
    openssh-server python-pip build-essential python-dev libzmq1 libzmq-dev \
    libxml2-dev libxslt1-dev curl git \
  && rm -rf /var/lib/apt/lists/*

RUN pip install circus chaussette waitress==0.9.0 nodeenv psutil>=2.2.1

RUN adduser --system --shell /bin/sh --no-create-home rsm --uid 500

RUN mkdir /var/run/sshd /var/log/circus

RUN nodeenv --prebuilt /env
ENV PATH /env/bin:${PATH}
RUN npm install -g bower gulp

ADD . /rsm
WORKDIR /rsm
RUN npm install
RUN bower --allow-root install
RUN gulp
RUN pip install .

# sshd, reverse-ssh-manager
EXPOSE 22 8888

CMD ["/usr/local/bin/circusd", "/rsm/docker/circus/circusd.ini"]
