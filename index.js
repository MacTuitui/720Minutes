"use strict";
{
    //the noise

    const noise = {
        init(seed) {
            this.r = this.alea(seed);
            this.p = this.bp(this.r);
            this.perm = new Uint8Array(512);
            this.p12 = new Uint8Array(512);
            for (var i = 0; i < 512; i++) {
                this.perm[i] = this.p[i & 255];
                this.p12[i] = this.perm[i] % 12;
            }
        },
        bp(random) {
            var i;
            var p = new Uint8Array(256);
            for (i = 0; i < 256; i++) {
                p[i] = i;
            }
            for (i = 0; i < 255; i++) {
                var r = i + ~~(random() * (256 - i));
                var aux = p[i];
                p[i] = p[r];
                p[r] = aux;
            }
            return p;
        },

        masher() {
            var n = 0xefc8249d;
            return function(data) {
                data = data.toString();
                for (var i = 0; i < data.length; i++) {
                    n += data.charCodeAt(i);
                    var h = 0.02519603282416938 * n;
                    n = h >>> 0;
                    h -= n;
                    h *= n;
                    n = h >>> 0;
                    h -= n;
                    n += h * 0x100000000; // 2^32
                }
                return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
            };
        },
        alea() {
            var s0 = 0;
            var s1 = 0;
            var s2 = 0;
            var c = 1;

            var mash = this.masher();
            s0 = mash(' ');
            s1 = mash(' ');
            s2 = mash(' ');

            for (var i = 0; i < arguments.length; i++) {
                s0 -= mash(arguments[i]);
                if (s0 < 0) {
                    s0 += 1;
                }
                s1 -= mash(arguments[i]);
                if (s1 < 0) {
                    s1 += 1;
                }
                s2 -= mash(arguments[i]);
                if (s2 < 0) {
                    s2 += 1;
                }
            }
            mash = null;
            return function() {
                var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
                s0 = s1;
                s1 = s2;
                return s2 = t - (c = t | 0);
            };
        },
    };

    noise.init(42);
	let timeArray = [];
	for (let i = 0; i < 720; ++i) {
		timeArray.push(i);
	}
	let currentIndex = timeArray.length;
	while (0 !== currentIndex) {
		let randomIndex = Math.floor(noise.r() * currentIndex);
		currentIndex -= 1;
		let temp = timeArray[currentIndex];
		timeArray[currentIndex] = timeArray[randomIndex];
		timeArray[randomIndex] = temp;
	}
    let reverseMinutes =[];
    for(let i=0;i<720;++i){
        reverseMinutes[timeArray[i]]=i;
    }

	let date = new Date();
	let time_offset = date.getTimezoneOffset() * 60 * 1000;


    setInterval(function(){ 
        let tmillis = Date.now(); 
        tmillis -= time_offset;
        let second = Math.floor(tmillis / 1000.0);
        let minute = Math.floor(second / 60.0);
        let hour = Math.floor(minute / 60.0) % 24.0;
        let globalMinute = (hour%12)*60+(minute%60);
        let id = reverseMinutes[globalMinute];
        let minute60 = Math.floor(second / 60.0)%60;
        const button = document.getElementById("MagicMinute");
        button.innerHTML = "Magic Minute for "+hour+":"+minute60.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) +" (#"+id+")";
        button.href = "https://api.artblocks.io/generator/"+(27000000+id);

        let tmillis2 = Date.now()+60000; //add 1 minute
        tmillis2 -= time_offset;
        let second2 = Math.floor(tmillis2 / 1000.0);
        let minute2 = Math.floor(second2 / 60.0);
        let hour2 = Math.floor(minute2 / 60.0) % 24.0;
        let globalMinute2 = (hour2%12)*60+(minute2%60);
        let id2 = reverseMinutes[globalMinute2];
        let minute602 = Math.floor(second2 / 60.0)%60;
        const button2 = document.getElementById("MagicMinute2");
        button2.innerHTML = "Magic Minute for "+hour2+":"+minute602.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) +" (#"+id2+")";
        button2.href = "https://api.artblocks.io/generator/"+(27000000+id2);

    }, 1000);

    
}
