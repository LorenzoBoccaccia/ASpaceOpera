_game = function(){
    this.init = function(scenario) {
        switch (scenario) {
            case "beginning":
                this.setupBeginning();
                this.show();
                break;
            default:
                alert("not yet implemented");
        }
    },

    this.show = function() {
        $('#scenario').fadeOut();
        $('#game').fadeIn();
        this.updateView();
    },

    this.setupBeginning = function() {
        this.state = {}
        this.state.systems = [];
        this.state.systems.push(_solarSystem);
        this.state.enemyes = [];
        this.state.player = {
            stability: 0.7,
            legitimacy: 0.9,
            pressure: 0,
            equality: 0.4,
            power:50
        };

        _solarSystem[0].colony = undefined  //sol
        _solarSystem[1].colony = _g_colony_med() //mer
        _solarSystem[2].colony = _g_colony_med() //ven
        _solarSystem[3].colony = _g_planet_large() //ear
        _solarSystem[4].colony = _g_planet_med() //mar
        _solarSystem[5].colony = _g_colony_new() //bel
        _solarSystem[6].colony = _g_colony_old() //ju
        _solarSystem[7].colony = _g_colony_new() //sa
        _solarSystem[8].colony = _g_colony_new() //ur
        _solarSystem[9].colony = _g_colony_new() //ne
        _solarSystem[10].colony = _g_colony_new() //pl
        _solarSystem[11].colony = undefined //ku


    }



    this.turn = function() {
        this.evolvePop();

        this.updateView();
    }


    this.evolvePop = function(){
        var planetByPrestige = [];
        var bio = 0;
        var chem = 0;
        var min = 0;
        var pil = 0;
        for(var s = 0; s < this.state.systems.length; s++) {
            var system = this.state.systems[s];
            for(var p = 0; p < system.length; p++) {
                var planet = system[p];
                if(planet.colony) {

                var v = planet.colony.export * planet.colony.population * (1-planet.colony.infrastructure) * planet.value * 10.0;
                pil += (1-planet.colony.export) * planet.colony.population * planet.value * planet.colony.infrastructure * 10.0;

                switch(planet.res) {
                    case 'Minerals': min+=v;
                        break;
                    case 'Chemicals': chem+=v;
                        break;
                    case 'Biosphere': bio+=v;
                        break;
                    default: console.log('unknown resource ' + planet.res);
                        break;
                }

                for (var m = 0; m< planet.moons.length; m++){
                    var moon = planet.moons[m];

                    var v = planet.colony.export * planet.colony.population * (1-planet.colony.infrastructure) * moon.value * 10.0;
                    pil += (1-planet.colony.export) * planet.colony.population * moon.value * planet.colony.infrastructure * 10.0;

          

                    switch(moon.res) {
                        case 'Minerals': min+=v;
                            break;
                        case 'Chemicals': chem+=v;
                            break;
                        case 'Biosphere': bio+=v;
                            break;
                        default: console.log('unknown resource ' + moon.res);
                            break;
                    }

                }
                planetByPrestige.push(planet);
                }
            }
        }

         planetByPrestige.sort(function(a,b){
           return b.colony.prestige - a.colony.prestige;
        });

        for(var p = 0; p < planetByPrestige.length; p++) {
            var planet = planetByPrestige[p];
            if (planet.value  == 0 || planet.colony === undefined) continue;

            planet.colony.unrest-=0.001;

            var localBio = planet.res === 'Biosphere';
            
            var totalvalue = planet.value;
            for (var m = 0; m < planet.moons.length; m++) {
                var moon = planet.moons[m];
                totalvalue += moon.value;
                if (moon.res === 'Biosphere') {
                    localBio = true;
                }
            }

            var pop = planet.colony.population * totalvalue;

            if ((!localBio) && pop > bio && pop > 0.05) {
                bio = 0;
                planet.colony.unrest+=0.01;
                planet.colony.population-=0.001;
            } else {
                bio -= pop;
                planet.colony.population+=0.01;
            }

            if (planet.colony.population > planet.colony.infrastructure) {
                planet.colony.unrest+=0.001;
            }

            if (planet.colony.infrastructure < planet.colony.prestige) {
                planet.colony.infrastructure += 0.001;
            }

            planet.colony.prestige+=0.001;

            if (planet.colony.infrastructure > 0.75) {
                planet.colony.prestige+=0.01;
            }


            if (planet.colony.unrest>0.15){
                planet.colony.prestige-=0.001;
                planet.colony.population-=0.005;
            }
            if (planet.colony.unrest>0.25){
                planet.colony.population-=0.005;
            }
            if (planet.colony.unrest>0.50){
                planet.colony.population-=0.01;
                planet.colony.prestige-=0.005;
            }
            if (planet.colony.unrest>0.75){
                planet.colony.population-=0.05;
                planet.colony.infrastructure-=0.01;
            }



            planet.colony.population = _clamp(planet.colony.population);
            planet.colony.unrest = _clamp(planet.colony.unrest);
            planet.colony.prestige = _clamp(planet.colony.prestige);

        }

        console.log('b '+bio+' m '+ min+ ' c '+chem);

    }

    this.updateView = function() {
        var sp = $('#system');
        sp.empty();
        for(var s = 0; s < this.state.systems.length; s++) {
            var system = this.state.systems[s];
            for (var p = 0; p < system.length; p++) {
                var planet = system[p];
                var d = $('<div class="body"/>');
                d.append($('<span>'+planet.name+'</span>'));
                d.append($('<span> '+planet.desc+'</span>'));
                d.append($('<span> VAL: '+planet.value+'</span>'));
                sp.append(d);
                d = $('<div class="details"/>');
                if (planet.value > 0) {
                    d.append($('<span> POP: ' + (planet.colony.population * 100).toFixed(0) + '%</span>'));
                    d.append($('<span> UNR: ' + (planet.colony.unrest * 100).toFixed(0) + '%</span>'));
                    d.append($('<span> PRS: ' + (planet.colony.prestige * 100).toFixed(0) + '%</span>'));
                    d.append($('<span> EXP: ' + (planet.colony.export * 100).toFixed(0) + '%</span>'));
                    d.append($('<span> INF: ' + (planet.colony.infrastructure * 100).toFixed(0) + '%</span>'));
                    sp.append(d);
                }
            }
        }
    }

};




