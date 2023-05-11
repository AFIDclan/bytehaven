let self = {last_update_rates: [], last_update: 0}

// setInterval(() => {
//             self.last_update_rates.push(Date.now() - self.last_update);

//             if (self.last_update_rates.length > 10)
//                 self.last_update_rates.shift();

//             self.last_update = Date.now();

//         }, 1000/60);

// setInterval(()=>console.log(1000/(self.last_update_rates.reduce((a, b) => a + b, 0) / self.last_update_rates.length)), 2000)


let setIntervalPrecise = (callback, interval) => {
    let last_execution = Date.now();

    setInterval(() => {
        let now = Date.now();
        let delta = now - last_execution;
        console.log("Delta: " + delta)
        if (delta >= interval)
        {
            callback(delta);
            last_execution = now;
        }

    }, 1);
}

let last = Date.now()

setIntervalPrecise(() => {
    console.log(Date.now()-last)
    last = Date.now();

}, 20);
