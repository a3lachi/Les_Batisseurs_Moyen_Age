import fs from "fs"
import path from "path"
import _ from "lodash"
import mkdirp from "mkdirp"

import * as cardService from "../services/cardService"

export async function loadBuildings() {
    console.log('BUILD DEMSSA')
}




export async function updateGame(gameid, game) {
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[2]===gameid) { 
            var pat = path.join(__dirname, "../games/"+dirent.name+'/theGame.txt')

            fs.writeFile(pat, JSON.stringify(game, null, 2), function (err) {
                  if (err) return console.log(err);
            });


        }
    }
}


// async function CheckEndGame()
// {

// }


async function CheckFinishedBuilds(gam,build,plyer,cnt_bld){

    // build is the under construction building we just sent a worker too
    var stone = 0 , wood = 0 , knowldge = 0 , tile = 0 ;

    // summing workers stats
    for (var wrker of build['workers']) 
    {
        stone+=parseInt(wrker['stone'])
        wood+=parseInt(wrker['wood'])
        knowldge+=parseInt(wrker['knowledge'])
        tile+=parseInt(wrker['tile'])
    }

    //comparing workers stats to building requirements
    if ( parseInt(build['stone'])<=stone && parseInt(build['wood'])<=wood && parseInt(build['knowledge'])<=knowldge && parseInt(build['tile'])<=tile  )
    {

        // player get workers back
        //console.log("HAK WORKeretresertehrsterdhrstdreERS",plyer['underConstructionBuildings'][cnt_bld]['workers'])
        for await (var wker of plyer['underConstructionBuildings'][cnt_bld]['workers'] )
        {
            plyer['availableWorkers'].push(wker)
        }

        // new finished building
        build['workers']=[]

        //check if building is a machine
        if (parseInt(build['reward'])!=0) {
            // set up the machine
            var machine = {
                'id': parseInt(build[0]),
                'price': parseInt(build[1]),
                'stone':parseInt(build[7]),
                'wood':parseInt(build[8]),
                'knowledge':parseInt(lmnt[9]),
                'tile':parseInt(lmnt[10])
            } ;
            // inject machine whithin workers
            plyer['availableWorkers'].push(machine)
        }


        else {
            plyer['finishedBuildings'].push(build)
        }

        plyer['underConstructionBuildings'].splice(cnt_bld,1) // deleting finished building

        plyer['money']+=build['reward']


        plyer['victoryPoints']+=build['victoryPoint']

    }
}

export async function countActions(gam,registerBuildingId,playerId){
    // i use one file  SendWorkerHistory.txt for all players to record every SEND_WORKER action
    // file gets updated every turn of every player : empty after turn of each player

    const gamdir = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gamdir)

    console.log("DKHEL IQAD CHGHEL----")
    for await (const dirent of dir) {
        var fold=dirent.name.split("_")
        console.log('lqa folder')
        console.log(gam['id'])
        console.log(fold[2])
        if (fold[2].toString()===gam['id'].toString()) { 

            var pat = path.join(__dirname, "../games/"+dirent.name+'/SendWorkerHistory.txt')
            var buildcount=0 ;
            var cnt = []
            //var data = await loadMonoCounter(pat)
            try {
                const files =  await fs.promises.readFile(pat, "utf8")
                
                console.log('lqa mayqra',files)
                cnt = files.split(':')
                for await (var blida of cnt) {
                    if (blida == registerBuildingId){ buildcount++; }
                }
            }catch(e) {}

            console.log('HACHHAL LQA MN BUILD',buildcount)

            // apply actions fees 
            for await (var player of gam['players']){
                if (player['id']==playerId) {
                    player['actions']=player['actions']-buildcount-1

                    // end turn
                    if (player['actions']==0) {
                        gam['currentPlayer']=((gam['currentPlayer'])%((gam['players']).length) || 0) + 1 ;
                        player['actions'] = 3
                        lfra="" // leave blank the record file
                    }
                    else // append only if turn still going
                    {
                        // append new build record
                        cnt.push(registerBuildingId.toString())
                        var lfra = ""
                        for await (var blda of cnt) {
                            if (blda.length>0) { lfra+=blda+':' }
                        }
                    }
                    // write to file !! record duration is 1 turn of each player
                    fs.writeFileSync(pat, lfra, function (err) {
                          if (err) return console.log(err);
                    });
                }
            }

            

}}}

