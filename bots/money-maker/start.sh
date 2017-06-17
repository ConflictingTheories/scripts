#!/bin/bash

source *.env;
nohup node money-maker.js 1>> money.output 2>>money.error &
