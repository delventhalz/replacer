# Replacer.js
A basic Node.js tool designed for persistent finding and replacing based on misspellings. Originally designed to handle the common prevelance of u's and v's, and j's and i's being swapped in Shakespeare's First Folio. Will search through one or more text files and present the user with misspelled words, alternatively narrowed down by words that contain user flagged shortcuts such as 'u', 'v', 'j', and 'i' *(NOTE: 0.1 is currently hard-coded to use u, v, j, and i, customizable flags will be implemented soon). The user will be prompted to type in replacements for all flagged misspelled words. Replacer.js will remember all changes and all ignored words and automatically apply those for future processed text files.

### Installing
Replacer.js requires Node.js and npm in order to run, so make sure you [install those first](https://docs.npmjs.com/getting-started/installing-node). In addition this tool uses two libraries which should be installed with npm, [readline-sync](https://github.com/anseki/readline-sync) and [spellchecker](https://github.com/atom/node-spellchecker). From the root directory of the repo, type into the command line: 
```
npm install
```
Once the most recent versions of readline-sync and spellchecker are installed, Replacer.js will be ready to use.

### Usage
From within the directory for this repo type the command: 
```
node replacer
```
This will run the replacer with the default target, `target.txt` located in the replacer root directory, and the `ignore.json` and `cipher.json` files located in the default `words` directory.

You may specify different target files in the command line as arguments to the replacer command. For example:
```
node replacer macbeth.txt /tempest/act1.md
```
This will run the replacer on `alternate.txt` and `/files/this.md`.

You may specify a different directory for `cipher.json` and `ignore.json` by using the `@` character. For example:
```
node replacer @ff
```
This will use `ignore.json` and `cipher.json` files stored in the `/ff` directory. *(NOTE: 0.1 does not currently support this @ argument, and will always use /words)*

You can mix and match these arguments however you like: 
```
node replacer hamlet.md @ff /midsummer/act5.txt
```

### Custom Shortcuts
*(NOTE: In 0.1, shortcut functionality is hard-wired for u, v, i, j)*
Shortcuts are key to Replacer.js usage and can greatly speed up text processing. They serve a dual purpose. Shortcut keys make a watchlist, causing Replacer to only prompt the user for misspelled words that contain items on the watchlist, greatly reducing number of prompts. Additionally, after a user is prompted, they are able to type in just the value of the shortcut to switch all appropriate values.

For example, with shortcuts object of:

```
{
  "v": "u",
  "u": "v"
}
```

And text of: 
```
I'ue vpturned vs!
```

With these prompts and responses:
```
I'ue? v
vpturned? u
```

Will change the text to:
```
I've upturned vs!
```

Notice that to use a shortcut you type in the letter you wish targeted letters to *become*. Notice also, that in the case of `vpturned`, using the shortcut `u` affected only the v's in the word, and *not* the u's. Finally, notice that `vs` is in the American English Dictionary, and so is ignored. In order to change `vs` to `us`, manually add `"vs": "us"` to the appropriate `cipher.json` file, as those pairs will be swapped regardless of spelling.

In order to customize your shortcuts, simply modify the `shortcuts.json` file in same folder as the cipher and ignore files you are using. For example, adding a key value combo of `"i": "j"` will watch for misspelled words with an 'i', and when the user types `j` at a prompt will replace all of the i's in that word with a 'j'.

### Default Shortcuts
* If the user simply presses enter, without inputting any text, the word will be unchanged, and added to the ignore list.
* If the user inputs a backtick `\``, the word will be skipped, but not permenantly added to the ignore list (useful for words that are unclear). *(NOTE: Not enabled in 0.1)*
* If the user inputs an asterisk `*`, and custom defaults have been set, then every replace specified by those shortcuts will be executed.

### Using the included First Folio dictionaries
The default cipher and ignore files included in this repo are designed to switch u's, v's, j's, and i's in Shakespeare's First Folio. If that is your purpose in downloading Replacer.js, then it is fairly inconsequential to run.
1. Copy your chosen First Folio text. I prefer the formatting on the [University of Chicago's site](http://www.lib.uchicago.edu/efts/OTA-SHK/restricted/search.form.html).
2. Paste the text into `target.txt` or another text file you plan on using.
3. Run Replacer.js on your files.
4. Respond to user prompts as needed.

*(NOTE: Current cipher and ignore files are incomplete, and contain known issues)*

### Bugs and Typos
If you notice any bugs in the code, or typos in the included First Folio cipher and ignore files, please send as detailed a report as you can (including text being used) to [delventhalz@gmail.com](mailto:delventhalz@gmail.com?subject=Replacer%20Bug%20Report).