![Logo](mw/icon.png)

[![Build Status](https://github.com/JerichoFletcher/mechanical-warfare/workflows/Java%20CI/badge.svg)](https://github.com/JerichoFletcher/mechanical-warfare/actions)
[![Discord](https://img.shields.io/discord/715164441137643521.svg)](https://discord.gg/K3uzNSD)

# Mechanical Warfare
Mechanical Warfare is a 6.0 Mindustry mod written in [`.java`](https://www.java.com/en) mainly adding new units and turrets. Not for the faintest of engines.

### Features:
- New items and liquids (with the respective crafters)
- Powerful units, ships, and mechs divided in [4 classes](UNITCLASSES.md)
- New turrets as a mean of defense against the new enemies
- More challenging campaign zones with new environment tiles

## Contributing
Before you begin, you _must_ have all of these:
- [Git](https://git-scm.com/downloads)
- [JDK 14](https://adoptopenjdk.net/)

### Rules
Here's the important contributing rule:
1. Please follow the file formatting used in other files; for example:
    1. No spaces around parenthesis
    2. `camelCase` for _every_ fields _and_ constants. `SCREAMING_CASE` is hard to read and annoying to type
    3. No need for unnecessary getter / setters
2. If you want to create sprites, here's some rules you _should_ obey:
    1. Always put your sprites in `mw/assets-raw/sprites/`, nowhere else
    2. Use a non-index based image editor _(aka not paint.net)_ to make antialiasing process work properly. It's recommended to use Adobe Photoshop or Aseprite
3. You should be fluent in `git`:
    1. To track the files you've added / changed, do:
    ```sh
    $ git add .
    ```
    2. To commit, do:
    ```sh
    $ git commit -m "[commit title here, without these square brackets]"
    ```
    3. To push the commit to GitHub, do:
    ```sh
    $ git push
    ```
    4. You can learn more by googling it
4. If you want to create a big changes _(like creating a new subproject or new classes)_, please discuss it first on [discord](https://discord.gg/K3uzNSD)

### Building
You can either let GitHub Actions handle this or _manually_ build the `.jar` file to actually use it to play / test. <br>

To manually build the `.jar` file that you're going to use, `cd` to the project directory and run the following commands:

#### Windows
```sh
$ gradlew.bat tools:processSprites
$ gradlew.bat mw:jar
```

#### Linux/MacOS
```sh
$ ./gradlew.bat tools:processSprites
$ ./gradlew.bat mw:jar
```

#### Android
1. Install the Android SDK [here](https://developer.android.com/studio#downloads). Just down load the "Command line tools only", as Android Studio is not required.
2. Unzip the Android SDK directory, and set `ANDROID_HOME` environment variable to point to the unzipped SDK directory
3. Run `gradlew.bat tools:processSprites` then `gradlew.bat mw:deploy` (or `./gradlew` if on Linux/Mac). If you did all of these correctly ~which I didn't~, there should be the built `.jar` file in the output directory that works for both desktop and android.

##### Troubleshooting
If the terminal returns `Permission denied` or `Command not found` on Mac/Linux, run `chmod +x ./gradlew` before running `./gradlew`. _This is a one-time procedure._

---

The output directory of your built `.jar` file is `mw/build/libs`.

---

Or, you could let GitHub Actions build the `.jar` file for you. Simply track the changed files, commit, and push the changes via the bash. Go to your forked repository, check the `Actions` tab. There, you should see the most recent commit pushes you've done. Select the most recent commit with green checkmark _(indicates that it didn't fail to build)_, and download the uploaded artifact. <br>

The downloaded artifact is a `.zip` file, you have to manually unzip it to actually get the `.jar` file. The `.jar` file should be compatible for both android and desktop.

---

Huge thanks to our contributors that have actively participated in the development of this mod, so be sure to check them out!

Translators:
- French: [feu-follet](https://github.com/feu-follet)
- Ukrainian: [Prosta4okua](https://github.com/Prosta4okua)

Contributors:
- [kapzduke](https://github.com/kapzduke)
- [dsethlewis](https://github.com/dsethlewis)
- [DatOnePlayer](https://github.com/DatOnePlayer)
- [Gdeft](https://github.com/Gdeft)
- [D.A.R.K](https://github.com/DARK0717)
- [ThePythonGuy3](https://github.com/ThePythonGuy3)
- [SteelBlue8](https://github.com/SteelBlue8)
- [sk7725](https://github.com/sk7725)

If you want to contribute to this mod, or simply just want to know more, also join our [Discord server](https://discord.gg/K3uzNSD)!

Cheers,
[JerichoFletcher](https://bit.ly/JF_IG) & [GlennFolker](https://github.com/GlennFolker)
