// Initialize the Kaboom context.
kaboom({
    width: 1400,
    height: 800,
    background: [82, 70, 105],
});

// Set the global gravity value for all physics objects.
setGravity(1200);

// --- Load Assets ---
loadSprite("btfly", "https://kaboomjs.com/sprites/btfly.png");
loadSprite("enemy", "https://kaboomjs.com/sprites/ghosty.png");
loadSprite("moon", "https://kaboomjs.com/sprites/moon.png");
loadSprite("sun", "https://kaboomjs.com/sprites/sun.png");
loadSprite("heart", "https://kaboomjs.com/sprites/heart.png");
loadSprite("door", "https://kaboomjs.com/sprites/door.png");
loadSprite("truth", "https://kaboomjs.com/sprites/key.png");


// --- Define Custom Components ---
// By defining patrol() here, it's globally available and can be used by any scene.
function patrol() {
    return {
        id: "patrol",
        require: [ "pos", "area" ],
        dir: -1,
        add() {
            this.onCollide((obj, col) => {
                if (col.isLeft() || col.isRight()) {
                    this.dir = -this.dir;
                }
            });
        },
        update() {
            this.move(60 * this.dir, 0);
        },
    };
}


// --- Main Game Scene ---
scene("main", ({ level } = { level: 0 }) => {

    // Array of all level layouts
    const LEVELS = [
        [
            "                             ",
            "         ^  $ ^           D  ",
            "        $   =    $  ^     =  ",
            "        =        =           ",
            "    $                  $     ",
            "   =                   =     ",
            "=============================",
        ],
        [
            "       ^     ^     ^         ",
            "           $     ==  $  == D ",
            "           =   =  =====  =   ",
            "    $  ====        $         ",
            "   ==            ====        ",
            "=           $               =",
            "=============================",
        ],
                [
            "              +              ",
            "              =           @  ",
            "                          =  ",
            "                             ",
            "                             ",
            "     !                       ",
            "=============================",
        ]
    ];

    const currentLevel = level;

    // Configure what each symbol in the level layout means.
    const levelConf = {
        tileWidth: 47,
        tileHeight: 47,
        tiles: {
            " ": () => [],
            "=": () => [
                rect(47, 47),
                color(230, 223, 237),
                area(),
                body({ isStatic: true }),
                "platform",
            ],
            "$": () => [
                sprite("moon"),
                area(),
                "moon",
            ],
            "!": () => [
                sprite("truth"),
                area(),
                "truth",
            ],
            "+": () => [
                sprite("heart"),
                area(),
                "heart",
            ],
            "D": () => [
                sprite("sun"),
                area(),
                "sun",
            ],
            // This now correctly uses the globally-defined patrol() function.
            "^": () => [
                sprite("enemy"),
                area(),
                body(),
                patrol(),
                "enemy",
            ],
            "@": () => [
                sprite("door"),
                area(),
                body(),
                "door",
            ],
        }
    };

    addLevel(LEVELS[currentLevel], levelConf);

    // --- Score & UI ---
    let score = 0;
    const scoreLabel =add([
        text("Collect the moons"),
        pos(24,24),
        fixed(),
    ]);

    // --- The Player Character ---
    const player = add([
        sprite("btfly"),
        pos(100, 100),
        area({ scale: 0.7 }),
        body(),
        "player",
    ]);

    // --- Player Controls & Interactions ---
    onKeyDown("left", () => { player.move(-200, 0); });
    onKeyDown("right", () => { player.move(200, 0); });
    onKeyPress("space", () => { if (player.isGrounded()) { player.jump(650); } });

    //--Moon Collecting Logic--
    player.onCollide("moon", (moon) =>{
        destroy(moon);
        score+= 10;
        if (score == 50){
            scoreLabel.text = "Go into the sun";
        }else{
            scoreLabel.text ="Score: " + score;
        }

    player.onCollide("truth", (key) =>{
        destroy(key);
        score+= 100;
        if (score == 100){
            scoreLabel.text = "Find your heart";
        }else{
            scoreLabel.text ="Score: " + score;
        }

    });

    player.onCollide("heart", (heart) =>{
        destroy(heart);
        score+= "your true self";
        scoreLabel.text = "Go home, he's waiting for you";
    })

    player.onCollide("enemy", (enemy, col) => {
        if (col.isBottom()) {
            destroy(enemy);
            player.jump(300);
        } else {
            destroy(player);
            go("lose");
        }
    });

    player.onCollide("sun", () => {
        if (currentLevel + 1 < LEVELS.length) {
            go("main", { level: currentLevel + 1 });
        } else {
            go("win");
        }
    });
        player.onCollide("door", () => {
        if (currentLevel + 1 < LEVELS.length) {
            go("main", { level: currentLevel + 1 });
        } else {
            go("win");
        }
    });
});


// --- Lose Scene ---
scene("lose", () => {
    add([ text("Game Over"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});

// --- Win Scene ---
scene("win", () => {
    add([ text("You Win!"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});


// Start the game
go("main");


