(function () {
    'use strict';

    var app = angular.module('myApp', ['onsen.directives', 'ngTouch']);

    var dialogOpenFlg = false;

    // TODO constantsにする
    var fiveMinutes = 1000 * 60 * 5;

    /**
     * iBeacon関連サービス
     */
    app.factory('beaconService', function ($rootScope) {
        ibeacon.identifier = 'with-umbrella';
        var self = this;

        return {
            setupFlg: false,
            startRangingBeaconsInRegion: function ($scope, didRangeBeaconsCallback) {
                console.log('call startRangingBeaconsInRegion');

                this.setupFlg = true;

                var region = this.region = new ibeacon.Region({
                    uuid: $scope.setting.uuid
                });

                ibeacon.startRangingBeaconsInRegion({
                    region: region,
                    didRangeBeacons: function (result) {
                        console.log('call didRangeBeacons');
                        console.log(JSON.stringify(result));

                        var beacon = result.beacons[0];

                        if (!beacon) {
                            return;
                        }

                        didRangeBeaconsCallback(beacon);
                    }
                });
            },
            stopRangingBeaconsInRegion: function () {
                this.setupFlg = false;
                ibeacon.stopRangingBeaconsInRegion({
                    region: this.region
                });
            }
        };
    });

    /**
     * 設定画面のコントローラ
     */
    app.controller('SettingCtrl', function ($scope, beaconService, weatherService) {
        console.log('SettingCtrl');
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

        if (!beaconService.setupFlg) {
            beaconService.startRangingBeaconsInRegion($scope, function (beacon) {
                setupRainyNotification(beacon, $scope, weatherService);
            });
        }

        // 設定をリセットする
        $scope.reset = function () {
            localStorage.setItem('setting', JSON.stringify(defaultSettingJson));
            $scope.setting = defaultSettingJson;
        };

        // 設定を保存する
        $scope.save = function (setting) {
            localStorage.setItem('setting', JSON.stringify(angular.copy(setting)));
            beaconService.stopRangingBeaconsInRegion();
            beaconService.startRangingBeaconsInRegion($scope, function (beacon) {
                setupRainyNotification(beacon, $scope, weatherService);
            });
        };
    });

    var WEATHER_API = "http://openweathermap.org/data/2.5/weather?id=__CITY_ID__&callback=JSON_CALLBACK";
    var WEATHER_LOCATION_API = "http://openweathermap.org/data/2.5/find?lat=__LAT__&lon=__LON__&cnt=1&callback=JSON_CALLBACK";
    var CELSIUS_NUM = 273.15;
    var WEATHER_IMG_PATH = "svg/weather/__ICON_ID__.svg";

    /**
     * コントロール
     */
        // お天気表示画面
    app.controller('weatherController', ['$scope', '$http', 'weatherService', function ($scope, $http, weatherService) {

        // リロードボタン
        $scope.reload = function () {
            console.log('#### reload!');

            $scope.place = "--";
            $scope.temp = "--";
            $scope.rain = "--";
            $scope.iconPath = "";
            $scope.notice = "loading...";
            $scope.loading = true;
            $scope.bgcolor = "cloud";

            // 天気情報をげっと
            weatherService.getWeatherInfoByLocation($scope,
                function (wetherInfoResponse) {
                    console.log('wetherInfoResponse: ', wetherInfoResponse);
                    var $info = weatherService.loadWeatherInfo(wetherInfoResponse.list[0]);
                    $scope.place = $info.name + " - " + $info.date;
                    $scope.temp = $info.temp;
                    $scope.rain = $info.rain;
                    if ($info.iconPath) {
                        $scope.iconPath = $info.iconPath;
                    }
                    if ($scope.rain > 0) {
                        $scope.notice = "雨だよ！傘もった？";
                    } else {
                        $scope.notice = "現在のお天気";
                    }

                    $scope.bgcolor = changeColor($scope.iconPath);

                    // ローディング終了
                    $scope.loading = false;
                });
        };

        // 画面色チェンジ
        var changeColor = (function ($iconPath) {
            if (!$iconPath) {
                return 'cloud';
            }
            var $iconId = $iconPath.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
            switch ($iconId) {
                case '01d':
                case '02d':
                    return 'fine_d';
                case '01n':
                case '02n':
                    return 'fine_n';
                case '09d':
                case '09n':
                case '10d':
                case '10n':
                    return 'rain';
                default:
                    return 'cloud';
            }
            return 'cloud';
        });

        // 初期表示時用
        $scope.reload();

    }]);

    /**
     * お天気API関連のService
     */
    app.service('weatherService', ['$http', function ($http) {
        // 天気APIをコール（緯度経度）
        this.getWeatherInfoByLocation = function ($scope, callback) {
            var weatherData = localStorage.getItem('weatherData');

            // 前回コール時から5分経過していたら、APIをコールする
            if (!weatherData || new Date().getTime() - weatherData.time > fiveMinutes) {
                // 現在のロケーションを取得する
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;

                    console.log('geolocation: ', position);

                    var url = WEATHER_LOCATION_API.replace('__LAT__', lat).replace('__LON__', lon);

                    // データ取得
                    var response = $http.jsonp(url);

                    response.success(function (response) {
                        console.log('api response: ', response);
                        localStorage.setItem('weatherData', JSON.stringify({time: new Date().getTime(), data: response}));
                        callback(response);
                    });

                    response.error(function (xhr) {
                        console.log('api call error:', xhr);
                    });
                });

                // 前回コール時から5分以内であれば、前回取得時のデータを返却する
            } else {
                console.log('cache response: ', JSON.parse(weatherData).data);
                callback(JSON.parse(weatherData).data);

                if (!$scope.$$phase) {
                    $scope.$apply(callback);
                }
            }
        };

        // 天気予報を表示用に加工
        this.loadWeatherInfo = function ($info) {
            if (!$info) {
                return null;
            }
            ;
            var now = new Date();

            var $ret = {};
            $ret.name = $info.name;
            $ret.date = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
            $ret.temp = Math.round($info.main.temp - CELSIUS_NUM);
            if ("rain" in $info) {
                $ret.rain = $info.rain['3h'];
            }
            if ("weather" in $info) {
                // とりあえず1件目
                $ret.iconId = $info.weather[0].icon;
                if ($ret.iconId) {
                    $ret.iconPath = WEATHER_IMG_PATH.replace("__ICON_ID__", $ret.iconId);
                }
            }
            if ("snow" in $info) {
                $ret.snow = $info.snow['3h'];
            }

            return $ret;
        };
    }]);

    /**
     * iBeaconが検知できた時に行う処理を定義する
     *
     * @param beacon 検知したiBeaconの情報
     * @param $scope $scopeオブジェクト
     */
    function setupRainyNotification(beacon, $scope, weatherService) {
        // 検知したiBeaconからの距離が通知範囲でなかった場合、以降の処理を行わない
        switch (beacon.proximity) {
            case 'far':
                // 通知範囲設定が『far』の時のみ通知するため、『far』以外の場合は以降の処理を行わない
                if ($scope.setting.proximity !== beacon.proximity) {
                    return;
                }
                break;
            case 'near':
                // 通知範囲設定が『far』『near』の場合に通知するため、『immediate』の場合は以降の処理を行わない
                if ($scope.setting.proximity == 'immediate') {
                    return;
                }
                break;
            case 'immediate':
                // 通知範囲設定が『far』『near』『immediate』いずれの場合も通知するため、特に判定処理を行わない
                break;
            // 上記以外の場合は以降の処理を行わない
            default :
                return;
        }

        // 通知ダイアログが表示されている場合、以降の処理を行わない
        if (dialogOpenFlg) {
            return;
        }

        // 前回の通知停止時刻
        var stoppedTime = localStorage.getItem('stoppedTime');

        // 前回の通知停止時刻から5分以内であれば、以降の処理を行わない
        if (stoppedTime && new Date().getTime() - stoppedTime <= fiveMinutes) {
            return;
        }

        weatherService.getWeatherInfoByLocation($scope, function (response) {
            console.log('getWeatherInfoByLocation response: ', response);
            var currentWeather = response.list[0].weather[0].main;

            if (currentWeather == 'Rain') {
                dialogOpenFlg = true;
                navigator.notification.vibrate(1000 * 60);
                navigator.notification.confirm('傘をお忘れなく！', function (buttonIndex) {
                    navigator.notification.cancelVibration();
                    localStorage.setItem('stoppedTime', new Date().getTime());
                    dialogOpenFlg = false;
                }, '雨です！傘を忘れずに！！', ['OK']);
            }
        });
    }

    document.addEventListener('deviceready', function () {
        console.log('### deviceready');
        angular.bootstrap(document, ['myApp']);
    }, false);
})
();
