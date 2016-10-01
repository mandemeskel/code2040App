var app = angular.module( "main", [] );
var TOKEN = "6e17924deb9b769d7b15b5085d7a7b1a";

/* init */
app.run( function() {
  
});


// create main controller
function mainCtrl( $scope, ajaxService, problemFactory ) {
  
  // api token
  $scope.token = "6e17924deb9b769d7b15b5085d7a7b1a";
  
  // problems array, used in index.html to create UI for each problem
  $scope.problems = [];
  
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
  
  // create Problem class to solve problem 2
  $scope.part2b = new problemFactory( 
    "http://challenge.code2040.org/api/reverse",
    "http://challenge.code2040.org/api/reverse/validate",
    function() {
      $scope.part2b.solution = reverseString( $scope.part2b.problem );
    },
    function() {
      $scope.part2b.setData( {
                      token: TOKEN,
                      string: $scope.part2b.solution 
                    } );
    }
  );
  
  // setup problem 3
  var problem3 = new problemFactory(
    "http://challenge.code2040.org/api/haystack",
    "http://challenge.code2040.org/api/haystack/validate",
    function() {
      problem3.solution = findNeedle( 
        problem3.problem.needle, 
        problem3.problem.haystack );
    },
    function() {
      problem3.setData( {
                         token: TOKEN,
                         needle: problem3.solution
                      } );
    }
  );
  
  // add to problems array to dispaly UI
  $scope.problems.push( $scope.part2b );
  $scope.problems.push( problem3 );
  
}
app.controller( "mainCtrl", mainCtrl );

// this function does the actual string reversal
// @param str string string to reverse
// @return reversed string
function reverseString( str ) {
  var rstr = "";
  for( let n=str.length-1; n >= 0; n-- )
    rstr += str[n];
  
  return rstr;
} 

// look for the needle in the haystack, problem 3
function findNeedle( needle, haystack ) {
  var len = haystack.length;
  
  for( let n=0; n < len; n++  )
    if( needle == haystack[n] ) return n;
}


// the angular factory will use to create problem objects
app.factory( "problemFactory", function( ajaxService ) {
  
  // the problem class
  // @param data_url string the url tog et the problem from
  // @param validate_url string the url to send the validate solution request to
  // @param mainFn function function that actually solves the problem
  // @param beforeSendRequest function called before a validate request is sent
  function Problem( data_url, validate_url, mainFn, beforeSendRequest ) {
    
    this.data_url = data_url;
    this.validater_url = validate_url;
    this.data = "";
    this.header = { "content-type": "application/json" };
    this.response = "";
    this.problem = undefined;
    this.solution = undefined;
    
    // function that actually solves the problem
    this.mainFn = mainFn;
    
    // the funciton that handles and saves the problem we recieve from code2040
    this.recieveData = function() {
      var obj = this;
      return function( response ) {
        obj.problem = response.data;
      }
    };
    
    // this.beforeGetRequest = beforeGetRequest;
    // called before a validate request is sent, expected to setup data with
    // the right parameters
    this.beforeSendRequest = beforeSendRequest;
    
    // closure that handles succesful response from call to validate_url
    // @param obj object the object to saves the response data to
    // @return function returns a function that sets obj.reponse to response.data
    this.onValidated = function( obj ) {
      return function( response ) {
        obj.response = response.data;
      }
    };
    
    // set the data by JSON stringifying passed data
    // @param data object data to JSOn stringify and save to this object
    this.setData = function( data ) {
      this.data = JSON.stringify( data );
    }
    
    // requests the problem from the server i.e. calls data_url
    this.getData = function( ) {
      
      this.setData( {
                    token: TOKEN
                  } );
      
      ajaxService.request( 
        "POST",
        this.data_url,
        this.data,
        this.header,
        this.recieveData()
      )
      
    };
    
    // validates the solution i.e. calls validate_url
    // @call_main_fn bool is true calls mainFn function to solve the problem
    this.validateSolution = function( call_main_fn ) {
      
      if( this.beforeSendRequest )
        this.beforeSendRequest();
      
      // this.setData( {
      //   token: TOKEN,
      //   string: this.solution
      // } );
      
      if( call_main_fn )
        this.mainFn();
    
      ajaxService.request( 
        "POST",
        this.validater_url,
        this.data,
        this.header,
        this.onValidated( this )
      )
      
    };
    
  }
  
  return Problem;
  
} );



// setup service to make ajax calls with
function ajaxService( $http, $location ) {
 
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
app.factory( "ajaxService", ajaxService );