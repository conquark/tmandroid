    <script>
        function log(x) {console.log(x)}
        
        var localDB = new PouchDB('local');
//        localDB.destroy();
    
        log(localDB);
        var rando = Math.floor(Math.random() * 50000);
        var theId = "thisIsIdNumber_" + rando;
        var anObject = {
            "_id": theId,
            "name": "funhouse freddy"
        }
        
        localDB.put(anObject).then(function(doc) {
            log('successful put!')
        }).catch(function(err) {
            log('there was an error. it was: ' + err);
        });
    
        localDB.allDocs({include_docs:true}).then(function(doc){
            log(doc.rows);
            for (var i = 0; i < doc.rows.length; i++) {
                var record = doc.rows[i].doc;
                document.write('{' + record._id + ':' + record.name + '}<br/>');
            }
        });
    </script>
    
    <script>
        var ldb2 = new PouchDB('another');
        log(ldb2);
        var rando = Math.floor(Math.random() * 50000);
        var theId2 = "thisIsIdNumber_" + rando;
        var anObject2 = {
            "_id": theId2,
            "name": "frathouse freddy"
        }
        
        ldb2.put(anObject2).then(function(doc) {
            log('successful put!')
        }).catch(function(err) {
            log('there was an error. it was: ' + err);
        });
    
        ldb2.allDocs({include_docs:true}).then(function(doc){
            log(doc.rows);
            for (var i = 0; i < doc.rows.length; i++) {
                var record = doc.rows[i].doc;
                document.write('{' + record._id + ':' + record.name + '}<br/>');
            }
        });        
        
    </script>
    
    <script>
        var remoteDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/cooperstown');
        log(remoteDB);
         var rando3 = Math.floor(Math.random() * 50000);
        var theId3 = "thisIsIdNumber_" + rando3;
        var anObject3 = {
            "_id": theId3,
            "name": "farmHouse Franny"
        }
        
        remoteDB.put(anObject3).then(function(doc) {
            log('successful put!')
        }).catch(function(err) {
            log('there was an error. it was: ' + err);
        });
    
        remoteDB.allDocs({include_docs:true}).then(function(doc){
            log(doc.rows);
            for (var i = 0; i < doc.rows.length; i++) {
                var record = doc.rows[i].doc;
                document.write('{' + record._id + ':' + record.name + '}<br/>');
            }
        }).catch(function(err) {
            log('but wait - there was also an error? here it is: ' + err);
        });               
    </script>
    <script>
        var remoteDB2= new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/threeperstown');
        log(remoteDB2);
         var rando4 = Math.floor(Math.random() * 50000);
        var theId4 = "thisIsIdNumber_" + rando4;
        var anObject4 = {
            "_id": theId4,
            "name": "FLIPhouse spIFFLY"
        }
        
        remoteDB2.put(anObject4).then(function(doc) {
            log('successful put!')
        }).catch(function(err) {
            log('there was an error. it was: ' + err);
        });
    
        remoteDB2.allDocs({include_docs:true}).then(function(doc){
            log(doc.rows);
            for (var i = 0; i < doc.rows.length; i++) {
                var record = doc.rows[i].doc;
                document.write('{' + record._id + ':' + record.name + '}<br/>');
            }
        }).catch(function(err) {
            log('but wait - there was also an error? here it is: ' + err);
        });               
    </script>
    
    <script>
        var userDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/taskmasteruser');
        log(userDB);
         var rando5 = Math.floor(Math.random() * 50000);
        var theId5 = "thisIsIdNumber_" + rando5;
        var anObject5 = {
            "_id": theId5,
            "name": "This is a Damn User in the Damn Database"
        }
        
        userDB.put(anObject5).then(function(doc) {
            log('successful put!')
        }).catch(function(err) {
            log('there was an error. it was: ' + err);
        });
    
        userDB.allDocs({include_docs:true}).then(function(doc){
            log(doc.rows);
            for (var i = 0; i < doc.rows.length; i++) {
                var record = doc.rows[i].doc;
                document.write('{' + record._id + ':' + record.name + '}<br/>');
            }
        }).catch(function(err) {
            log('but wait - there was also an error? here it is: ' + err);
        });                       
    </script>
    
    <script>
        window.localStorage.setItem("familyEmail", "thisisourEmail@noneofyourdamnbusiness.com");
        var bob = window.localStorage.getItem("familyEmail");
        log(bob);
    </script>
    <script>
        userDB.get()
    </script>