

let xAPI_LRS = {};
let lrs_initialized = false;
let registration = TinCan.Utils.getUUID();
let base_activity_id = 'http://www.etrainetc.com/CaseTools/eTrainetc/g6KpChW8XcPETtG37I8REGHpMN33/dj5Jz14BGkN20L4OdKG6/test';

let actorobj = {
	name: 'Andrew Tolstov',
	mbox: 'mailto:andrew.tolstov@etrainetc.com'
}

function vr_xapi_initialize_LRS(){
	
	console.log('trying to inititalize LRS');
	
    try{
        xAPI_LRS = new TinCan.LRS(
            {
                endpoint: "https://learninglocker.etrainetc.com/data/xAPI/",
                auth: "Basic Y2VmMjE4ZDM5ZThiNmYwODJhY2Y0OTNjNDI5ZjI2YTE0Mjg2YWYyYToyMjQ0YTk2MWE5N2JlZmZlYjgwODJmOGVlMjUzZGQ1N2I1YzZhMWJh",
                allowFail: true
            }
        );
        xAPI_LRS.about(
            {
                callback: function (err, xhr) {
                    //console.log("Callback function for About: " + xhr.response + " ( " + xhr.status + " )");
                    if (err !== null) {
                        if (xhr !== null) {
                            //   alert("About Failed: " + xhr.responseText + " (" + xhr.status + ")");
                            //  alert("About Error: " + err);

                            lrs_initialized = false;
                            // TODO: do something with error, didn't save statement
                            return;
                        }
                        //alert("About Error: " + err);
                        lrs_initialized = false;
                        return;
                    }
                    else{
                        lrs_initialized = true;
                    }

                }
            });
    }
    catch (ex)
    {
        alert("Failed to setup LRS object: " + ex);
        //setTimeout(check_connection,5000);
        initialized = false;

    }

}

function vr_xapi_sendprofiledata(profobj, actor){

    let tcagent = {
        name: actor["name"],
        mbox: actor["mbox"]
    };
    let agenttc = new TinCan.Agent(tcagent);

    //Now we try to send the statement
    try {
		xAPI_LRS.saveAgentProfile(
			"contents", profobj,
			{
				callback: function (err, xhr) {
					//alert("Done saving");

					if (err !== null) {
						if (xhr !== null) {
							console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
							// TODO: do something with error, didn't save statement

							return;
						}

						console.log("Failed to save statement: " + err);
						// TODO: do something with error, didn't save statement
						return;
					}
				},
				agent: agenttc,
				contentType: "application/json"
			}
		);
        }
        catch (ex) {
            console.log("Failed to setup LRS object: " + ex);
        }

    //test if agent profile is saved
    var profileids = xAPI_LRS.retrieveAgentProfile(
        "contents",
        {
            callback: function (err, xhr) {
                //alert("Done saving");

                if (err !== null) {
                    if (xhr !== null) {
                        console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                        // TODO: do something with error, didn't save statement

                        return;
                    }

                    console.log("Failed to save statement: " + err);
                    // TODO: do something with error, didn't save statement
                    return;
                }
            },
            agent: agenttc
        }
    );


};

function vr_xapi_SaveAction(UserConfidence, QuestionID, QuestionText, score_value, isCorrect, AnswerText, AnswerChoices){
    //Lets set up the possible extensions
	
	let extensions = {"http://etrainetc.com/extension/base-activity": base_activity_id };
	let local_activity_id = base_activity_id + "/eTrainetcCOVID19EnhancedRespiratoryPrecautionsPPEChecklist/DonningandDoffingPPE"

    if (UserConfidence != null)
    {
        extensions["http://etrainetc.com/extension/UserConfidence"] = UserConfidence;
    }
    
	extensions["http://etrainetc.com/extension/ActionType"] = "Answered";

    extensions["http://etrainetc.com/extension/QuestionType"] = "Action";
    extensions["http://etrainetc.com/extension/SimPlatform"] = "VR";

    let statement = {
        id: TinCan.Utils.getUUID(),
        timestamp: new Date().toISOString(),
        actor: actorobj,
        verb: {
            id: "http://adlnet.gov/expapi/verbs/answered",
            display:{
                "en-US": "Answered"
            }
        },
        object: {
            id: local_activity_id + "/Action_"+ QuestionID,
            definition: {
                description:{
                    "en-US": QuestionText,
                },
                type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                interactionType: "choice",
                choices: AnswerChoices
            }
        },
        result: {
            score: {
                scaled: score_value,
                raw: score_value,
                min: 0,
                max: 1,
            },
            success: isCorrect,
            response: AnswerText

        },
        context: {
            "registration": registration,
            "parent":
                [
                    {
                        id: local_activity_id
                    }
                ],
            "extensions":extensions
        }
    };
	
	statement = new TinCan.Statement(statement);

    //Now we try to send the statement
    
	try {

		xAPI_LRS.saveStatement(
			statement,
			{
				callback: function (err, xhr) {
					//alert("Done saving");

					if (err !== null) {
						if (xhr !== null) {
							console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
							// TODO: do something with error, didn't save statement

							username = "";
							return;
						}

						console.log("Failed to save statement: " + err);
						// TODO: do something with error, didn't save statement
						return;
					}

				}
			}
		);
	}
	catch (ex) {
		console.log("Failed to setup LRS object: " + ex);
	}
}

