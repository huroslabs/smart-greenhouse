# IoT Control & Monitoring (REST + MQTT)

Sistem backend sederhana untuk mengontrol dan memonitor perangkat IoT menggunakan Node.js dan Express.


## Fitur

- REST API untuk mengirim perintah ON/OFF.
- MQTT Publisher untuk mengirim kontrol ke perangkat.
- MQTT Subscriber untuk menerima data sensor.
- Struktur kode sederhana dan mudah dipelajari.
- Cocok untuk ESP32 / ESP8266.



## Instalasi

1. Clone repository
```
   git clone https://github.com/huroslabs/smart-greenhouse.git
   cd project
```
2. Install dependencies

   npm install

3. Jalankan server
```
   node rest.js
   node mqtt.js
```
Server akan berjalan di:
http://localhost:3000

## Lisensi

© 2025 HurosLabs  
All rights reserved.

