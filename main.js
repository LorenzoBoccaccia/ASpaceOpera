/**
 * Created by Lorenzo on 30/11/2015.
 */
var game = new Phaser.Game(600, 400,
    Phaser.AUTO, 'space-opera',
    { preload: preload, create: create, update: update, render : render });

function preload() {

    game.load.image('map', 'map.png');
    game.load.image('mas', 'massmap.png');
    game.load.shader('starshine', 'starshine.frag');
    game.load.shader('colonize', 'colonize.frag');
    game.load.shader('mapper', 'mapper.frag');

}

function create() {

    // game.add.image(0, 0, 'star');


//    game.galaxymap = game.add.sprite(0, 0, 'map');
    game.galaxymap = game.add.sprite(0, 0, 'map');

    game.starshine = new Phaser.Filter(game,undefined, game.cache.getShader('starshine'));
    game.starshine.setResolution(2048,2048);


    game.colonize= new Phaser.Filter(game,undefined, game.cache.getShader('colonize'));
    game.colonize.setResolution(2048,2048);

    game.mapper= new Phaser.Filter(game,undefined, game.cache.getShader('mapper'));
    game.mapper.setResolution(2048,2048);


    game.politicalRT = game.make.renderTexture(2048,2048);
    game.politicalRT.render(game.make.sprite(0, 0, 'mas'));



    game.politicalSP = game.make.sprite(0, 0, game.politicalRT);
    game.politicalOL = game.make.sprite(0, 0, game.politicalRT);

    game.galaxymap.filters = [game.starshine];


    game.politicalSP.filters = [game.colonize ];
    game.politicalOL.filters = [game.mapper ];
    game.politicalOL.blendMode = PIXI.blendModes.SCREEN;

    game.galaxymap.inputEnabled = true;
    game.galaxymap.input.enableDrag(false);

    game.galaxymap.addChild(game.politicalOL);

    // var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'dragon');
    // sprite.anchor.set(0.5);

    game.stage.backgroundColor = '#000';


    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;


}





function update() {
    var rec = document.getElementById('space-opera').getBoundingClientRect();
    game.scale.setGameSize(rec.width, rec.height);
    game.galaxymap.input.boundsRect = new Phaser.Rectangle(game.world.width - game.galaxymap.width, game.world.height -game.galaxymap.height, -game.world.width +game.galaxymap.width + game.galaxymap.width , -game.world.height +  game.galaxymap.height+game.galaxymap.height);


    game.starshine.update();
    game.colonize.update();
    game.mapper.update();
    game.politicalRT.renderXY(game.politicalSP,0,0,false);




}

function render () {

    // game.debug.text('Click / Tap to go fullscreen', 270, 16);
    // game.debug.text('Click / Tap to go fullscreen', 0, 16);

    //game.debug.inputInfo(32, 32);
    // game.debug.pointer(game.input.activePointer);

}