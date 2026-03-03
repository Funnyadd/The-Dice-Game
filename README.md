# The Dice Game

## ROADMAP
Code works from what I tested. Probably need to do some more testing

### Beta (game engine)
- [ ] Look at the code again to see if it's coherent and could maybe be upgraded / optimized
- [ ] Separate this into components (at least a component for the tiles and maybe another one for actual alerts)
- [ ] Look into adding prettier with basic rules to the repo

### v1 (to re-evaluate what can be v1 and what could be v1.1, v1.2, ...)
- [ ] Separate game mode for people who want to use thei own dice
  - [ ] Could have a button to calculate total
  - [ ] Could have selections that we lock in with another button (see if thats fun to play with)
  - [ ] And of course, a reset button to reset the board

- [ ] Actually style the app correctly with the square button + box on felt vibe \
  - [ ] Box needs to be all wood and have a wood texture.
  - [ ] If possible, make the box 3D (probably need to look into treeJs or some kind of 3D web rendering to make it realistic) \
    -> Or start with 2D version and make it 3D in a v2 if it looks way too complicated
  - [ ] Tiles should be animated with maybe slight colour changed on currently selected tiles before locking in the round
  - [ ] Tiles that are disabled should not be clickable or should show some sort of animation on screen to let the player know that they are not available with the current dice roll
  - [ ] ANIMATED DICE!!! (would be cool if they could be thrown in the box at random angles to give the real look and feel of the real game)
  - [ ] Make sure the app is playable on multiple mobile device out there mainly with the desktop version looking similar to the mobile version
    since the app is mainly made for phones. Could look into an ipad/tablet mode also
  - Add the game title somewhere

- [ ] Start menu

- [ ] The concept of a game where you enter the names of players, numbers of rounds and the app does everything for you. \
  Even tells you who lost, who won (probably just put the players in order with the loser emphasized as he usually pays the round of drinks)

- [ ] Make the app a PWA officially and make it offline playable

- [ ] Connect to a database where when the current device is connected to the internet to add name of winners on the box \
  Should actually prompt user with text box that has maximum number of characters where the user can input what they want \
  Make sure there is sanitization on that field since it will go in the DB.

  Will have to create somne kind of algorithm that places the names randomly on the board or let users put the works where they want \
  with some kind of 3D view of the box
