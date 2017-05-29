#!/bin/bash
#
# ============================
# ACCESS KEY SETUP
# ============================
# Copyright (c) Kyle Derby MacInnis


# Read in Commandline
for arg in "$@"; do
  case $arg in
    # Key File Location
    -k=* | --key=* )
    declare key=true
    declare key_loc"${arg#*=}"
    ;;
    # help Documentation
    -h | --help )
    declare help=true
    ;;
    # Non-Stop
    -n | --new )
    declare new=true
    ;;
  esac
done

# Help Message
if [ ${help} ]; then
    echo -e "Usage: ${cname}\t\t(v.${cver})\n\n\t \
        \t\t-h | --help :\t\t\tDisplay this help message\n \
        \t\t-k | --key=<..> :\t\tKey File Location \
        \t\t-n | --new :\t\tGenerate a new key file"
    exit
fi

# PROMPT for Access Keys
if [ ${key} ]; then
    echo -e "\n\t\NO KEY FILE PROVIDED\n"
    read -p "please enter the location of your key file:" key_loc
fi
