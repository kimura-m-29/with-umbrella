(function () {
    'use strict';

    var app = angular.module('myApp', ['onsen.directives', 'ngTouch']);

    app.factory('beaconService', function ($rootScope) {
        ibeacon.identifier = 'with-umbrella';
        var self = this;

        return {
            startRangingBeaconsInRegion: function ($scope) {
                var dialogOpenFlg = false;
                ibeacon.startRangingBeaconsInRegion({
                    region: new ibeacon.Region({
                        uuid: $scope.setting.uuid
                    }),
                    didRangeBeacons: function (result) {
                        console.log(JSON.stringify(result));
                        var beacon = result.beacons[0];

                        if (!beacon) {
                            return;
                        }

                        var stoppedTime = localStorage.getItem('stoppedTime');
                        var tenminuitesMs = 1000 * 60 * 10;

                        if (beacon.proximity == $scope.setting.proximity && !dialogOpenFlg && (!stoppedTime || new Date().getTime() - stoppedTime > tenminuitesMs)) {
                            dialogOpenFlg = true;
                            navigator.notification.vibrate(1000);
                            navigator.notification.confirm('雨が降ります！傘をお忘れなく！', function (buttonIndex) {
                                navigator.notification.cancelVibration();
                                localStorage.setItem('stoppedTime', new Date().getTime());
                                dialogOpenFlg = false;
                            }, '傘を忘れずに！！', ['OK']);
                        }
                    }
                });
            }
        };
    });

    /**
     * 設定画面のコントローラ
     */
    app.controller('SettingCtrl', function ($scope, beaconService) {
        var setting = localStorage.getItem('setting');
        var defaultSettingJson = {
            uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
            proximity: 'near',
            area: '13'
        };

        if (setting) {
            var settingJson = JSON.parse(setting);
            $scope.setting = settingJson;
        } else {
            $scope.setting = defaultSettingJson;
        }

        beaconService.startRangingBeaconsInRegion($scope);

        // 設定をリセットする
        $scope.reset = function () {
            localStorage.setItem('setting', JSON.stringify(defaultSettingJson));
            $scope.setting = defaultSettingJson;
        };

        // 設定を保存する
        $scope.save = function (setting) {
            localStorage.setItem('setting', JSON.stringify(angular.copy(setting)));
        };
    });

    document.addEventListener('deviceready', function () {
        console.log('### deviceready');
        angular.bootstrap(document, ['myApp']);
    }, false);
})
();
