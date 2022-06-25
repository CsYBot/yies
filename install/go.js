const fs = require("fs");
const axios = require("axios");
const http = require('https');
const term = require("terminal-kit").terminal;
const getutil = require("./util");
const request = require('superagent');
const admZip = require('adm-zip');
const path = require('path');
async function start() {
    const util = new getutil(term);
    var stop = false;
    const LICENSE = fs.readFileSync('license', 'utf8');
    util.send("Lisans Kontrol Ediliyor.", "brightCyan");
    await util.wait();
    if(!LICENSE) return util.send("LICENSE PROBLEM V1", "red");
    let keycontrols = await axios.get("https://raw.githubusercontent.com/CsYBot/yies/main/server").catch(err => stop = true && util.send("LICENSE SERVER PROBLEM", "red"));
    if(stop) return;
    let keycontrol = await axios.get((String(keycontrols.data)).replaceAll("\n", ""), {
        headers: {
            Authorization: LICENSE
        }
    }).catch(err => stop = true && util.send("LICENSE MAIN SERVER PROBLEM", "red"));
    if(stop) return;

    if(!keycontrol || !keycontrol.data || typeof keycontrol.data !== "object" || !keycontrol.data.download) return util.send("LICENSE BROKEN!", "red");

    util.send("Yükleniyor..", "green");
    try {
        const source = `${String(keycontrol.data.download)}`;
        
        request.get(source).on('error', function(error) {
            error + "1";
            util.send("Max Deneme Ulaştın!", "red")
        }).pipe(fs.createWriteStream("downloading.zip")).on('finish', function() {
            util.send("Başarıyla Yüklenildi!", "green");
        });
        var zip = new admZip("../downloading.zip");
        util.send("Çözümleniyor!", "green");
        zip.extractAllTo("src/", true);
        util.send("Başarıyla Çözümlendi!", "green");
        await util.wait();
        util.send("Üzerinde Çalışılıyor..", "blue");

        fs.unlinkSync(path.join(__dirname, "../downloading.zip"));
        await util.wait();

        fs.writeFileSync(path.join(__dirname, "../completed"), "completed");
    } catch (err) {
        err + "1";
        util.send("DOWNLOADING LICENSE MAIN SERVER PROBLEM", "red")
    }
};
start();
