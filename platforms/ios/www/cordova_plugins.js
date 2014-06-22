cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/Coordinates.js",
        "id": "org.apache.cordova.geolocation.Coordinates",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/PositionError.js",
        "id": "org.apache.cordova.geolocation.PositionError",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/Position.js",
        "id": "org.apache.cordova.geolocation.Position",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/geolocation.js",
        "id": "org.apache.cordova.geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/eu.mobilion.ibeacon/www/ibeacon.js",
        "id": "eu.mobilion.ibeacon.ibeacon",
        "clobbers": [
            "ibeacon"
        ]
    },
    {
        "file": "plugins/eu.mobilion.ibeacon/www/region.js",
        "id": "eu.mobilion.ibeacon.region"
    },
    {
        "file": "plugins/eu.mobilion.ibeacon/www/beacon.js",
        "id": "eu.mobilion.ibeacon.beacon"
    },
    {
        "file": "plugins/eu.mobilion.ibeacon/www/helper.js",
        "id": "eu.mobilion.ibeacon.helper"
    },
    {
        "file": "plugins/eu.mobilion.ibeacon/www/defaults.js",
        "id": "eu.mobilion.ibeacon.defaults"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.10",
    "org.apache.cordova.vibration": "0.3.9",
    "org.apache.cordova.geolocation": "0.3.8",
    "eu.mobilion.ibeacon": "0.0.0"
}
// BOTTOM OF METADATA
});