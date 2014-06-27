(function(){
	'use strict';
	var app = angular.module('myApp', ['onsen.directives']);
	var WEATHER_API = "http://openweathermap.org/data/2.0/weather/city/__CITY_ID__?callback=JSON_CALLBACK";

	/**
	 * コントロール
	 */
	// お天気表示画面
	app.controller('weatherController', ['$scope', '$http', 'weatherService', function ($scope, $http, weatherService) {

		$scope.notice = "傘もってけ！";
		$scope.place = "Tokyo, JP";
		$scope.temp = "28";
		$scope.prec = "30";
		$scope.url = "http://www.google.co.jp";
		$scope.cityId = "1850147";
		
		// リロードボタン
		$scope.reload = function(){
			// TODO ぐるぐるローディングを出す
			// 天気情報をげっと
			weatherService.getWeatherInfo($scope.cityId)
				.success(function(response) {
					$scope.resdata = response;
					// 天気の表示によって変更
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
	}]);

})();
