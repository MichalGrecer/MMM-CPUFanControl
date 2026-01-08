/* Magic Mirror
 * Moduł: MMM-CpuFanControl
 *
 * Stworzony, aby kontrolować wentylator CPU przez GPIO.
 */
Module.register("MMM-CpuFanControl", {
    // Domyślne ustawienia
    defaults: {
        temp_high: 65,          // Temperatura (°C), przy której wentylator się włączy
        temp_low: 55,           // Temperatura (°C), przy której wentylator się wyłączy
        check_interval: 30000,  // Sprawdzaj temperaturę co 30 sekund (w milisekundach)
        gpio_pin: 16            // Pin GPIO, który kontroluje tranzystor
    },

    start: function() {
        Log.info("Uruchamianie modułu: " + this.name);
        this.sendSocketNotification("START_FAN_CONTROL", this.config);
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        return wrapper;
    }
});