export async function playAction(gameid , playerid , actionn,workerId,buildingId,numberOfActions) {

    if (actionn==='TAKE_BUILDING') {
        // player take the card 
        var gam = await importSingleGameByid(gameid) // import game by its id
        //const bld = await cardService.importBuildbyId(buildingId)
        for await (const player of gam['players']) {
            // find player who launched action
            if (player['id'].toString()===playerid) {

                // count which building to replace with new from pile
                var cmpt = 0

                for await (var buildd of gam['buildings']) {
                    if (buildd.id.toString()===buildingId.toString() && player['actions']>0) {
                        // add building to player arsenal
                        player['underConstructionBuildings'].push(buildd)

                        // actions fees
                        player['actions']-=1

                        // take new building card from pile and change cards pile
                        var ff = await cardService.updateBuildings(gameid)

                        // replacement
                        gam['buildings'][cmpt] = ff ;
                        gam['remainingBuildings']-=1
                        if (player['actions']==0) {
                            gam['currentPlayer']=((gam['currentPlayer'])%((gam['players']).length) || 0) + 1 ;
                            player['actions'] = 3
                        }
                        // insert new updated game + add 1 card to building cards
                        await updateGame(gameid,gam)
                        
                        // return to quit loop after job done
                        return gam
                    }
                    cmpt+=1
                    }}} ;


        // load another card 4+1

    } else if (actionn==='TAKE_WORKER') { 

        var gam = await importSingleGameByid(gameid)
        //const bld = await cardService.importWorkerbyId(workerId)
        for await (const player of gam['players']) {
            
            if (player['id'].toString()===playerid.toString()) {
                var cmpt = 0
                for await (var wok of gam['workers']) {
                    if (wok.id.toString()===workerId.toString() && player['actions']>0 ) {
                        player['availableWorkers'].push(wok)
                        player['actions']-=1
                        var ff = await cardService.updateWorkers(gameid)
                        gam['workers'][cmpt] = ff ;

                        gam['remainingWorkers']-=1
                        if (player['actions']==0) {
                            console.log('SALA TR7OOOOOOO')
                            gam['currentPlayer']=(((gam['currentPlayer'])%(gam['players'].length) ) || 0 ) + 1 ;
                            player['actions'] = 3
                        }
                        await updateGame(gameid,gam)
                        console.log(gam)

                        return gam
                    }
                    cmpt+=1
                    }}} ;
        // check if building is ready to build !!!!!!!!!
        
    } else if (actionn==='TAKE_MONEY') {
        var gam = await importSingleGameByid(gameid)
        for await (var player of gam['players']) {
            if (player['id']==playerid) {
                if (numberOfActions<=player['actions'])
                {
                    if (numberOfActions===1) {
                        player['money']+=1
                    }
                    else if (numberOfActions===2) {
                        player['money']+=3
                    }
                    else if (numberOfActions===2) {
                        player['money']+=6
                    }
                    player['actions']=player['actions']-numberOfActions ;
                    // managing actions and end of player turn
                    if (player['actions']==0) {
                        gam['currentPlayer']=(((gam['currentPlayer'])%(gam['players'].length) ) || 0 ) + 1 ;
                        player['actions'] = 3
                    }
                    //console.log(gam)
                    await updateGame(gameid,gam)
                    return gam
                }
            }
        }

    } 
    // send worker to work on under construction build 
    else if (actionn==='SEND_WORKER') {
        // help delete worker from avalableworkers list
        var cmpt = 0   

        // help delete building if finished from under construction building
        var cmpt_bld = 0

        // check if action is possible 
        var gam = await importSingleGameByid(gameid)
        console.log('DKHEL ISENDI WROKER')
        for await (var player of gam['players']) {
            // find player asking for action and verify he's authorized to play action
            if (player['id'].toString()===playerid.toString() && player['actions']>0) {
                // loop over players' available workers
                for await (var works of player['availableWorkers']) {
                    // find the worker among players' available workers
                    if (works['id'].toString()===workerId.toString()) {
                        // loop over under construction buildings
                        for await (var build of player['underConstructionBuildings']) {
                            // find the under constructing building where to add the worker
                            
                            if (build['id'].toString()===buildingId.toString() && works['price']<=player['money']) {
                                // adding the worker to the site
                                build['workers'].push(works)
                                player['availableWorkers'].splice(cmpt,1)
                                player['money']-=works['price']                                

                                await countActions(gam,buildingId,playerid)
                                await CheckFinishedBuilds(gam,build,player,cmpt_bld)
                                await updateGame(gameid,gam)

                                return gam
                    }}}
                    cmpt+=1
        }}}}

    else if (actionn==='BUY_ACTION') {
        var gam = await importSingleGameByid(gameid)
        for await (var player of gam['players']) {
            if (player['id'].toString()===playerid) {
                if (player['money']>=5) {
                    player['money']-=5
                    player['actions']+=1
                }
            }
        }
        
        

     }
     else if (actionn==='END_TURN') {
        var gam = await importSingleGameByid(gameid)
        gam['currentPlayer']=(((gam['currentPlayer'])%(gam['players'].length)) || 0 ) + 1 ;
        await updateGame(gameid,gam)
        console.log(gam['currentPlayer'])
        return gam
     }

}



