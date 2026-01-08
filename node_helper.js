const NodeHelper = require("node_helper");
const exec = require("child_process").exec;

module.exports = NodeHelper.create({
    start: function() {
        this.config = {};
        this.fanOn = false;
        this.checking = false;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "START_FAN_CONTROL") {
            this.config = payload;
            // POPRAWKA: Używamy console.log
            console.log("MMM-CpuFanControl: Rozpoczynam pętlę sprawdzania temperatury.");

            setInterval(() => {
                this.checkTemperature();
            }, this.config.check_interval);

            this.checkTemperature();
        }
    },

    checkTemperature: function() {
        if (this.checking) {
            return;
        }
        this.checking = true;

        exec("vcgencmd measure_temp", (error, stdout, stderr) => {
            if (error) {
                // POPRAWKA: Używamy console.error
                console.error("MMM-CpuFanControl: Błąd odczytu temperatury: " + error);
                this.checking = false;
                return;
            }

            try {
                const temp = parseFloat(stdout.split("=")[1].split("'")[0]);
                // POPRAWKA: Używamy console.log
                console.log("MMM-CpuFanControl: Aktualna temperatura: " + temp + "°C");

                if (temp >= this.config.temp_high && this.fanOn === false) {
                    // POPRAWKA: Używamy console.log
                    console.log("MMM-CpuFanControl: Temperatura WYSOKA! Włączam wentylator.");
                    this.setFanState(true);
                } else if (temp <= this.config.temp_low && this.fanOn === true) {
                    // POPRAWKA: Używamy console.log
                    console.log("MMM-CpuFanControl: Temperatura NISKA! Wyłączam wentylator.");
                    this.setFanState(false);
                }

            } catch (e) {
                // POPRAWKA: Używamy console.error
                console.error("MMM-CpuFanControl: Błąd parsowania temperatury: " + e);
            }

            this.checking = false;
        });
    },

    // Funkcja do fizycznego włączania/wyłączania pinu GPIO
    setFanState: function(newState) {
        const pin = this.config.gpio_pin;
        
        // Używamy pinctrl (standard dla RPi 5)
        // op = output (wyjście)
        // dh = drive high (włącz/1)
        // dl = drive low (wyłącz/0)
        const mode = "op"; 
        const level = newState ? "dh" : "dl";
        
        // Komenda wygląda np. tak: "pinctrl set 24 op dh"
        const cmd = `pinctrl set ${pin} ${mode} ${level}`;
        
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                Log.error("MMM-CpuFanControl: Błąd ustawiania GPIO: " + error);
                return;
            }
            // Zaktualizuj stan tylko, jeśli komenda się powiodła
            this.fanOn = newState;
        });
    }
});
