
    var hidePasswordError = function () {
        document.getElementById("passwordError").style.display = 'none';
    };

    var showEmailNotFoundError = function () {
        document.getElementById("emailSignInNotFoundError").style.display = 'block';
    };

    var hideEmailNotFoundError = function () {
        document.getElementById("emailSignInNotFoundError").style.display = 'none';    
    };

    var hideAllErrors = function () {
        hidePasswordError();
        hideEmailNotFoundError();
        var allErrors = document.getElementsByClassName("error");
        for (var i = 0; i < allErrors.length; i++) {
            record = allErrors[i];
            record.style.display = 'none';
        }
    };

    var displayPasswordError = function () {
        document.getElementById("passwordError").style.display = 'block';
    };


    var showSpinner = function() {
    //            document.getElementById("spinner").innerHTML = spinner;
        document.getElementById("spinner").style.display = 'block';
    }

    var showSpinnerMessage = function() {
        document.getElementById("spinnermessage").style.display = 'block';
    }

    var hideSpinnerMessage = function() {
        document.getElementById("spinnermessage").style.display = 'none';
    }

    var setSpinnerMessage = function(string) {
        var beginning = '<div style="background-color:white;border:1px solid white; border-radius: 12px">';
        var end = "</div>";
        var all = beginning + string + end;
        document.getElementById("spinnermessage").innerHTML = all;    
    }

    var spinnerOk = function() {
        document.getElementById("spinner").innerHTML = okeydoke;
    }

    var spinnerOhNo = function() {
        document.getElementById("spinner").innerHTML = ohno;
    }

    var spinnerHide = function() {
        document.getElementById("spinner").style.display = "none";
    }
    var email, name, sponsorcode, pin;

    var sponsorDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/taskmastersponsors');

    var userDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/taskmasterusers');

    var localusers = {};
    var spinner = '<div style="padding:40px;"><img src="../img/Vector_Loading_fallback.gif" alt=""><br><br></div>';
    var spinnermessage = document.getElementById("spinnermessage");
    var okeydoke = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGHO8tBkyWagQ99D6YQIvTOBeIsMpbzUF0npUFP_JUf99yOFBawxbXQaVa" alt="">';
    var ohno = '<img src="http://www.thegatewaypundit.com/wp-content/uploads/2012/07/mr-bill.jpg" alt="" width="200">';

    // check if email the user entered is in our database (do this even if they
    // are signing up. Don't want to duplicate a user.)
    var userDatabase = [];
    var userExists = false;
    var userRecord = {};
    var sponsorDatabase = [];
    var sponsorcodevalid = false;

    var signIn = function () {
        hideAllErrors();
        hideSignIn();
        showSpinner();
        showSpinnerMessage();
        setSpinnerMessage('Looking up account information...')
        var theEmail;
        var thePassword;
        if (document.getElementById("signinemail").value) { 
            theEmail = document.getElementById("signinemail").value;
            console.log('theEmail is: ' + theEmail);
        } else {
            theEmail = '';
        }

        thePassword = document.getElementById("signinpassword").value;
        if (thePassword.length > 0) {
            // do nothing
        } else {
            thePassword = '';
        }
        console.log('thePassword is ' + thePassword);
        checkSignInUserDB(theEmail,thePassword);
    }

    var resetPassword = function() {
        var theEmail = '';
        if (document.getElementById("resetpasswordemail")) {
            theEmail = document.getElementById("resetpasswordemail").value;
        }
        hideAllErrors();
        hideForgotPassword();
        checkPasswordResetUserDB(theEmail);
    }

    var showResettingPasswordMessage = function() {
        document.getElementById("resettingPasswordMessage").style.display = 'block';
    }

    var checkPassword = function(record, password) {
        var matches = false;
        if (record.password === password) {
            matches = true;
        }
        return matches;
    }

    var checkSponsorDB = function(sponsorcode) {
        console.log('starting to check sponsor db');
        showSpinner();
        setSpinnerMessage('Checking sponsor code...')
        sponsorDatabase = [];
        var theSponsorCode = sponsorcode.toLowerCase();
        sponsorDB.allDocs({include_docs:true}).then(function(result) {
            console.log('ok. we are on the then part');
            console.log('result.rows.length is: ' + result.rows.length);
            for (var i = 0; i < result.rows.length; i++) {
                sponsorDatabase.push(result.rows[i].doc);
                console.log('pushing a row');
            }
            for (var i = 0; i < sponsorDatabase.length; i++) {
                var record = sponsorDatabase[i];
                if (record.sponsorcode === theSponsorCode) {
                    sponsorcodevalid = true;
    //                        alert('SPONSORCODE IS VALID');
                    setSpinnerMessage('Sponsor code validated...');
                    setTimeout(function() {
                        setSpinnerMessage('Setting up device...');
                        setSignUpLocalStorageItems();
                    },1500);
                }
            }
            if (sponsorcodevalid){
    //                    alert('hooray! etc etc...');
            } else {
                spinnerHide();
                setSpinnerMessage('Unable to validate Sponsor code :(');
                showSponsorNotFoundError();
    //                    alert('boo! blah blah');
            }
            return sponsorcodevalid;
        });
    }

    var checkSignUpUserDB = function(email,sponsorcode) {
        userDatabase = [];
        userDB.allDocs({include_docs:true}).then(function(result) {
            for (var i = 0; i < result.rows.length; i++) {
                userDatabase.push(result.rows[i].doc);
            }
            for (var i = 0; i < userDatabase.length; i++) {
                var record = userDatabase[i];
                if (record.email === email) {
                    // USER EXISTS
                    userExists = true;
                    userRecord = record;
                }
            }
            if (userExists) {
                spinnerHide();
                hideSpinnerMessage();
                showUserExistsError();
                console.log('user exists already. user is ' + email);
                console.log('resetting user to not existing (for additional tries)');
                userExists = false;
            } else {
                // user does not exist. we can proceed with sign up...
                if(sponsorcode) {
                    console.log('sponsorcode is: ' + sponsorcode);
                    checkSponsorDB(sponsorcode);
                } else {
                    spinnerHide();
                    hideSpinnerMessage();
                    alert('signing in without a code...');
                    alert('so, yeah, put localstorage and stuff here.')
                }
            }
        });
    }

    var checkSignInUserDB = function(thisemail,thispassword) {
        userDatabase = [];
        console.log('getting all docs...');
        userDB.allDocs({include_docs:true}).then(function(result) {
            console.log('populating user database...');
            for (var i = 0; i < result.rows.length; i++) {
                userDatabase.push(result.rows[i].doc);
            }
            console.log('checking for user...')
            for (var i = 0; i < userDatabase.length; i++) {
                var record = userDatabase[i];
                console.log('record.email is ' + record.email);
                console.log('thisemail is ' + thisemail);
                var recordemailLC = record.email.toLowerCase();
                var thisemailLC = thisemail.toLowerCase();
                if (recordemailLC == thisemailLC) {
                    // USER EXISTS
                    console.log('found user!');
                    userExists = true;
                    userRecord = record;
                }
            }
            if (!userExists) {
                spinnerHide();
                hideSpinnerMessage();
                showEmailNotFoundError();
                showPasswordResetButton();
            } else {
                if(checkPassword(userRecord, thispassword)) {
    //                        spinnerHide();
                    setSpinnerMessage('Everything checks out. We are proceeding to launch.')
                    console.log('password matches! We are free to proceed!');
                    console.log('userRecord is: ');
                    console.log(userRecord);
                    setSignUpLocalStorageItemsFromRecord(userRecord);
                } else {
                    console.log('password does not match!');
                    spinnerHide();
                    hideSpinnerMessage();
                    showSignIn();
                    displayPasswordError();
                }
            }
        }).catch(function(err) {
    //                spinnerHide();
            setSpinnerMessage('Sorry - the sign in process had a problem. Please click the sign in button and try again. The error was: ' + err);
        });
    }

    var checkPasswordResetUserDB = function(thisemail) {
        showSpinner();
        setSpinnerMessage('Attempting to send password reset link...');
        showSpinnerMessage();
        userDatabase = [];
        userExists = false;
        console.log('getting all docs...');
        userDB.allDocs({include_docs:true}).then(function(result) {
            console.log('populating user database...');
            for (var i = 0; i < result.rows.length; i++) {
                userDatabase.push(result.rows[i].doc);
            }
            console.log('checking for user...')
            for (var i = 0; i < userDatabase.length; i++) {
                var record = userDatabase[i];
                console.log('record.email is ' + record.email);
                console.log('thisemail is ' + thisemail);
                var recordemailLC = record.email.toLowerCase();
                var thisemailLC = thisemail.toLowerCase();
                if (record.email === thisemail) {
                    // USER EXISTS
                    console.log('found user!');
                    userExists = true;
                    userRecord = record;
                }
            }
            if (!userExists) {
                spinnerHide();
                hideSpinnerMessage();
                showForgotPassword();
                showEmailNotFoundError();
            } else {
                spinnerHide();
                setSpinnerMessage('We have sent a password reset link to ' + thisemail + '. Click on the link in the email to create a new password, then come back and sign in![note: this functionality has not been implemented, so Bill needs to get it happening]');
            }
        }).catch(function(err) {
            setSpinnerMessage('Alarum! Alarum! Something went wrong. Please try again later.');
        })
    }

    var showUserExistsError = function() {
        document.getElementById("userexistserror").style.display = 'block';
    }

    var showSponsorNotFoundError = function() {
        document.getElementById("sponsornotfounderror").style.display = 'block';
    }

    var doSignUp = function() {
        var email1,email2,pword1,pword2,pinempty,signuppin,signupname,nameempty,thesignupsponsorcode,proceedWithSignUp;

        email1 = document.getElementById("signupemail").value;
        email2 = document.getElementById("signupemailverify").value;
        pword1 = document.getElementById("signuppassword").value;
        pword2 = document.getElementById("signuppasswordverify").value;
        signuppin = document.getElementById("signuppin").value; 
        pinempty = document.getElementById("signuppin").value === null
                    || document.getElementById("signuppin").value === "";
        signupname = document.getElementById("signupname").value;
        nameempty = document.getElementById("signupname").value === null
                    || document.getElementById("signupname").value === "";
        proceedWithSignUp = true;
        thesignupsponsorcode = document.getElementById("signupsponsor").value;

        var showEmailMatchingError = function() {
            document.getElementById("emailmatchingerror").style.display = 'block';
        }



        var showPasswordMatchingError = function() {
            document.getElementById("passwordmatchingerror").style.display = 'block';
        }

        var hidePasswordMatchingError = function() {
            document.getElementById("passwordmatchingerror").style.display = 'none';
        }


        var hideEmailMatchingError = function() {
            document.getElementById("emailmatchingerror").style.display = 'none';
        }

        var showPinEmptyError = function() {
            document.getElementById("pinemptyerror").style.display = 'block';
        }

        var hidePinEmptyError = function() {
            document.getElementById("pinemptyerror").style.display = 'none';
        }
        var showEmailEmptyError = function() {
            document.getElementById("emailemptyerror").style.display = 'block';
        }

        var hideEmailEmptyError = function() {
            document.getElementById("emailemptyerror").style.display = 'none';
        }
        var showNameEmptyError = function() {
            document.getElementById("nameemptyerror").style.display = 'block';
        }

        var hideNameEmptyError = function() {
            document.getElementById("nameemptyerror").style.display = 'none';
        }
        var showPasswordEmptyError = function() {
            document.getElementById("passwordemptyerror").style.display = 'block';
        }

        var hidePasswordEmptyError = function() {
            document.getElementById("passwordemptyerror").style.display = 'none';
        }

        var showPinNot4DigitsError = function() {
            document.getElementById("pinnot4digitserror").style.display = 'block';
        }

        var hidePinNot4DigitsError = function() {
            document.getElementById("pinnot4digitserror").style.display = 'none';
        }

        if (email1.length < 1) {
            showEmailEmptyError();
            proceedWithWignUp = false;
        } else {
            hideEmailEmptyError();
        }

        if (pword1.length < 1) {
            showPasswordEmptyError();
            proceedWithWignUp = false;
        } else {
            hidePasswordEmptyError();
        }

        if (email1 !== email2) {
            showEmailMatchingError();
            proceedWithSignUp = false;
        } else {
            hideEmailMatchingError();
        }
        if (pword1 !== pword2) {
            showPasswordMatchingError();
            proceedWithSignUp = false;
        } else {
            hidePasswordMatchingError();
        }
        if (pinempty) {
            showPinEmptyError();
            proceedWithSignUp = false;
        } else {
            hidePinEmptyError();
        }
        if (nameempty) {
            showNameEmptyError();
            proceedWithSignUp = false;
        } else {
            hideNameEmptyError();
        }
        if (!pinempty && signuppin.toString().length !== 4) {
            showPinNot4DigitsError();
            proceedWithSignUp = false;
        } else {
            hidePinNot4DigitsError();
        }


        var theSponsorValue = document.getElementById("signupsponsor").value;            
        if (theSponsorValue.length > 0) {
            // do nothing
        } else {
            // set to false
            theSponsorValue = false;
        }
        var signupEmailValue = '';
        signupEmailValue = document.getElementById("signupemail").value;            

        if (proceedWithSignUp) {
            hideSignUp();
            hideAllErrors();
            showSpinner();
            showSpinnerMessage();
            setSpinnerMessage('Processing sign up...');
            checkSignUpUserDB(signupEmailValue,theSponsorValue);
        } else {
            // reset proceedWithSignUp to true for futher tries by user
            proceedWithSignUp = true;
        }
    }


    var showPasswordResetButton = function() {
        document.getElementById("passwordResetButton").style.display = 'block';
    }
    var showSignIn = function() {
        hideSpinnerMessage();
        document.getElementById("signin").style.display = 'block';
        document.getElementById("signup").style.display = 'none';
        document.getElementById("forgotpassword").style.display = 'none';
        document.getElementById("bluesignin").style.display = 'none';

    }

    var hideSignIn = function() {
        document.getElementById("signin").style.display = 'none';
        document.getElementById("bluesignin").style.display = 'block';
    }

    var showSignUp = function() {
        hideSpinnerMessage();
        document.getElementById("signin").style.display = 'none';
        document.getElementById("signup").style.display = 'block';
        document.getElementById("forgotpassword").style.display = 'none';
        document.getElementById("bluesignin").style.display = 'block';
        hideAllErrors();
    }

    var hideSignUp = function() {
        document.getElementById("signup").style.display = 'none';
    }

    var showForgotPassword = function() {
        hideSpinnerMessage();
        document.getElementById("signin").style.display = 'none';
        document.getElementById("signup").style.display = 'none';
        document.getElementById("forgotpassword").style.display = 'block';
        document.getElementById("bluesignin").style.display = 'block';
        hideEmailNotFoundError();
        hideAllErrors();
    }

    var hideForgotPassword = function() {
        document.getElementById("forgotpassword").style.display = 'none';
    }



    var setSignUpLocalStorageItemsFromRecord = function(record) {
        window.localStorage.setItem("familyEmail", record.email);
        window.localStorage.setItem("familyPassword", record.password);
        window.localStorage.setItem("primaryName", record.name);
        window.localStorage.setItem("primaryPin", record.pin);
        window.localStorage.setItem("cloudDBName", record.theCloudDBName);
        window.localStorage.setItem("sponsorCode", record.sponsorcode);
        var theCloudDBName = record.theCloudDBName;

        var primaryUser = {
            _id: record._id,
    //                _rev: record._rev,
            name: record.name,
            pin: record.pin,
            type: "person",
            admin: "true"
        }
        function log(x) {console.log(x)}

        log('here is record._id, record.name and record.pin:');
        log(record._id + ', ' + record.name + ', ' + record.pin);


        var newLocalFamilyDB = new PouchDB(theCloudDBName);
        if(newLocalFamilyDB) {
            console.log('newLocalFamilyDB exists!');
        }

        newLocalFamilyDB.destroy().then(function(result){
            log('database destroyed');
            newLocalFamilyDB = new PouchDB(theCloudDBName);
            theRemoteDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/' + theCloudDBName);
            log('here is newLocalFamilyDB (empty):');
            log(newLocalFamilyDB);

            newLocalFamilyDB.sync(theRemoteDB).then(function(result) {
                log('put worked!');
                var testNewDB = [];
                newLocalFamilyDB.allDocs({include_docs: true}).then(function(result) {
                    log('got all docs');
                    log('result.rows.length = ' + result.rows.length);
                    for (var i = 0; i < result.rows.length; i++) {
                        'iteration ' + i;
                        testNewDB.push(result.rows[i].doc);
                    }
                    console.log('newLocalFamilyDB is: ');
                    console.log(testNewDB);
                    console.log('if there was something there, we can move on to next page I think.');
                    location.href = 'index2.html';
                }).catch(function(err) {
                    console.log('unable to get allDocs from newLocalFamilyDB. error was ' + err);
                })
            }).catch(function(err) {
                console.log('unable to put primary user into database. error was: ' + err);
            });
        }).catch(function(err) {
            log('database not destroyed. error was: ' + err);
        });
    }

    var setSignUpLocalStorageItems = function(record) {
    var email1 = document.getElementById("signupemail").value;
    var email2 = document.getElementById("signupemailverify").value;
    var pword1 = document.getElementById("signuppassword").value;
    var pword2 = document.getElementById("signuppasswordverify").value;
    var signuppin = document.getElementById("signuppin").value; 
    var signupname = document.getElementById("signupname").value;
    var thesignupsponsorcode = document.getElementById("signupsponsor").value;
    var aTimeStamp = new Date().toISOString();
    var theCloudDBName = thesignupsponsorcode + aTimeStamp;
        theCloudDBName = theCloudDBName.replace(/:|-|\./g, '').toLowerCase();

        window.localStorage.setItem("familyEmail", email1);
        window.localStorage.setItem("familyPassword", pword1);
        window.localStorage.setItem("primaryName", signupname);
        window.localStorage.setItem("primaryPin", signuppin);
        window.localStorage.setItem("cloudDBName", theCloudDBName);
        if (thesignupsponsorcode.length > 0) {
            window.localStorage.setItem("sponsorCode", thesignupsponsorcode);                
        }

        console.log('set the following items in local storage:');
        function log(x) {console.log(x)};
        log('familyEmail:' + window.localStorage.getItem("familyEmail"));
        log('familyPassword:' + window.localStorage.getItem("familyPassword"));
        log('primaryName:' + window.localStorage.getItem("primaryName"));
        log('primaryPin:' + window.localStorage.getItem("primaryPin"));
        log('cloudDBName:' + window.localStorage.getItem("cloudDBName"));
        if (thesignupsponsorcode.length > 0) {
            log('sponsorCode:' + window.localStorage.getItem("sponsorCode"));
        }

        var newUserRecord = {
            _id: theCloudDBName,
            email: email1,
            password: pword1,
            sponsorcode: thesignupsponsorcode,
            theCloudDBName: theCloudDBName,
            pin: signuppin,
            name: signupname,
            admin: true
        }

        var primaryUser = {
            _id: aTimeStamp,
            name: signupname,
            pin: signuppin,
            type: "person",
            admin: true

        }

        var newLocalFamilyDB = new PouchDB(theCloudDBName);
        if(newLocalFamilyDB) {
            console.log('newLocalFamilyDB exists!');
        }            

        console.log('putting in new user (to user db)');
        userDB.put(newUserRecord).then(function(result){
            userDB.allDocs({include_docs: true}).then(function(result) {
                console.log('got all docs from UserDB');
                var listOfUsers = [];
                var newUserFound = false;
                for (var i = 0; i < result.rows.length; i++) {
                    listOfUsers.push(result.rows[i].doc);
                }
                for (var i = 0; i < listOfUsers.length; i++) {
                    var record = listOfUsers[i];
                    var recordEmailLowerCase = record.email.toLowerCase();
                    var newUserRecordLowerCase = newUserRecord.email.toLowerCase();
    //                        if (record.email === newUserRecord.email) {
                    if (recordEmailLowerCase === newUserRecordLowerCase) {
                        newUserFound = true;
                        console.log('newUserFound = true!');
                    }
                }
                if (newUserFound) {
                    console.log('putting primaryUser into newLocalFamilyDB');
                    console.log('primaryUser is: ');
                    console.log(primaryUser);
                    newLocalFamilyDB.put(primaryUser).then(function(result) {
                        console.log('finished putting primary user into db');
                        location.href = 'index2.html';
                    }).catch(function(err) {
                        console.log('error: not able to put the primary user');
                    });                            
                } else {
                    console.log('something happened');
                    showSpinner();
                    showSpinnerMessage();
                    setSpinnerMessage('Sorry! Something went wrong with the sign up process. Please try again.');                        
                }                    
            });

        }).catch(function(err) {
            showSpinner();
            showSpinnerMessage();
            setSpinnerMessage('Sorry! Something went wrong with the sign up process. Please try again.');
            console.log('error was: ' + err);
        });
    }