export async function importSingleGameByid(gameid) {
    var lola = []
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[2]===gameid) { 
                var pat = path.join(__dirname, "../games/"+dirent.name+'/theGame.txt')
                const file2 =  fs.readFileSync(pat).toString()
                lola.push(file2)
            }
    }
    if (lola.length>0)
        {  return JSON.parse(lola)  }
    else { return [] }
}

export async function importSingleGameByname(gamename) {
    var lola = []
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[1]===gamename) { 
                var pat = path.join(__dirname, "../games/"+dirent.name+'/theGame.txt')
                const file2 =  fs.readFileSync(pat).toString()
                lola.push(file2)
            }
    }

    return JSON.parse(lola)
}


export async function findAllGames(name,donen,id) {
    if ( typeof name !== 'undefined' && name && id !== 'undefined' && id )
    {
        try {
            const jso = await importSingleGameByid(id)
            var jsoo = {
                'id':jso['id'],
                'name':jso['name'],
                'numberOfPlayers':jso['players'].length,
                'done':jso['done'],
                'createdDate':jso['createDate']
            }
            if (jso['name']===name) {return jsoo }
                else { return []}
        } catch (e) {}
    }
    else
    {
        if ( typeof name !== 'undefined' && name )
        {
            try {
                const jso = await importSingleGameByname(name)
                var jsoo = {
                    'id':jso['id'],
                    'name':jso['name'],
                    'numberOfPlayers':jso['players'].length,
                    'done':jso['done'],
                    'createdDate':jso['createDate']
                }
                console.log(jsoo)
                return jsoo
            } catch (e) {}
        }
        else 
        {
            if (id !== 'undefined' && id)
            {
                try {
                    const jso = await importSingleGameByid(id)
                    var jsoo = {
                        'id':jso['id'],
                        'name':jso['name'],
                        'numberOfPlayers':jso['players'].length,
                        'done':jso['done'],
                        'createdDate':jso['createDate']
                    }
                    console.log(jsoo)
                    return jsoo
                } catch (e) {}
            }
            else
            {
                var lola = []
                const gam = path.join(__dirname, "../games")
                const dir = await fs.promises.opendir(gam)
                for await (const dirent of dir) {
                    var ff=dirent.name.split("_")
                    var jso = await importSingleGameByid(ff[2])
                    var jsoo = {
                        'id':jso['id'],
                        'name':jso['name'],
                        'numberOfPlayers':jso['players'].length,
                        'done':jso['done'],
                        'createdDate':jso['createDate']
                    }
                    lola=lola.concat(jsoo)
                             
                }
                return lola

            }
        }
    }
}

