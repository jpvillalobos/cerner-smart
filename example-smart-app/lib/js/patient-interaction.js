var global_auth_object;
var patientMRN;
var patientCO_id;

function getAuthorization() {
    //var xhr = new XMLHttpRequest({host: "104.129.194.41", port: 10015});
    var xhr = new XMLHttpRequest();
    var url = "https://angrynerds-integrationhelper.cloud.pcftest.com/utils/test-hash";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    //xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            global_auth_object = json;
            console.log(json);
        }
    };
    var data = JSON.stringify({ "name": "testemr1user_b4775e14", "key": "43d22fc3-5899-4f21-9638-6c2d0aebc943",  "urls": ["https://e-rpm-a-na-integrationgateway-v1-server.cloud.pcftest.com/patientSearch","https://e-rpm-a-na-integrationgateway-v1-server.cloud.pcftest.com/patients"] });
    xhr.send(data);
}

function patientSearch() {
    var xhr = new XMLHttpRequest();
    var url = "https://e-rpm-a-na-integrationgateway-v1-server.cloud.pcftest.com/patientSearch?ExternalId="+patientMRN;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Timestamp", global_auth_object[0].Timestamp);
    xhr.setRequestHeader("Authorization", global_auth_object[0].Authorization);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            patientCO_id = json[0].id;
            document.getElementById("extID").innerHTML = patientCO_id;
        }
    };
    xhr.send();
}

function getPatientData() {
    var xhr = new XMLHttpRequest();
    var url = "https://e-rpm-a-na-integrationgateway-v1-server.cloud.pcftest.com/patients/"+patientCO_id;
    
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Timestamp", global_auth_object[0].Timestamp);
    xhr.setRequestHeader("Authorization", global_auth_object[0].Authorization);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            document.getElementById("CO_data").innerHTML = JSON.stringify(json, undefined, 2);
        }
    };
    xhr.send();
}

function getPatientPDFId() {
    var xhr = new XMLHttpRequest();
    var url = "https://e-rpm-a-na-integrationgateway-v1-server.cloud.pcftest.com/documents/37ffd065-f62f-46fc-b0ca-77371d90c347";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Timestamp", global_auth_object[0].Timestamp);
    xhr.setRequestHeader("Authorization", global_auth_object[0].Authorization);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    xhr.send();
}

function getPatientPDF() {
    var xhr = new XMLHttpRequest();
    var url = "https://e-rpm-a-na-integrationgateway-v1-server.cloud.pcftest.com/documents/37ffd065-f62f-46fc-b0ca-77371d90c347/de7b6244-fe97-4bad-8d8d-23cb5e1f52d2";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Timestamp", global_auth_object[0].Timestamp);
    xhr.setRequestHeader("Authorization", global_auth_object[0].Authorization);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("auth_token", '{"userId":"cdbea7de-4a63-4893-a0df-8d2c719a03d0","uniqueId":"8effcb5f-ffb7-45bf-ba13-2025b81dfd95","hash":"yWsoBKvy9LKulmkAFyza5QKigbCLUxuUD4hE644y+x2JVbWUPw3ad6J7mG944F/JzQ/sOCUSKmm8XwxOUxb8Aw==","timeToLive":900}');
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    xhr.send();
}

function UserAction() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
         }
    };
    xhttp.open("POST", "Your Rest URL Here", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send("Your JSON Data Here");
}

    function getPatientName(pt) {
        if (pt.name) {
            var names = pt.name.map(function(name) {
                return name.given.join(" ") + " " + name.family.join(" ");
            });
            return names.join(" / ");
        } else {
            return "anonymous";
        }
    }
    
    function displayPatient (pt) {
        document.getElementById('name').innerHTML = getPatientName(pt);
    }

    function displayPatientDOB(pt) {
        if (pt.birthDate) {
            document.getElementById("dob").innerHTML = pt.birthDate.toString();
        } else {
            console.log("Could not get DOB");
        }
    }
    function displayPatientGender(pt) {
        if (pt.gender) {
            document.getElementById("gender").innerHTML = pt.gender.toString();
        } else {
            console.log("Could not get DOB");
        }
    }
    function getMRNIdentifier(patient) {
        const identifiers = patient.identifier ? patient.identifier : [];
        const identifier = identifiers.filter(identifier => {
            if (!identifier.type) return false;
            if (!identifier.type.coding) return false;
            const v = identifier.type.coding.find(code => {
                return code.code === "MR";
            });
            return v !== undefined;
        })[0];
        if (identifier) return identifier.value;
        else return undefined;
    }
  
    FHIR.oauth2.ready(function(smart) {
        smart.patient.read().then(function(pt) {
            displayPatient (pt);
            displayPatientDOB(pt);
            displayPatientGender(pt);
            patientMRN = getMRNIdentifier(pt);
            getAuthorization();
        });

    });

    function getIDs(){
        //get the FHIR MR
        document.getElementById("intID").innerHTML = patientMRN;
        patientSearch();
        document.getElementById("COButton").disabled = false;
    }

    function getCOData(){
        getPatientData();
    }
