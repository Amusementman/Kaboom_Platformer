// Initialize the Kaboom context.
kaboom({
    width: 800,
    height: 600,
    background: [0, 100, 200],
});

// Set the global gravity value for all physics objects.
setGravity(800);

// Load the apple sprite.
loadSprite("apple", "https://kaboomjs.com/sprites/apple.png");

// Define our main game scene.
scene("main", () => {

    // --- The Level Design ---
    const levelLayout = [
        "                    ",
        "                    ",
        "    =         =     ",
        "                    ",
        "  =       =      =  ",
        "                    ",
        "====================",
    ];

    // Configure what each symbol in the level layout means.
    const levelConf = {
        tileWidth: 47,
        tileHeight: 47,
        tiles: {
            " ": () => [], // An empty space does nothing
            "=": () => [
                rect(47, 47),
                color(0, 200, 0),
                area(),
                // This makes the platforms solid and unmovable.
                body({ isStatic: true }),
            ],
        }
    };

    // Add the level to the screen.
    addLevel(levelLayout, levelConf);

    // --- The Player Character ---
    const player = add([
        sprite("apple"),
        pos(100, 100),
        // A scaled-down hitbox prevents getting stuck on walls.
        area({ scale: 0.7 }),
        // The body() component enables physics (gravity).
        body(),
        "player",
    ]);

    // --- Movement Controls ---
    onKeyDown("left", () => {
        player.move(-200, 0);
    });

    onKeyDown("right", () => {
        player.move(200, 0);
    });

    onKeyPress("space", () => {
        // isGrounded() is the simplest, most reliable way to check for jumping
        // when the setup is correct.
        if (player.isGrounded()) {
            player.jump(650);
        }
    });

});

// Start the game by going to the "main" scene.
go("main");