var app = angular.module( "main", [] );

/* init */
app.run( function() {
  
});


// create main controller
function mainCtrl( $scope, ajaxService ) {
  
  // api token
  $scope.token = "6e17924deb9b769d7b15b5085d7a7b1a";
  
  // part 2 of the code2040 app, reverse a string
  $scope.part2 = {
    
    // the url to get the string from
    get_string_url: "http://challenge.code2040.org/api/reverse",
    
    // the url to send the string to
    validate_string_url: "http://challenge.code2040.org/api/reverse/validate",
    
    // request header
    header: { "content-type": "application/json" },
    
    // the string to reverse
    string: "race car",
    
    // the reversed string
    rstring: "",
    
    // responses from ajax calls
    response: "",
    
    // get the string to reverse
    getString: function() {
      // server expects json
      var data = JSON.stringify( {
        token: $scope.token 
      } );
      
      ajaxService.request( 
        "POST",
        this.get_string_url,
        data,
        this.header,
        function( response ) {
          $scope.part2.string = response.data;
        }
      )
    },
    
    // reverse the string and update this object
    reverseString: function() {
      this.rstring = reverseString( this.string );
    },
    
    // send reversed string to server for validation
    sendString: function() {
      this.reverseString();
      
      // server expects json
      var data = JSON.stringify( {
        token: $scope.token,
        string: this.rstring
      } );
      
      ajaxService.request( 
        "POST",
        this.validate_string_url,
        data,
        this.header,
        function( response ) {
          $scope.part2.response = response.data;
        }
      )
    }
  };
  
}
app.controller( "mainCtrl", mainCtrl );

// this function does the actual string reversal
// @param str string string to reverse
// @return reversed string
function reverseString( str ) {
  var rstr = "";
  for( var n=str.length-1; n >= 0; n-- )
    rstr += str[n];
  
  return rstr;
} 

// setup service to make ajax calls with
function ajaxService ( $http, $location ) {
 
 return ({
   
   request: function( method, url, data, headers, onSuccess, onFail ) {
     
    if( headers === undefined ) {
      if( method == "post" || method == "POST" )
        headers = { "Content-Type": "application/x-www-form-urlencoded" };
    }
    
    if( onSuccess === undefined )
      onSuccess = ajaxSuccess;
      
    if( onFail === undefined )
      onFail = ajaxFail;
     
    var request = $http({
      method: method,
      url: url,
      data: data,
      headers: headers
    });
    
    request.then( onSuccess, onFail );
    
   }
   
 })
  
}

// dafault ajax request success handler
function ajaxSuccess( data, status, headers, config ) {
  console.log( "ajaxSuccess: ", data, status, headers, config );
}

// default ajax request fail handler
function ajaxFail( data, status, headers, config ) {
  console.error( "ajaxFail: ", data, status, headers, config );
}

// add service to app
app.service( "ajaxService", ajaxService );