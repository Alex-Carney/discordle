# DISKORDLE: Discord-Bot-Driven Wordle Battle Royale 


A few months ago, _Wordle_ took the internet by storm.

As part of my DALI lab application, I decided to build my own riff on the game, using the [Discord API](https://discord.com/developers/docs/intro) and a [Dictionary API](https://dictionaryapi.dev/)

## Overview

For a rundown of the rules of the vanilla Wordle game, check out the website [here](https://www.nytimes.com/games/wordle/index.html) 

Diskordle works very similarly to Wordle - There is a hidden word that players must guess in 6 or less attempts. Information is granted to 
the player after each guess in the form of coloring the input word based on the accuracy of the letters contained

Diskordle implements this gameplay with a twist: Players join a lobby with their friends and begin a new game all at once. 
**Instead of trying to guess a random word, each player submits a valid 5 letter word that another player will have to guess**

Think of it sort of like secret santa but with words - You submit a word that someone else will guess, and receive a word yourself that someone
else submitted. Don't worry, you'll never have to guess your own word (unless you and another person think _very_ alike)

Check out the video demo [here](https://youtu.be/7OeIY9VDUSg)

## Gameplay Instructions 

Once the bot has been successfully installed in your server (see installation guide) (or you have joined a server that has the bot ready),
start a new game with `/newgame`

![new game image](./readme%20assets/join_game.png "Bot message displayed when starting a game")

After all players have joined the lobby, the host can start the game by pressing **start game** (only the host can do this)

For every player in the lobby, a new thread under the current channel will be created. Navigate to the thread with your name 
and click '1 Message' to open the thread in split screen. Or go to 'all threads' to open up the thread in full screen

![thread create image](./readme%20assets/game_started.png "Bot creates a thread for every player")

Once each player has found their private thread, everyone uses the `/w [word]` command to interact with the game. To start,
each player submits a target word for another player by using the command. 

Once every player has submitted a target word, those targets get distributed randomly 

The game is on! Each player is pursuing individual target words, so it's ok to peek at other threads and ~~laugh at~~ encourage fellow players if 
you're ahead. 

Each time you want to guess a word, use the `/w [word]` command. Your game board will be updated accordingly 

With my bot, BLUE letters aren't in the final word, RED letters are in the final word but in the wrong spot, and GREEN letters 
are in the correct place. Colors can be configured, but may require some creativity due to the 50 emoji slot limit for basic servers (see the FAQ)

![wordle gameboard](./readme%20assets/starting_guess.png "A good starting guess!")

Once every player finishes, the host can click the END GAME button in the **main channel** to end the game, delete all threads, and display
the final results. 

Here is an example game from a 1v1 I had with a friend! (we both made some suboptimal guesses -- oops!)

![wordle final board](./readme%20assets/game_results.png "The end of a game")

By the way, if you're in the middle of the game and are having trouble remembering what letters you've already used, just use the
`/k` command. This pulls up a 'keyboard' render that shows what letters you should use in your next guess

## FAQ

- How do the emojis work? Why is red the color for yellow letters in Wordle

Dealing with emojis was definitely one of the hardest parts of this project. Unicode (and therefore Discord by default) has support
for all the _regional_indictator_ emojis (the blue background, white letter ones). I downloaded the SVG files for all letters,
then wrote a python script to create new SVGs with different background colors.

The problem is, a basic discord server only has 50 custom emoji slots. 26 letters in green + 26 letters in yellow = 52. Luckily,
Unicode has emojis for 🅰️ and 🅱️ (apparently because of those blood types?). Using these, I would only need 24 emojis to handle 'yellow letters' in 
Wordle. This worked out though, since 26 green + 24 red = 50 exactly.  

Included in the github project is the `deploy-emojis.js` script, which automatically adds SVG emojis from the `assets` directory 
to your server! (WARNING: I got rate limited when I did this by Discord, so you may have to do this in multiple batches)

- What's with the K? Discordle sounds better 

I agree. I wanted to call the bot Discordle, but for some reason Discord does not allow bots to contain the word "Discord". So,
my options were Dyscordle, Disc0rdle, Discord1e, etc... so I just went Diskordle
