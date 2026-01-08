# MMM-CpuFanControl

`MMM-CpuFanControl` is a MagicMirror² module designed to control a cooling fan based on the Raspberry Pi's CPU temperature. It is specifically optimized for **Raspberry Pi 5** using the `pinctrl` tool, but works with any setup where a transistor-based switch is used to toggle a fan via GPIO.

## Overview

The module monitors the CPU temperature at regular intervals. When the temperature exceeds a defined threshold (`temp_high`), it activates a GPIO pin to turn the fan on. Once the temperature drops below the lower threshold (`temp_low`), it turns the fan off to save power and reduce noise.

### Wiring Schematic

To safely control a fan (which typically draws more current than a GPIO pin can provide), you must use a transistor (like the 2N2222A) as a switch.

![Schematic](images/schematic.png)

**Components used in the diagram:**
* **Q1:** 2N2222A NPN Transistor.
* **R1:** 1k Ohm Resistor (limits current from GPIO to the transistor base).
* **D1:** 1N4001 Diode (flyback diode to protect the Pi from inductive spikes).
* **GPIO:** The diagram shows the connection to **GPIO24 (Physical Pin 18)**.

*Note: Make sure to update the `gpio_pin` in your configuration to match your physical wiring.*

---

## Installation

1. Navigate to your MagicMirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```

2. Clone this repository:
    ```bash
    git clone https://github.com/MichalGrecer/MMM-CPUFanControl.git
    ```

3. Enter the module directory:
    ```bash
    cd MMM-CpuFanControl
    ```

## Configuration

Add the following to the modules array in your config.js file:
    ```javascript
    {
    module: "MMM-CpuFanControl",
    config: {
        temp_high: 65,          // Fan turns ON at this temp (°C)
        temp_low: 55,           // Fan turns OFF at this temp (°C)
        check_interval: 30000,  // Check interval in milliseconds (default 30s)
        gpio_pin: 24            // GPIO pin number (BCM numbering)
            }
    },
    ```
## Configuration Options

| Option | Description | Default |
| :--- | :--- | :--- |
| `temp_high` | Temperature threshold to start the fan. | `65` |
| `temp_low` | Temperature threshold to stop the fan. | `55` |
| `check_interval` | How often to poll the CPU temperature (in ms). | `30000` |
| `gpio_pin` | The BCM GPIO pin used to trigger the transistor. | `16` |

## Requirements
* Hardware: Raspberry Pi (optimized for RPi 5).
* Software: The module uses the pinctrl command (standard on latest Raspberry Pi OS) to control GPIOs without needing root privileges for the node process.