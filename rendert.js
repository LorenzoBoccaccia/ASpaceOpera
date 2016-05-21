

var game = new Phaser.Game(600, 400,
    Phaser.AUTO, 'render-test',
    { preload: preload, create: create, update: update, render : render });

function preload() {


}

function create() {



    var fragmentSrc = [

        "precision mediump float;",

        "varying vec2 vTextureCoord;",
        "uniform sampler2D uSampler;",

        "void main(void) {",

        " vec4 c = texture2D(uSampler, vTextureCoord);",

        " gl_FragColor = c+vec4(.01,.01,.01,1.) ;",

        "}"
    ];

    game.expand = new Phaser.Filter(game, null, fragmentSrc);

    game.expand.setResolution(2048,2048);


    game.target = game.make.renderTexture(2048,2048);



    game.texture = game.add.sprite(0, 0, game.target);


    game.texture.filters = [ game.expand ];


    game.stage.backgroundColor = '#4d4d4d';


    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
}


function update() {
    //run the fragment
    game.expand.update();
    //this will draw the texture on the render target, including the filtering
    game.target.render(game.texture);
    //sprite is still backed by the render texture upon which we draw
    //next time fragment run, texture2D will contain the changed values
}
function render () {
    game.debug.inputInfo(32, 32);
}