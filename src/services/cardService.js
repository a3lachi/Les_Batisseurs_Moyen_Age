import fs from "fs"
import path from "path"
import _ from "lodash"
 
 
 
 
export async function csvToJson(file) {
    try {
      
      const filePath = path.join(__dirname, file)
      const files =  await fs.promises.readFile(filePath, "utf8")
      const stora = files.split('\n')
      stora.push()
      return stora 
 
    } catch(e) {
      // Une erreur e est survenue
    }
}
 
export async function importWorkerbyId(workerid)
{
    var jso = await importWorkers()
 
    for await (var elem of jso) {
        if (elem['id']===workerid.toString())
            return elem ;
    }
    return 0 ;
}
 
export async function importBuildbyId(buildid)
{
    var jso = await importBuildings()
 
    for await (var elem of jso) {
        if (elem['id']===buildid.toString())
            return elem ;
    }
    return 0 ;
}
 
export async function importBuildings() {
    var stora = await csvToJson("../ressources/buildings.csv")
    stora.shift()
    var jso = []
    for await (const element of stora ) { 
        var lmnt=element.split(";")
        var dict = {
            'id': lmnt[0],
            'reward': lmnt[1],
            'victoryPoint':lmnt[2],
            'stone':lmnt[3],
            'wood':lmnt[4],
            'stoneProduced':lmnt[5],
            'woodProduced':lmnt[6],
            'knowledgeeProduced':lmnt[7],
            'tileProduced':lmnt[8],
            'workers':{}
        } ;

        jso.push(dict)
        };
    return jso
    
 
}
 
export async function importWorkers() {
  var stora = await csvToJson("../ressources/workers.csv")
  stora.shift()
    var jso = []
    stora.forEach(function(element) { 
        var lmnt=element.split(";")
        var dict = {
            'id': lmnt[0],
            'price': lmnt[1],
            'stone':lmnt[2],
            'wood':lmnt[3],
            'knowledge':lmnt[4],
            'tile':lmnt[5]
        } ;
        
        jso.push(dict)
        });
    return jso
}
 
 
 
 
export async function updateBuildings(gameid) {
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[2]===gameid) {
            const files =  await fs.promises.readFile(gam+"/"+dirent.name+"/remainBuilds.txt", "utf8")
            var build=files.split("\n")
            var lmnt=build[0].split(";")
            var dict = {
                'id': parseInt(lmnt[0]),
                'reward': parseInt(lmnt[1]),
                'victoryPoint':parseInt(lmnt[2]),
                'stone':parseInt(lmnt[3]),
                'wood':parseInt(lmnt[4]),
                'knowledge':parseInt(lmnt[5]),
                'tile':parseInt(lmnt[6]),
                'stoneProduced':parseInt(lmnt[7]),
                'woodProduced':parseInt(lmnt[8]),
                'knowledgeeProduced':parseInt(lmnt[9]),
                'tileProduced':parseInt(lmnt[10]),
                'workers':[]
            } ;
 
            console.log("RASS DYAL LPILE CONTAIN BUILD ID ", dict['id'])
            build.shift()
            console.log("RASS JDID DYAL LPILE CONTAIN BUILD ID ", build[1])
            var pat = path.join(__dirname, "../games/"+dirent.name+'/remainBuilds.txt')
            fs.writeFile(pat, build.join("\n"), function (err) {
                  if (err) return console.log(err);
                });
            return dict
 
        }
    }
}
 
export async function updateWorkers(gameid) {
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[2]===gameid) {
            const files =  await fs.promises.readFile(gam+"/"+dirent.name+"/remainWorkers.txt", "utf8")
            var build=files.split("\n")
            var lmnt=build[0].split(";")
            var dict = {
                'id': parseInt(lmnt[0]),
                'price': parseInt(lmnt[1]),
                'stone':parseInt(lmnt[2]),
                'wood':parseInt(lmnt[3]),
                'knowledge':parseInt(lmnt[4]),
                'tile':parseInt(lmnt[5])
            } ;
 
            console.log("RASS DYAL LPILE CONTAIN BUILD ID ", dict['id'])
            build.shift()
            console.log("RASS JDID DYAL LPILE CONTAIN BUILD ID ", build[1])
            var pat = path.join(__dirname, "../games/"+dirent.name+'/remainWorkers.txt')
            fs.writeFile(pat, build.join("\n"), function (err) {
                  if (err) return console.log(err);
                });
            return dict
 
        }
    }
}
 
export async function getNextWorker(gameid)
{
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[2]===gameid) {
            const files =  await fs.promises.readFile(gam+"/"+dirent.name+"/remainWorkers.txt", "utf8")
            var build=files.split("\n")
            var lmnt = build[0].split(";")
            var dict = {
                'id': parseInt(lmnt[0]),
                'price': parseInt(lmnt[1]),
                'stone':parseInt(lmnt[2]),
                'wood':parseInt(lmnt[3]),
                'knowledge':parseInt(lmnt[4]),
                'tile':parseInt(lmnt[5])
            } ;
            return dict ;
 
}}}
 
export async function getNextBuild(gameid)
{
    const gam = path.join(__dirname, "../games")
    const dir = await fs.promises.opendir(gam)
    for await (const dirent of dir) {
        var ff=dirent.name.split("_")
        if (ff[2]===gameid) {
            const files =  await fs.promises.readFile(gam+"/"+dirent.name+"/remainBuilds.txt", "utf8")
            var build=files.split("\n")
            var lmnt = build[0].split(";")
            var dict = {
                'id': parseInt(lmnt[0]),
                'reward': parseInt(lmnt[1]),
                'victoryPoint':parseInt(lmnt[2]),
                'stone':parseInt(lmnt[3]),
                'wood':parseInt(lmnt[4]),
                'knowledge':parseInt(lmnt[5]),
                'tile':parseInt(lmnt[6]),
                'stoneProduced':parseInt(lmnt[7]),
                'woodProduced':parseInt(lmnt[8]),
                'knowledgeeProduced':parseInt(lmnt[9]),
                'tileProduced':parseInt(lmnt[10]),
                'workers':{}
            } ;
            return dict ;
 
}}}