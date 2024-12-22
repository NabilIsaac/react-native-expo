#!/bin/bash

# Kill any existing Metro bundler processes
pkill -f "metro"
pkill -f "expo"

# Clear Metro bundler cache
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/haste-* 2>/dev/null

# Start Expo with a specific port
npx expo start --clear --port 8088