function vr_xapi_SaveAssessment(ThisAssessmentName, UserScore, TotalScore, ConfidenceLevel) {
    let success = false;
    let response = "http://adlnet.gov/expapi/verbs/completed";
	let local_activity_id = base_activity_id + "/eTrainetcCOVID19EnhancedRespiratoryPrecautionsPPEChecklist/DonningandDoffingPPE";

    let date = new Date();

    let extensions = {"http://etrainetc.com/extension/base-activity": base_activity_id};
	
    if (ConfidenceLevel != null){
        extensions["http://etrainetc.com/extension/ConfidenceScore"] = (ConfidenceLevel/100.0);
    }

    extensions["http://etrainetc.com/extension/Type"] = "action";

    extensions["http://etrainetc.com/extension/SimPlatform"] = "VR";


    let statement = {
        id: TinCan.Utils.getUUID(),
        timestamp: date.toISOString(),
        actor: actorobj,
        verb: {
            id: "http://adlnet.gov/expapi/verbs/completed",
            display: {
                "en-US": "Completed"
            }
        },
        object: {
            id: local_activity_id, //NEED SOMETHING HERE FOR THE ACTUAL FULL ID
            definition: {
                description: {
                    "en-US": "Assessment - " + ThisAssessmentName
                },
                type: "http://etrainetc.com/activities/assessment",
                name: {
                    "en-US": "Assessment - " + ThisAssessmentName
                }
            }
        },
        result: {
            score: {
                scaled: UserScore/TotalScore,
                raw: UserScore,
                min: 0,
                max: TotalScore,
            },
            success: false,
            completion: false
        },
        context: {
            "registration": registration,

            "parent":
                [
                    {
                        id: local_activity_id
                    }
                ],
            "extensions":extensions
        }
    };

    statement = new TinCan.Statement(statement);

    try {
            xAPI_LRS.saveStatement(
                statement,
                {
                    callback: function (err, xhr) {
                        //alert("Done saving");

                        if (err !== null) {
                            if (xhr !== null) {
                                console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                                // TODO: do something with error, didn't save statement

                                return;
                            }

                            console.log("Failed to save statement: " + err);
                            // TODO: do something with error, didn't save statement
                            return;
                        }

                        /*
                        if (xhr !== null) {
                            console.log("Statement saved, wtih repsonse:" + xhr.responseText);
                        }
                        else {
                            console.log("Sucessfully save the statement");
                        }
                        */

                        console.log("Data was submitted successfully");
                        // TOOO: do something with success (possibly ignore)

                        //For SCORMCloud we will use the username as the email address, for others we need to use
                        //the returned value from SimCore
                    }
                }
            );
        }
        catch (ex) {
            console.log("Failed to setup LRS object: " + ex);
        }
}

function vr_xapi_SaveCompletion(FinalScore, TotalPoints, Outcome, ConfidenceScore, TimeTaken){
    let success = false;
    let response = false;
    let verb = "http://adlnet.gov/expapi/verbs/failed";

    let display_verb = "Failed";

    if (Outcome == "Pass")
    {
        success = true;
        response = true;
        verb  = "http://adlnet.gov/expapi/verbs/passed";
        display_verb = "Passed";
    }


    //We need to convert the score value from a string to a
    let date = new Date();

    let extensions = {};

    if (ConfidenceScore != 0)
    {
        extensions["http://etrainetc.com/extension/ConfidenceScore"] = ConfidenceScore;
    }

    extensions["http://etrainetc.com/extension/SimPlatform"] = "VR";
    extensions["http://etrainetc.com/extension/OverallPassingScore"] = 0.7;
    extensions["http://etrainetc.com/extension/TimeTaken"] = TimeTaken;

    let statement = {
        id: TinCan.Utils.getUUID(),
        timestamp: date.toISOString(),
        actor: actorobj,
        verb: {
            id: verb,
            display: {
                "en-US": display_verb
            }
        },
        object: {
            id: base_activity_id , //NEED SOMETHING HERE FOR THE ACTUAL FULL ID
            definition: {
                description: {
                    "en-US": "Final Score" //NEED THE QUESTION TEXT HERE
                },
                type: "http://adlnet.gov/expapi/activities/course",
                name: {
                    "en-US": "Final Score"
                }
            }
        },
        result: {
            score: {
                scaled: FinalScore,
                raw: FinalScore,
                min: 0,
                max: TotalPoints,
            },
            success: success,
            completion: response,
            response: ""

        },
        context: {
            "registration": registration,

            "extensions":extensions,
            "parent":
                [
                    {
                        id: base_activity_id
                    }
                ]
        }
    };
	
    statement = new TinCan.Statement(statement);
    
    try {
			xAPI_LRS.saveStatement(
				statement,
				{
					callback: function (err, xhr) {
						//alert("Done saving");

						if (err !== null) {
							if (xhr !== null) {
								console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
								// TODO: do something with error, didn't save statement

								return;
							}

							console.log("Failed to save statement: " + err);
							// TODO: do something with error, didn't save statement
							return;
						}
					}
				}
			);
        }
        catch (ex) {
            console.log("Failed to setup LRS object: " + ex);
        }


}

export { vr_xapi_initialize_LRS, vr_xapi_sendprofiledata, vr_xapi_SaveAction, vr_xapi_SaveAssessment, vr_xapi_SaveCompletion }