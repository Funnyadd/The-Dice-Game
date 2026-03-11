# The Dice Game

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

### Build the application

```bash
npm run build
```

### Lint the code with eslint

```bash
npm run lint
```

### Format the code with prettier

```bash
npm run format
```

###

## ROADMAP
Code works from what I tested. Probably need to do some more testing

### v0.1 - Game engine
- [x] Look at the code again to see if it's coherent and could maybe be upgraded / optimized
- [x] Separate this into components (at least a component for the tiles)
- [x] Look into adding prettier with basic rules to the repo
- [x] Add basic instructions to install and start the app in the **Getting Started** section of the README
- [x] Add a **LICENSE** file

### v0.2 - Board Styling
- [ ] Box needs to be all wood or at least look like that.
- [ ] Make a 2D version looking like 3D but no treeJS or anything fancy like that
- [ ] Tiles should be animated with maybe slight colour changed on currently selected tiles before locking in the round
- [ ] Tiles that are disabled should not be clickable or should show some sort of animation on screen to let the player know that they are not available with the current dice roll

### v0.3 - Dice animation
- [ ] Actual dice: simple dice (2 of them of course) that spin in the middle of the board or something fancier if possible and not too complicated.

### v0.4 - Device compatibility & Resizability of app
- [ ] Make sure the app is playable on multiple mobile device out there mainly with the desktop version looking similar to the mobile version
  since the app is mainly made for phones. Could look into an ipad/tablet mode also
- [ ] Make the app a PWA officially and make it offline playable
- [ ] Add a manifest, different sizes of icons and all the stuff that the browser likes
- [ ] Also make it easily indexable by google, for fun
- [ ] Add the game title somewhere (Still have to see if necessary)

### v0.5 - New modes & Menus
- [ ] Separate game mode for people who want to use their own dice
  - [ ] Add some sort of button or mode selector with the default one being the one with in-game dice
  - [ ] Could have a button to calculate total
  - [ ] Could have selections that we lock in with another button (see if thats fun to play with)
  - [ ] And of course, a reset button to reset the board
- [ ] Make it possible to change the number of tiles on the board (default is 12 and should be between 9 and 12)
- [ ] Start menu
  - [ ] Page for instructions?
  - [ ] Page for preference that wold be stored in local storage?

### v1.0 - Making sure everything works properly for official release
- [ ] Add unit tests with vitest
- [ ] Add a CI pipeline that runs the linter check, prettier check, builds the app and runs the tests
- [ ] Add Release, test coverage and CI pipeline badges in README

### v1.1 - Concept of games and rounds
- [ ] The concept of a game where you enter the names of players, numbers of rounds and the app does everything for you.

  Even tells you who lost, who won (probably just put the players in order with the loser emphasized as he usually pays the round of drinks)

### v1.2 - Names on the box
- [ ] Connect to a database where when the current device is connected to the internet to add name of winners on the box
  - [ ] Should actually prompt user with text box that has maximum number of characters where the user can input what they want.
  - [ ] Make sure there is sanitization on that field since it will go in the DB.
  - [ ] Will have to create somne kind of algorithm that places the names randomly on the board or let users put the works where they want with some kind of 3D view of the box

**...**

### v2 - 3D
- [ ] Make the box 3D with engines like threeJS ??
- [ ] Make the box movable (like possible to look at it from different angles to view all the names)
- [ ] Thrown dice on the board, probably possible with threeJS implementation

**And for now, that's pretty much what I have in mind at the moment, feature-wise :).**
