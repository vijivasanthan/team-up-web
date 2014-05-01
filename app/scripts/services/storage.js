define(
	['services/services', 'config'],
	function (services, config)
	{
		'use strict';

		services.factory(
			'Storage', [
				'$rootScope',
				function ($rootScope)
				{
					if (config.app.title.substr(- 1) !== '.')
					{
						config.app.title = ! ! config.app.title ? config.app.title + '.' : '';
					}

					var browserSupportsLocalStorage = function ()
					{
						try
						{
							return ('localStorage' in window && window['localStorage'] !== null);
						}
						catch (e)
						{
							return false;
						}
					};

					var addToLocalStorage = function (key, value)
					{
						if (! browserSupportsLocalStorage()) return false;

						if (! value && value !== 0 && value !== "") return false;

						try
						{
							localStorage.setItem(config.app.title + key, value);
						}
						catch (e)
						{
							return false;
						}

						return true;
					};

					var getFromLocalStorage = function (key)
					{
						if (! browserSupportsLocalStorage()) return false;

						var item = localStorage.getItem(config.app.title + key);

						if (! item) return null;

						return item;
					};

					var removeFromLocalStorage = function (key)
					{
						if (! browserSupportsLocalStorage()) return false;

						try
						{
							localStorage.removeItem(config.app.title + key);
						}
						catch (e)
						{
							return false;
						}

						return true;
					};

					var clearAllFromLocalStorage = function ()
					{
						if (! browserSupportsLocalStorage()) return false;

						var prefixLength = config.app.title.length;

						for (var key in localStorage)
						{
							if (key.substr(0, prefixLength) === config.app.title)
							{
								try
								{
									removeFromLocalStorage(key.substr(prefixLength));
								}
								catch (e)
								{
									return false;
								}
							}
						}

						return true;
					};

					var browserSupportsSessionStorage = function ()
					{
						try
						{
							return (
								'sessionStorage' in window && window['sessionStorage'] !== null);
						}
						catch (e)
						{
							return false;
						}
					};

					var addToSessionStorage = function (key, value)
					{
						if (! browserSupportsSessionStorage()) return false;

						if (! value && value !== 0 && value !== "") return false;

						try
						{
							sessionStorage.setItem(config.app.title + key, value);
						}
						catch (e)
						{
							return false;
						}

						return true;
					};

					var getFromSessionStorage = function (key)
					{
						if (! browserSupportsSessionStorage()) return false;

						var item = sessionStorage.getItem(config.app.title + key);

						if (! item) return null;

						return item;
					};

					var removeFromSessionStorage = function (key)
					{
						if (! browserSupportsSessionStorage()) return false;

						try
						{
							sessionStorage.removeItem(config.app.title + key);
						}
						catch (e)
						{
							return false;
						}

						return true;
					};

					var clearAllFromSessionStorage = function ()
					{
						if (! browserSupportsSessionStorage()) return false;

						var prefixLength = config.app.title.length;

						for (var key in sessionStorage)
						{
							if (key.substr(0, prefixLength) === config.app.title)
							{
								try
								{
									removeFromSessionStorage(key.substr(prefixLength));
								}
								catch (e)
								{
									return false;
								}
							}
						}

						return true;
					};

					var browserSupportsCookies = function ()
					{
						try
						{
							return navigator.cookieEnabled ||
							       ("cookie" in document &&
							        (document.cookie.length > 0 ||
							         (document.cookie = "test").indexOf.call(document.cookie, "test") > - 1)
								       );
						}
						catch (e)
						{
							return false;
						}
					};

					var addToCookies = function (key, value)
					{
						if (typeof value == "undefined") return false;

						if (! browserSupportsCookies())  return false;

						try
						{
							var expiry = '',
							    expiryDate = new Date();

							if (value === null)
							{
								config.app.cookie.expiry = - 1;

								value = '';
							}

							if (config.app.cookie.expiry !== 0)
							{
								expiryDate.setTime(
										expiryDate.getTime() + (
										config.app.cookie.expiry * 60 * 60 * 1000));

								expiry = "; expires=" + expiryDate.toGMTString();
							}

							document.cookie = config.app.title +
							                  key +
							                  "=" +
							                  value +
							                  expiry +
							                  "; path=" +
							                  config.app.cookie.path;
						}
						catch (e)
						{
							return false;
						}

						return true;
					};

					var getFromCookies = function (key)
					{
						if (! browserSupportsCookies())
						{
							$rootScope.$broadcast('StorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
							return false;
						}

						var cookies = document.cookie.split(';');

						for (var i = 0; i < cookies.length; i ++)
						{
							var thisCookie = cookies[i];

							while (thisCookie.charAt(0) == ' ')
								thisCookie = thisCookie.substring(1, thisCookie.length);

							if (thisCookie.indexOf(config.app.title + key + '=') == 0)
							{
								return decodeURIComponent(thisCookie.substring(config.app.title.length + key.length + 1, thisCookie.length));
							}
						}

						return null;
					};

					var removeFromCookies = function (key) { addToCookies(key, null) };

					var clearAllFromCookies = function ()
					{
						var thisCookie = null,
						    thisKey = null,
						    prefixLength = config.app.title.length,
						    cookies = document.cookie.split(';');

						for (var i = 0; i < cookies.length; i ++)
						{
							var key;

							thisCookie = cookies[i];

							while (thisCookie.charAt(0) == ' ')
								thisCookie = thisCookie.substring(1, thisCookie.length);

							key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));

							removeFromCookies(key);
						}
					};

					var storageSize = function (key)
					{
						var item = (key) ? localStorage.key : localStorage;

						return ((3 + ((item.length * 16) / (8 * 1024))) * 0.0009765625).toPrecision(2) + ' MB';
					};

					var getPeriods = function () { return angular.fromJson(getFromLocalStorage('periods')) };

					var getGroups = function () { return angular.fromJson(getFromLocalStorage('groups')) };

					var getMembers = function () { return angular.fromJson(getFromLocalStorage('members')) };

					var getSettings = function ()
					{
						var settings = angular.fromJson(getFromLocalStorage('resources'));

						return (! settings.settingsWebPaige) ?
						       $rootScope.config.defaults.settingsWebPaige :
						       angular.fromJson(settings.settingsWebPaige);
					};

					var addAvatarURLtoStorage = function (id, avatarUrl)
					{
						var avatarUrls = angular.fromJson(getFromLocalStorage('avatarUrls'));

						if (avatarUrls)
						{
							angular.forEach(
								avatarUrls, function (item)
								{
									if (item.id == id)
									{
										item.url = avatarUrl;
									}
									else
									{
										var newItem = {'id': id, 'url': avatarUrl };
										avatarUrls.add(newItem);
									}
								});
						}
						else
						{
							avatarUrls = [
								{
									'id':  id,
									'url': avatarUrl
								}
							];
						}
						addToLocalStorage('avatarUrls', angular.toJson(avatarUrls));
					};

					var getAvatarURLFromStorage = function (id)
					{
						var avatarUrls = angular.fromJson(getFromLocalStorage('avatarUrls'));
						var ret;

						if (avatarUrls)
						{
							angular.forEach(
								avatarUrls, function (item)
								{
									if (item.id == id)
									{
										ret = item.url;
									}
								});
						}

						return ret;
					};

					return {
						isSupported: browserSupportsLocalStorage,
						add:         addToLocalStorage,
						get:         getFromLocalStorage,
						remove:      removeFromLocalStorage,
						clearAll:    clearAllFromLocalStorage,
						session:     {
							add:      addToSessionStorage,
							get:      getFromSessionStorage,
							remove:   removeFromSessionStorage,
							clearAll: clearAllFromSessionStorage
						},
						cookie:      {
							add:      addToCookies,
							get:      getFromCookies,
							remove:   removeFromCookies,
							clearAll: clearAllFromCookies
						},
						size:        storageSize,
						local:       {
							periods:  getPeriods,
							groups:   getGroups,
							members:  getMembers,
							settings: getSettings
						},
						avatar:      {
							addurl: addAvatarURLtoStorage,
							geturl: getAvatarURLFromStorage
						}
					}
				}
			]);
	}
);