(function(){
	'use strict';
	var app = angular.module('myApp', ['onsen.directives']);
//	var WEATHER_API = "http://openweathermap.org/data/2.0/weather/city/__CITY_ID__?callback=JSON_CALLBACK";
	var WEATHER_API = "http://openweathermap.org/data/2.5/weather?id=__CITY_ID__&callback=JSON_CALLBACK";
	var CELSIUS_NUM = 273.15;

	/**
	 * コントロール
	 */
	// お天気表示画面
	app.controller('weatherController', ['$scope', '$http', 'weatherService', function ($scope, $http, weatherService) {

		// TODO 設定ファイルから場所のIDを取得
		$scope.cityId = "1850147";

		$scope.notice = "ローディング中…";
//		$scope.place = "--";
//		$scope.temp = "--";
//		$scope.prec = "--";
		
		// リロードボタン
		$scope.reload = function(){
			// TODO ぐるぐるローディングを出す
			// 天気情報をげっと
			weatherService.getWeatherInfo($scope.cityId)
				.success(function(response) {
console.log(response);
					var $info = weatherService.loadWeatherInfo(response);
console.log($info);
					$scope.place = $info.name + " - " + $info.date;
					$scope.temp = $info.temp;
					$scope.rain = $info.rain;
					
				})
				.error(function(response) {
					alert("error!");
				});
		};

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
			$ret.temp = Math.round($info.main.temp - CELSIUS_NUM);	// セルシウスに変換
			$ret.rain = $info.rain;
			if( $info.snow ){
				$ret.snow = $info.snow;
			}
			return $ret;
		};

		var getWeatherIcon = function( $rain, $iconId ){
			if( $iconId in ICON_LIST ){
				
			}
			// 該当アイコンがない場合、降水量が0より大きいなら雨
			if( $rain > 0 ){
				return WEATHER_IMG_RAIN;
			}
			// ここまできたらわからん

		};

/*		var ICON_LIST = {
			"09d" : WEATHER_IMG_RAIN
		
		};
*/
	}]);


})();