var Game = new _game();


var _g_colony_new = function(owner) {
    return {
        owner : owner,
        government : {
            governor:  _person("random governor ", "",7,7,7,7,7,7),
            commerce:  _person("random governor ", "",7,7,7,7,7,7),
            security:  _person("random governor ", "",7,7,7,7,7,7),
            industry:  _person("random governor ", "",7,7,7,7,7,7),
            welfare:  _person("random governor ", "",7,7,7,7,7,7)
        },
        unrest: 0,
        export: 1,
        prestige: 0.1,
        population: 0.1,
        infrastructure: 0.1,
        orientation: {
            tradition: 0.0,
            independence: 0.0,
            xenophobia: 0.6
        }

    }
}

var _g_colony_med = function(owner) {
    return {
        owner : owner,
        government : {
            governor:  _person("random governor ", "",7,7,7,7,7,7),
            commerce:  _person("random governor ", "",7,7,7,7,7,7),
            security:  _person("random governor ", "",7,7,7,7,7,7),
            industry:  _person("random governor ", "",7,7,7,7,7,7),
            welfare:  _person("random governor ", "",7,7,7,7,7,7)
        },
        unrest: 0.1,
        export: 0.8,
        prestige: 0.2,
        population: 0.4,
        infrastructure: 0.2,
        orientation: {
            tradition: 0.3,
            independence: 0.2,
            xenophobia: 0.8
        }

    }
}

