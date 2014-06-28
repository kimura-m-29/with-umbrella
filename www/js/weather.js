(function(){
	'use strict';
	var app = angular.module('myApp', ['onsen.directives']);

	var WEATHER_API = "http://openweathermap.org/data/2.5/weather?id=__CITY_ID__&callback=JSON_CALLBACK";
	var CELSIUS_NUM = 273.15;
	var WEATHER_IMG_PATH = "svg/weather/__ICON_ID__.svg";

	/**
	 * コントロール
	 */
	// お天気表示画面
	app.controller('weatherController', ['$scope', '$http', 'weatherService', function ($scope, $http, weatherService) {

		// TODO 設定ファイルから場所のIDを取得
		$scope.cityId = "1850147";

		
		// リロードボタン
		$scope.reload = function(){

			$scope.place = "--";
			$scope.temp = "--";
			$scope.rain = "--";
			$scope.color="default";
			$scope.iconPath = "";
			$scope.loading = true;

			// 天気情報をげっと
			weatherService.getWeatherInfo($scope.cityId)
				.success(function(response) {
					var $info = weatherService.loadWeatherInfo(response);
console.log(response);
					$scope.place = $info.name + " - " + $info.date;
					$scope.temp = $info.temp;
					$scope.rain = $info.rain;
					$scope.colorClass = $info.color;
					if( $info.iconPath ){
						$scope.iconPath = $info.iconPath;
					}
					if( $scope.rain > 0 ){
						$scope.notice = "傘もってけ！";
					}else{
						$scope.notice = "";
					}
console.log($info);
					// ローディング終了
					$scope.loading = false;
					
				})
				.error(function(response) {
					alert("error!");
				});
		};

		var changeWeather = (function(){
			
		});

		// 初期表示時用
		$scope.reload();

	}]);

	/**
	 * お天気API関連のService
	 */
	app.service('weatherService', ['$http', function($http){

		// 天気APIをコール
		this.getWeatherInfo = function( $cityId ){
			if( !$cityId ){
				alert("no cityId");
				return;
			}
			var url = WEATHER_API.replace('__CITY_ID__', $cityId);
			// データ取得
			return $http.jsonp(url);
		};

		// 天気予報を表示用に加工
		this.loadWeatherInfo = function( $info ){
			if( !$info ){
				return null;
			};
			var now = new Date();

			var $ret = {};
			$ret.name = $info.name;
			$ret.date = now.getFullYear() + "/" + (now.getMonth()+1) + "/" + now.getDate();
			$ret.temp = Math.round($info.main.temp - CELSIUS_NUM);
			if( "rain" in $info ){
				$ret.rain = $info.rain;
			}
			if( "weather" in $info ){
				// とりあえず1件目
				$ret.iconId = $info.weather[0].icon;
				if( $ret.iconId ){
					$ret.iconPath = WEATHER_IMG_PATH.replace("__ICON_ID__",$ret.iconId);
				}
			}
			if( "snow" in $info ){
				$ret.snow = $info.snow;
			}

			$ret.color = "def";
			
			
			return $ret;
		};

		var decideColor = function( $iconId ){
			
		};



	}]);


})();
