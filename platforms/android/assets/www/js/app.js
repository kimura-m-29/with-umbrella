(function () {
    'use strict';

    var app = angular.module('myApp', ['onsen.directives', 'ngTouch']);

    document.addEventListener('deviceready', function () {
        console.log('### deviceready');
        angular.bootstrap(document, ['myApp']);

        var clearId = null;
        ibeacon.identifier = 'with-umbrella';
        ibeacon.startRangingBeaconsInRegion({
            region: new ibeacon.Region({
                uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
            }),
            didRangeBeacons: function (result) {
                console.log(JSON.stringify(result));
                var beacon = result.beacons[0];
                angular.element('#iBeaconLog').html('uuid: ' + beacon.uuid + '<br/>' + 'rssi: ' + beacon.rssi + '<br />' + 'proximity: ' + beacon.proximity);

                if (beacon.proximity == 'immediate') {
                    if (!clearId) {
                        clearId = setInterval(function () {
                            navigator.notification.vibrate(1000);
                        });
                    }
                } else {
                    clearInterval(clearId);
                    clearId = null;
                }
            }
        });
    }, false);
})
();