var _g_colony_old = function(owner) {
    return {
        owner : owner,
        government : {
            governor:  _person("random governor ", "",7,7,7,7,7,7),
            commerce:  _person("random governor ", "",7,7,7,7,7,7),
            security:  _person("random governor ", "",7,7,7,7,7,7),
            industry:  _person("random governor ", "",7,7,7,7,7,7),
            welfare:  _person("random governor ", "",7,7,7,7,7,7)
        },
        unrest: 0.1,
        export: 0.6,
        prestige: 0.4,
        population: 0.6,
        infrastructure: 0.5,
        orientation: {
            tradition: 0.7,
            independence: 0.3,
            xenophobia: 0.9
        }

    }
}

var _g_planet_med = function(owner) {
    return {
        owner : owner,
        government : {
            governor:  _person("random governor ", "",7,7,7,7,7,7),
            commerce:  _person("random governor ", "",7,7,7,7,7,7),
            security:  _person("random governor ", "",7,7,7,7,7,7),
            industry:  _person("random governor ", "",7,7,7,7,7,7),
            welfare:  _person("random governor ", "",7,7,7,7,7,7)
        },
        unrest: 0.1,
        export: 0.5,
        prestige: 0.8,
        population: 0.8,
        infrastructure: 0.6,
        orientation: {
            tradition: 0.6,
            independence: 0.2,
            xenophobia: 0.9
        }


    }
}

var _g_planet_large = function(owner) {
    return {
        owner : owner,
        government : {
            governor:  _person("random governor ", "",7,7,7,7,7,7),
            commerce:  _person("random governor ", "",7,7,7,7,7,7),
            security:  _person("random governor ", "",7,7,7,7,7,7),
            industry:  _person("random governor ", "",7,7,7,7,7,7),
            welfare:  _person("random governor ", "",7,7,7,7,7,7)
        },
        unrest: 0.2,
        export: 0.4,
        prestige: 1,
        population: 1,
        infrastructure: 1,
        orientation: {
            tradition: 0.8,
            independence: 0.0,
            xenophobia: 0.9
        }
    }
}




var _person = function(name, faction, loyalty, competence, ruthlessness, populism, connections, greed ) {
    return {

    }
}

var _clamp = function(val) {
    if(val<0) val =0;
    if (val > 1) val = 1;
    return val;
}

var _body = function(name, type, desc, value, cost, res, moons) {
    return {
        name : name,
        type: type,
        desc: desc,
        res: res,
        value: value,
        cost: cost,
        moons: moons
    };
}

var _solarSystem  = [

    _body('Sol', 'Star',  'A smallish, unremarkable star we call ours', 0, 'Energy', []),
    _body('Mercury', 'Rocky Planet',  '...',  1, 15, 'Minerals' , []),
    _body('Venus', 'Rocky Planet',  '...',   1, 30, 'Chemicals', []),
    _body('Earth', 'Rocky Planet',  '...',   10, 1, 'Biosphere', [_body('Moon', 'Rocky Moon', '...', 2, 10, 'Minerals')]),
    _body('Mars', 'Rocky Planet',  '...',   7, 4, 'Biosphere', []),
    _body('Asteroid Belt', 'Asteroid Belt',  '...', 1, 100, 'Minerals', []),
    _body('Jupiter', 'Gas Giants',  '...',   1, 100,'Chemicals', [
        _body('Io', 'Rocky Moon','...',   4, 6, 'Minerals'),
        _body('Ganimede', 'Rocky Moon','...',  3, 10,  'Minerals'),
        _body('Europa', 'Rocky Moon','...',  3, 6, 'Biosphere'),
        _body('Callisto', 'Rocky Moon','...',  1, 10, 'Minerals')
        ]),
    _body('Saturn', 'Gas Giants',  '...',   1, 100, 'Chemicals', []),
    _body('Uranus', 'Ice Giants',  '...',   1, 100, 'Chemicals', []),
    _body('Neptune', 'Ice Giants',  '...',  1, 100, 'Chemicals', []),
    _body('Pluto', 'Rocky Planetoid',  '...',   1, 20, 'Minerals', []),
    _body('Kupier Belt', 'Asteroid Belt',  '...',  0, 100, 'Minerals', [])

]