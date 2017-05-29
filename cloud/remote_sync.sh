#!/bin/bash
#
# ============================
# REMOTE SYNC
# ============================
# Copyright (c) Kyle Derby MacInnis

declare cname="remote_sync.sh"
declare cver="0.2.1"
declare cdesc="Synchronizes files between directories in both directions. It can be used to pull and push changes. *Is is recursive*"

# Read in Commandline
for arg in "$@"; do
  case $arg in
    # Local User
    -lu=* | --local-user=* )
    declare auth=true;
    declare lauth="${arg#*=}";
    ;;
    # Remote User
    -ru=* | --remote-user=* )
    declare auth=true;
    declare rauth="${arg#*=}";
    ;;
    # Local Host
    -lh=* | --local-host=* )
    declare auth=true;
    declare lhost="${arg#*=}";
    ;;
    # Remote host
    -rh=* | --remote-host=* )
    declare auth=true;
    declare rhost="${arg#*=}";
    ;;
    # Local Directory
    -l=* | --local=* )
    declare local_dir="${arg#*=}";
    ;;
    # Remote Directory
    -r=* | --remote=* )
    declare remote_dir="${arg#*=}";
    ;;
    # send (Local Pushed)
    -s | --send )
    declare send=true;
    ;;
    # pull (Local pulled)
    -p | --pull )
    declare pull=true;
    ;;
    # help Documentation
    -h | --help )
    declare help=true
    ;;
    # Non-Stop
    -Z | --non-stop )
    declare nstop=true
    ;;
  esac
done

# help Documentation
if [ ${help} ]; then
  echo -e "Usage: ${cname}\t\t(v.${cver})\n\n\t \
    -h\t\t| --help \t\t\t: Shows this Documentation.\n\t \
    -lh\t| --local-host=<...> \t\t: Local Host Network Address\n\t \
    -rh\t| --remote-host=<...> \t\t: Remote Host Network Address\n\t \
    -lu\t| --local-user=<...> \t\t: Local Username\n\t \
    -ru\t| --remote-user=<...> \t\t: Remote Username\n\t \
    -l\t\t| --local=<...> \t\t: Sets the Local Directory\n\t \
    -r\t\t| --remote=<...> \t\t: Sets the Remote Directory\n\t \
    -s\t\t| --send \t\t\t: sends the data from Local->Remote\n\t \
    -p\t\t| --pull \t\t\t: pulls the data from Remote->Local\n\t \
    -Z\t\t| --non-stop \t\t\t: Non-Stop mode - No Prompts\n"
  exit
fi

# send Setup
if [ ${send} ]; then
  echo -e "sending Data from Local --> Remote\n\t\
  LOCAL: ${local_dir}\n\t\
  REMOTE: ${remote_dir}\n"
  if [ ${auth} ]; then
    echo -e "\tR-auth: ${rauth}@${rhost}\n\t"
  fi
  if [ ${auth} ]; then
	   declare cmd="${local_dir}/* ${rauth}@${rhost}${remote_dir}";
  else
	   declare cmd="${local_dir}/* ${remote_dir}";
  fi
  if ! [ ${nstop} ]; then
    read -p "continue? (y/n):" cont;
  fi
fi

# pull Setup
if [ ${pull} ]; then
  echo -e "pulling Data from Remote --> Local\n\tLOCAL: ${local_dir}\n\tREMOTE: ${remote_dir}\n";
  if [ ${auth} ]; then
    echo -e "\tR-auth: ${rauth}@${rhost}\n\t"
  fi
  if [ ${auth} ]; then
    declare cmd="${rauth}@${rhost}${remote_dir}/* ${local_dir}";
  else
    declare cmd="${remote_dir}/* ${local_dir}";
  fi
  if ! [ ${nstop} ]; then
    read -p "continue? (y/n):" cont;
  fi
fi

# Synchronize
if [ "${cont}" = "y" ] || [ ${nstop} ]; then
  echo -e "Performing requested actions. Please be patient - this may take a while.\n ${cmd}";
  # Do All Synchronization Here
  rsync -r ${cmd}
  #
else
  # Aborted
  echo -e "Actions Aborted.\n";
  exit;
fi