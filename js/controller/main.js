app.controller('extraCtrl', function($scope, $http, global, $modal) {
	var file;
	var url;
	var dataObj;
     $scope.submit = function ($event) {
     	var formData = new FormData();
       
		formData.append('file', file);
     	dataObj = {
			yourName : $scope.yourName,
			email : $scope.email,
			contactNo : $scope.contactNo,
			localAddress : $scope.localAddress,
			profession : $scope.profession,
			image : file,
			zip : $scope.zip,
			country : $scope.country,
			state : $scope.state,
			district : $scope.district,
			password : $scope.password,
			confirmPassword : $scope.confirmPassword,
			id : $scope.id
		},
		url = '/updateProfile';
		global.sendRequest(url,
			dataObj,
			'POST',
			function (data, status, headers, config){
				alert('success');
			},
			function (data, status, headers, config) {
				console.log('error');
			});
    };
 
    $scope.uploadFile = function(files) {
    	file = files[0];
    }

});
app.controller('searchCtrl', function($scope, $http, global, $filter) {
	$scope.filter = {};
	
	global.list = countryCity.list;
	$scope.countryClick = function(value) {
    	//$scope.filter.searchCountry = '';
    	if (global.completeFilter.Country.indexOf(value) < 0) {
    		global.completeFilter.Country.push(value);
    	}
    };
    $scope.cityClick = function(value) {
    	if (global.completeFilter.District.indexOf(value) < 0) {
    		global.completeFilter.District.push(value);
    		$scope.filterPeople();
    	}
    };
    $scope.filterPeople = function() {
    	global.sendRequest('/filterPeople',
			global.completeFilter,
			'POST',
			function (data, status, headers, config){
				global.peopleListBackUp = data;
                global.peopleList = global.getPaination(data);
			},
			function (data, status, headers, config) {
				console.log('error');
			});
    }
   /* $scope.cityFilter = function(value) {
  	 	//$scope.countryCityList = $filter('filter')($scope.arr, value);
    };
     $scope.checkProperCountryState = function(value, dec) {
     	var val = value ? value.substr(0, 1).toUpperCase() + value.substr(1) : undefined,
     		msg = dec === 'country' ? commonMsg.alert_country_search : commonMsg.alert_District_search,
     		url;
     	if (val && val.length) {
     		if ((dec === 'country' && global.countryList.indexOf(val) < 0) || (dec === 'city' && $scope.arr.indexOf(val) < 0)) {
	     		global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: msg});
	     	} else {
	     		if (dec === 'country') {
	     			$scope.countryClick(val);
	     		} else {
	     			url = '/getPeopleListBasedOnCity?country=' + $scope.filter.searchCountry + '&district=' + val;
	     			global.sendRequest(url,
						undefined,
						'GET',
						function (data, status, headers, config){
							global.peopleList = [];
							global.peopleList = data;
							global.currentPage = 0;
						},
						function (data, status, headers, config) {
							console.log('error');
					});
		     		$scope.cityClick(val);
		     	}
	     	}
     	}
     	
    };*/
    $scope.hideSearchBox = {};
    $scope.hideSearchBox['profession'] = true;
    $scope.hideSearchBox['skills'] = true;
    $scope.hideSearchBox['countryFlag'] = true;
    $scope.hideSearchBox['cityFlag'] = true;
    setTimeout(function(){ global.b = 'omkjksjdjo889367262877l'; }, 10000);
    $scope.setProfession = function (profession) {
    	if (global.completeFilter.Profession.indexOf(profession) < 0) {
    		global.completeFilter.Profession.push(profession);
    		$scope.filterPeople();
    	}
    	//$scope.searchProfession = '';
    	$scope.skillProfession = profession;
    };
    $scope.closeSearchBox = function (value) {
    	$scope.hideSearchBox[value] = true;
    }
    $scope.setSkills = function (skills) {
    	if (global.completeFilter.Skills.indexOf(skills) < 0) {
    		global.completeFilter.Skills.push(skills);
    		$scope.filterPeople();
    	}
    	//$scope.searchSkills = '';
    };
    $scope.setGender = function (value, gender) {
    	var sex = global.completeFilter['Gender'];
    	if (value) {
    		sex[0] = gender;
    	} else {
    		global.completeFilter['Gender'] = [];
    	}
    	$scope.filterPeople();
    	$scope.filter[gender === 'Female' ? 'Male' : 'Female'] = false;
    }
    $scope.hideOnBlur = {};
    $scope.hideFun = function(basis, evt) {
        if (evt === 'blur' && !$scope.hideOnBlur[basis]) {
            $scope.hideSearchBox[basis] = !$scope.hideOnBlur[basis];
        } else if (evt === 'down') {
            $scope.hideOnBlur[basis] = true;
        } else {
            $scope.hideOnBlur[basis] = false;
        }
    }
    $scope.loadMore = function() {
        global.itemsLimit += 50;
    }
});
