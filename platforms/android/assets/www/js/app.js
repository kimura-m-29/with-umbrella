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

                // デバッグ用 TODO 削除
                angular.element('#iBeaconLog').html('uuid: ' + beacon.uuid + '<br/>' + 'rssi: ' + beacon.rssi + '<br />' + 'proximity: ' + beacon.proximity);

                // iBeaconとの距離が「すごく近い」場合、バイブレーションを鳴らす
                // TODO 天気予報APIたたいて、降水確率がしきい値以上だったら鳴らす
                // →朝4時とかに定期的に叩くのでも良いかも…。
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
