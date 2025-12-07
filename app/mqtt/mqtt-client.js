const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log("MQTT Connected");
    client.subscribe('sensor/data', (err) => {
        if (err) console.error(err);
        else console.log('Subscribed to topic sensor/data');
    });
});

module.exports = client;
