#!/bin/bash

set -e # die on non-0 exit code

apt-get update
apt-get install --assume-yes git pigpio

curl --fail https://nodejs.org/dist/v8.5.0/node-v8.5.0-linux-armv7l.tar.xz > /tmp/node-v8.5.0-linux-armv7l.tar.xz
cd /tmp
tar xf node-v8.5.0-linux-armv7l.tar.xz
mv node-v8.5.0-linux-armv7l /opt/node

echo $'\nexport PATH=/opt/node/bin:$PATH' >> /home/pi/.bashrc
sed -e 's|secure_path="|secure_path="/opt/node/bin:|' /etc/sudoers

su pi -c "mkdir /home/pi/Projects/"
pushd /home/pi/Projects
su pi -c "git clone https://github.com/sqrtofsaturn/t1"
pushd /home/pi/Projects/t1
su pi -c "/opt/node/bin/npm install"
