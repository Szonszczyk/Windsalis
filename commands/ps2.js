const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const https = require('https')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ps2')
		.setDescription('Wypluwa ilość osób aktywnych na serwerach EU gry Planetside2'),
	async execute(interaction) {
		const options = {
		  hostname: 'ps2.fisu.pw',
		  port: 443,
		  path: '/api/population/?world=10,13',
		  method: 'GET'
		}

		let d = await httprequest().then((data) => {
	    	return data;
		});

		//console.log(d);
		//res.on('data', async dd => { return dd = JSON.parse(dd);});

	  	
	    let worlds = [10,13];
		let worldsNames = ["Miller", "Cobalt"];

	    let embed = new EmbedBuilder()
	    	.setAuthor({name: "Liczba graczy na serwerach EU Planetside2", iconURL: "https://i.ibb.co/yqFrLzx/kindpng-259447.png"})
			.setColor(7132823)
			.setDescription(`${new Date(d.result[worlds[0]][0].timestamp*1000).Data()}, ${new Date(d.result[worlds[0]][0].timestamp*1000).Godzina()}`)
			.setFooter({text: `Windsalis | Dane pochodzą z API: ps2.fisu.pw`});
			// pierwszy field

		for(let i = 0; i < worlds.length; i++) {

			let vs = d.result[worlds[i]][0].vs;
			let nc = d.result[worlds[i]][0].nc;
			let tr = d.result[worlds[i]][0].tr;
			let ns = d.result[worlds[i]][0].ns;
			let popSum = vs + nc + tr + ns;
		embed.addFields({name: `${worldsNames[i]} - ${popSum}`, 
	value: "```" +
	`VS  | NC  | TR  | NS\n 
${vs} | ${nc} | ${tr} | ${ns}\n
${Math.floor(vs/popSum*100)}% | ${Math.floor(nc/popSum*100)}% | ${Math.floor(tr/popSum*100)}% | ${Math.floor(ns/popSum*100)}%` 
		+ "```" + `\n   ‌ `});
			}
		await interaction.reply({embeds: [embed]});

		setTimeout(async function() {
        	await interaction.deleteReply();
        }, 300000);
	},

};

function httprequest() {
     return new Promise((resolve, reject) => {

        const options = {
		  hostname: 'ps2.fisu.pw',
		  port: 443,
		  path: '/api/population/?world=10,13',
		  method: 'GET'
		};
        const req = https.request(options, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
          reject(e.message);
        });
        // send the request
       req.end();
    });
}

//   [0503] Wyświetlanie godziny w formacie HH:MM:SS
Date.prototype.Godzina = function() {
    return `${pad(this.getHours(),2)}:${pad(this.getMinutes(),2)}:${pad(this.getSeconds(),2)}`;
}

//   [0504] Wyświetlanie daty
Date.prototype.Data = function() { //wyświetlanie daty //
    var DzienTygodnia=["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];
    var Miesiace=["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];
    return `${DzienTygodnia[this.getDay()]}, ${this.getDate()} ${Miesiace[this.getMonth()]} ${this.getFullYear()}`;
}

//   [0607] Wyświetlanie liczby na danej ilości miejsc
function pad(num,ctplaces) {
	var s = num.toString ();
	while(s.length < ctplaces) { s = "0" + s; };
	return (s);
}