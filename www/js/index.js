/* Copyright (c) 2012-2014 Adobe Systems Incorporated. All rights reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(function () {
                alert('success!');
                var region = new ibeacon.Region({
                    identifier: '',
                    uuid: 'B35AC750-0604-4C0B-A142-7E3584D5C65D'
                });
                alert('startMonitoringForRegion');

                ibeacon.startMonitoringForRegion({
                    region: region,
                    didDetermineState: function (result) {
                        if (result.state === 'inside') alert('I see you!')
                        else alert('Where are you?');
                    }
                });
            },
            function () {
                alert('error!');
            }, { maximumAge: 3000, timeout: 15000, enableHighAccuracy: true });

//        navigator.notification.vibrate(1000);
//        AttendeaseBeacons.monitor(['3ACE8EC3-4F0E-4857-B2D8-18550DFDE39A'], function () {
//            return setInterval((function () {
//                return AttendeaseBeacons.getBeacons(function (beacons) {
//                    if (!beacons.length) {
//                        return alert("No beacons found.");
//                    } else {
//                        return _.each(beacons, function (beacon) {
//                            return alert("" + beacon.uuid + " (" + beacon.major + ", " + beacon.minor + ") " + beacon.proximityString + " (" + beacon.accuracy + " meters)");
//                        });
//                    }
//                });
//            }), 3000);
//        });
//        var onDidDetermineStateCallback = function (result) {
//            alert('onDidDetermineStateCallback');
//             console.log(result.state);
//             alert(result.state);
//        };
//
//        alert('call createBeacon');
//        var beacon = createBeacon();
//        alert('called createBeacon');
//        IBeacon.startMonitoringForRegion(beacon, onDidDetermineStateCallback);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//function createBeacon() {
//
//   var identifier = 'beaconAtTheMacBooks'; // optional
//   var major = null; // optional
//   var minor = null; // optional
//
//   var uuid = '3ACE8EC3-4F0E-4857-B2D8-18550DFDE39A'; // mandatory
//
//   // throws an error if the parameters are not valid
//   var beacon = new IBeacon.CLBeaconRegion(uuid, major, minor, identifier);
//    alert('called new IBeacon.CLBeaconRegion');
//   return beacon;
//}
