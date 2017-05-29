#!/bin/bash
#
# =======================
#   CENTOS 7 Launch Script
# ========================
# copyright (c) Kyle Derby MacInnis
#

# EPEL
yum install -y epel-release curl wget nmap nc nano links htop nohup screen binutils "development tools"

# Dev Tools
yum group install -y "Development Tools"

# Update
yum update -y

# NGINX RELEASE
rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
yum install -y nginx

# WORDPRESS
yum install -y httpd mariadb wordpress

# Message
echo -e "\nINSTALLED: Wordpress, NginX, Apache, MySQL, Dev-Tools and Utils " >> /etc/motd


