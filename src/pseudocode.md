# Pseudocode

## To Do

- styling on room list and chat room
- room list
  - different sorting options for the list
  - some info about each room
    - total number of messages
    - most recent message timestamp
    - room description/topic
  - functionality for creating new rooms

## MVP

- authentication ✅
- send messages ✅
- display name for each user ✅
- add photo for each user ✅
- chat room ✅
- back buttons ✅

## Stretch goals:

- send files?
- direct messages
- create new chat rooms
- update different picture
- group messages by timestamp period
- put google auth into own site instead of redirect
- change display name
- change theme colors
- lazy load only new items

## Views

- start on login page
- logged in and choosing chat room
- in a chat room

### Login

- google auth

### Choosing Chat Room

- pick a chat room from a list

### Chat Room

- single component
- sub-components
- database:
  - key
  - room name

### Database Structure

- Rooms

  - room key
    - room name
    - room description

- Messages
  - message key
    - room key
    - sent by (user ID)
    - message content
    - timestamp
