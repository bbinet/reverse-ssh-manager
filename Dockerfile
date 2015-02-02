FROM debian:wheezy

MAINTAINER Bruno Binet <bruno.binet@helioslite.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -yq --no-install-recommends \
  openssh-server python-pip build-essential python-dev libzmq1 libzmq-dev \
  libxml2-dev libxslt1-dev curl git

RUN pip install circus chaussette waitress nodeenv psutil>=2.2.1

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

RUN apt-get purge -yq build-essential python-dev libzmq-dev libxml2-dev \
  libxslt1-dev git && apt-get autoremove -yq && apt-get clean all \
  && rm -fr /env

# sshd, reverse-ssh-manager
EXPOSE 22 8888

CMD ["/usr/local/bin/circusd", "/rsm/docker/circus/circusd.ini"]
