// Initialize the game
const k = kaboom({
    width: 800,
    height: 600,
    background: [0, 100, 200],
    gravity:320,
}); 

k.loadBean();

k.scene("main", () => {

    // Add the player character ONLY
    const player = k.add([
        k.sprite("bean"),
        k.pos(100, 100),
        k.area(),
        k.body(),
        "player"
    ]);

// Movement controls are the same
    k.onKeyDown("left", () => { player.move(-200, 0); });
    k.onKeyDown("right", () => { player.move(200, 0); });
    k.onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(400);
        }
    });

});

k.go("main");