export async function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
export async function shufflBuildings(gamm) {
    const filePath = path.join(__dirname, "../ressources/buildings.csv")
    const files =   fs.readFileSync(filePath, "utf8")
    const stora = files.split('\n')
    stora.shift()
    //await shuffleArray(stora)
    console.log(stora[2])
    // builds on table
    var bild=[]
    for ( let i = 0; i < 5; i++) {
        var ff = stora[i].split(";")
        var bald = {
            "id":parseInt(ff[0]) || 0  ,   // avoid NaN returned by parseInt
            "reward":parseInt(ff[1]) || 0 ,
            "victoryPoint":parseInt(ff[2])|| 0 ,   
            "stone":parseInt(ff[3])|| 0 ,
            "wood":parseInt(ff[4])|| 0 ,   
            "knowledge":parseInt(ff[5])|| 0 ,  
            "tile":parseInt(ff[6])|| 0 ,  
            "stoneProduced":parseInt(ff[7])|| 0 ,  
            "woodProduced":parseInt(ff[8]),   
            "knowledgeProduced":parseInt(ff[9])|| 0 ,  
            "tileProduced":parseInt(ff[10])|| 0 ,   
            "workers":[]
        }
        bild.push(bald)

    }
    console.log(bild)

    // create builds pile
    var filepa = path.join(__dirname, "../games/"+gamm+"/remainBuilds.txt"); 
    var logger = fs.createWriteStream(filepa, {flags: 'a' })
    stora.forEach(function(element) { logger.write(element+"\n") } )


    return bild

}

export async function shufflWorkers(gamm) {
    const filePath = path.join(__dirname, "../ressources/workers.csv")
    const files =  await fs.promises.readFile(filePath, "utf8")
    const stora = files.split('\n')
    stora.shift()
    await shuffleArray(stora)

    var wok = []
    for ( let i = 0; i < 5; i++) {
        var ff = stora[i].split(";")
        var bald = {
            'id': parseInt(ff[0]) || 0 ,
            'price': parseInt(ff[1]) || 0 ,
            'stone': parseInt(ff[2]) || 0  ,  
            'wood': parseInt(ff[3]) || 0 ,  
            'knowledge': parseInt(ff[4])|| 0  , 
            'tile': parseInt(ff[5]) || 0 
        }
        wok.push(bald)

    }

    // create workers pile
    var filepa = path.join(__dirname, "../games/"+gamm+"/remainWorkers.txt") ;
    var logger = fs.createWriteStream(filepa, {flags: 'a' })
    stora.forEach(function(element) { logger.write(element+"\n") } )


    return wok

}


export async function formPlayers(numberOfPlayers){

    var plrs = []
    for (let i =0; i < numberOfPlayers; i++) {
        plrs.push({
          "id": i+1,
          "finishedBuildings":[],
          "availableWorkers": [
          {  // apprenti au debut
            'id': 0,
            'price': 2,
            'stone':0,
            'wood':2,
            'knowledge':1,
            'tile':0
            } 
            ],
          "underConstructionBuildings": [],
          "money": 10,
          "victoryPoints": 0,
          "actions": 3
        })
    }
    return plrs

}

export async function createGame(numberOfPlayers , name) 
{
    const idd=parseInt(Math.random() * 1000 + 1000).toString()
    const gamm = 'game_'+name+"_"+idd
    const made = mkdirp.sync('./src/games/'+gamm)
    var playas = await formPlayers(numberOfPlayers)
    var postdata = {
        'id':parseInt(idd),
        'currentPlayer':parseInt(playas[0]['id']),
        'moneyAvailable':2444,
        'workers':await shufflWorkers(gamm),
        'buildings':await shufflBuildings(gamm),
        'remainingWorkers':37,
        'remainingBuildings':37,
        'nextWorker': await cardService.getNextWorker(idd),
        'nextBuilding':await cardService.getNextBuild(idd),
        'done':false,
        'name':name,
        'createDate':new Date().toJSON(),
        'players': playas
    }
    let data = JSON.stringify(postdata, null, 2);
    
    var filepath = './src/games/'+gamm+"/theGame.txt";
    fs.writeFileSync(filepath, data, (err) => { if (err) throw err });
}











