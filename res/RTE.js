window.VC_RTE=
{
    // current version
    version: "0.1.AEL_VC_RTE",
    // if the debug flag is set to true, debug messages will be raised
    debug: true,
    // the global error code
    errorCode:0, 
    // starea comunicatiei - 0 neinitializat, 1 initializat, 3 terminated, 4 ups
    communicationState:0,
    launch:false,

    resetSession: function()
    {
        VC_RTE.errorCode = 0;
        VC_RTE.communicationState= 0;
        if (VC_RTE_CONFIG.suspended)
        {
            VC_RTE_CONFIG.resume = true; 
            VC_RTE_STORAGE.sessionTime = 0;
        }
        else
        {
            VC_RTE.resetAttempt();
        }        
    }, 
    
    resetAttempt : function()
    {
        VC_RTE.errorCode = 0;
        VC_RTE.communicationState= 0;
        VC_RTE_STORAGE.score = new VC_RTE_MODEL_PROTOTYPES.Score();
        VC_RTE_STORAGE.namedValues = new Array();
        VC_RTE_STORAGE.interactions = new Array();
        VC_RTE_STORAGE.objectives = new Array();
        VC_RTE_STORAGE.commentsFromLearner = new Array();
        VC_RTE_CONFIG.suspended = false;
        VC_RTE_CONFIG.resume = false;
        VC_RTE_STORAGE.totalAttemptTime = 0;
        VC_RTE_STORAGE.suspendData = "";
        VC_RTE_STORAGE.suspendLocation = "";
        VC_RTE_STORAGE.primarySuccessStatus = "unknown";
        VC_RTE_STORAGE.primaryCompletionStatus = "not attempted";
                
    },
    
    setValueByName : function (/*String*/ nume, /*Object*/ valoare)
    {
        var idx = -1;
        for (i=0;i<VC_RTE_STORAGE.namedValues.length;i++)  
        {
            if (VC_RTE_STORAGE.namedValues[i].nume == nume) 
            {
                idx = i;
            }
        }

        if (idx == -1) 
        {
            VC_RTE_STORAGE.namedValues[VC_RTE_STORAGE.namedValues.length] = new VC_RTE_MODEL_PROTOTYPES.NamedValue(nume,valoare);
        }
        else 
        {
            VC_RTE_STORAGE.namedValues[idx].valoare = valoare;
        }
        
       return 0;
    },
    getValueByName: function(/*String*/ nume)
    {
        var idx = -1;
        
        for (i=0;i<VC_RTE_STORAGE.namedValues.length;i++)
        {
            if(VC_RTE_STORAGE.namedValues[i].nume == nume)
            {
                idx = i;
            }
        }   
        
        if (idx != -1)
        {   
            return VC_RTE_STORAGE.namedValues[idx].valoare;
        }
        
        return null;
    },
    getValueCommentFromLearner: function (/*String*/ parameter)
    {
        var localErrorCode = 0;
        var retval = null;
        var a = parameter.split(".");
        var n = parseInt(a[0]);
        
        if (parameter == "_children") 
        {
            return "comment,location,timestamp";
        }
        
        if (parameter == "_count") 
        {
            return VC_RTE_STORAGE.commentsFromLearner.length.toString();
        }
        
        
        if(!VC_RTE_UTIL.isPositiveInt(n)) 
        {
            return 406;
        }
        else if (n > VC_RTE_STORAGE.commentsFromLearner.length - 1)
        {
            localErrorCode = 407;
        }
        else
        {
            switch(a[1])
            {
                case "comment":
                    retval = VC_RTE_STORAGE.commentsFromLearner[n].comment;
                    break;
                case "location":
                    retval = VC_RTE_STORAGE.commentsFromLearner[n].location;
                    break;
                case "timestamp":
                    retval = VC_RTE_STORAGE.commentsFromLearner[n].timestamp;
                    break;
                default:
                    localErrorCode = 403;
            }
        }
        
        if (localErrorCode != 0) 
        {
            VC_RTE.errorCode = localErrorCode;
        }
        return retval;
    },
    getValueCommentFromLms: function(/*String*/ parameter)
    {
        var localErrorCode = 0;
        var retval = null;
        var a = parameter.split(".");
        var n = parseInt(a[0]);

        if (parameter == "_children")
        {
            return "comment,location,timestamp";
        }

        if (parameter == "_count")
        {
            return VC_RTE_STORAGE.commentsFromLMS.length;
        }

        if (!VC_RTE_UTIL.isPositiveInt(n))
        {
            return 406;
        }
        else if (n > VC_RTE_STORAGE.commentsFromLMS.length - 1)
        {
            localErrorCode = 407;
        }
        else
        {
            switch (a[1])
                    {
                case "comment":
                    retval = VC_RTE_STORAGE.commentsFromLMS[n].comment;
                    break;
                case "location":
                    retval = VC_RTE_STORAGE.commentsFromLMS[n].location;
                    break;
                case "timestamp":
                    retval = VC_RTE_STORAGE.commentsFromLMS[n].timestamp;
                    break;
                default:
                    localErrorCode = 403;
            }
        }
        if (localErrorCode != 0)
        {
            VC_RTE.errorCode = localErrorCode;
        }
        return retval;
    },
    getValueCompletionStatus: function(/*String*/ val)
    {
        var num = parseFloat(VC_RTE.getValueByName("progress_measure"));
        if (!isNaN(num))
        {
            if (num >= VC_RTE_CONFIG.completionThreshold)
            {
                return "completed";
            }
            else
            {
                return "incomplete";
            }
        }
        return VC_RTE_STORAGE.primaryCompletionStatus;
    },
    getValueScore: function(/*Score*/ score, /*String*/ parameter)
    {
        var retval = "";
        switch (parameter)
        {
            case "_children":
                retval = "scaled,raw,min,max";
                break;
            case "scaled":
                retval = score.scaled;
                break;
            case "raw":
                retval = score.raw;
                break;
            case "min":
                retval = score.min;
                break;
            case "max":
                retval = score.max;
                break;
            default:
                VC_RTE.errorCode = 351;
        }
        return retval + "";
    },
    getValueSuccessStatus: function(/*String*/ val)
    {
        var n = parseFloat(VC_RTE.getValueScore(VC_RTE_STORAGE.score, "scaled"));
        if (!isNaN(n))
        {
            if (n >= VC_RTE_CONFIG.passingScore) 
            { 
                return "passed";
            }
            else 
            {
                return "failed";
            }
        }
        return VC_RTE_STORAGE.primarySuccessStatus;
    },
    getCorrectResponses: function (/*Interaction*/ interaction, /*int*/ num, /*String*/ nume)
    {
        var localErrorCode = 0;
        var retval = "";
        var typ = VC_RTE_STORAGE.interactions[interaction].type;
        
        if (typ == null)
        {
            localErrorCode = 301;
        }
        else
        {
            var i = parseInt(num);
            
            if (!VC_RTE_UTIL.isPositiveInt(i)) 
            {
                localErrorCode= 351;
            }
            else if (nume != "pattern") 
            {
                localErrorCode = 351;
            }
            else if ((i > 0) && ((typ == "true-false") || (typ == "likert"))) 
            {
                localErrorCode = 351;
            }
            else if (i > VC_RTE_STORAGE.interactions[interaction].correctResponses.length - 1)
            {
                localErrorCode= 351;
            }
            else 
            {
                retval = VC_RTE_STORAGE.interactions[interaction].correctResponses[i].toString();
            }
        }
        if (localErrorCode != 0) 
        {   
            VC_RTE.errorCode = localErrorCode;
        }
        return retval;
    },

    getValueInteractions: function(/*String*/ parameter)
    {
        var localErrorCode = 0;
        var retval = "";
        var a = parameter.split(".");
        var n = a[0];
        
        if (parameter == "_count")
        {
            if (!VC_RTE_STORAGE.interactions) 
            {
                return "0";
            }
            else 
            {
                return VC_RTE_STORAGE.interactions.length + "";
            }
        }
        
        if (parameter == "_children") 
        {
            return "id,type,latency,timestamp,result,weighting,description,correct_responses,learner_response";
        }
        
        if (!VC_RTE_UTIL.isPositiveInt(n)) 
        {
            localErrorCode = 406;
        }
        
        else if(!VC_RTE_STORAGE.interactions) 
        {
            localErrorCode == 407;
        }
        else if (n > VC_RTE_STORAGE.interactions.length - 1) 
        {
            localErrorCode = 407;
        }
        else 
        {
            switch (a[1])
            {
                case "id":
                    retval = VC_RTE_STORAGE.interactions[n].id;
                    break;
                case "type":
                    retval = VC_RTE_STORAGE.interactions[n].type;
                    break;
                case "latency":
                    retval = VC_RTE_STORAGE.interactions[n].latency;
                    break;
                case "timestamp":
                    retval = VC_RTE_STORAGE.interactions[n].timestamp;
                    break;
                case "result":
                    retval = VC_RTE_STORAGE.interactions[n].result;
                    break;
                case "weighting":
                    retval = VC_RTE_STORAGE.interactions[n].weigting;
                    break;
                case "description":
                    retval = VC_RTE_STORAGE.interactions[n].description;
                    break;
                case "correct_responses":
                    if (a[2] == "_count")
                    {
                        retval = VC_RTE_STORAGE.interactions[n].correctResponses.length + "";
                    }
                    else
                    {
                        var a = VC_RTE.getCorrectResponses(n, a[2], a[3]);
                        
                        if (a[0] != 0) 
                        {
                            localErrorCode = a[0]; 
                        }
                        else
                        {
                            retval = a[1];
                        }
                    }
                    break;
                case "learner_response":
                    retval = VC_RTE_STORAGE.interactions[n].learnerResponse;
                    break;
                case "objectives":
                    if (a[2] == "_count")
                    {
                        retval = VC_RTE_STORAGE.interactions[n].objectives.length + "";
                    }
                    else if ((VC_RTE_UTIL.isPositiveInt(a[2])) && (a[2] < VC_RTE_STORAGE.interactions[n].objectives.length) && (a[3] == "id"))
                    {
                        retval = VC_RTE_STORAGE.interactions[n].objectives[a[2]];
                    }
                    else 
                    {
                        localErrorCode = 351;
                    }
                    break;
                default:
                    localErrorCode = 351;
                    break;
            }
        }
        if (localErrorCode != 0) 
        {
            VC_RTE.errorCode = localErrorCode;
        }
        return retval;
    },
    getValueLearnerPreference : function(/*String*/ parameter)
    {
        var localErrorCode = 0;
        var retval = "";
        switch (parameter)
        {
            case "_children":
                retval = "audio_captioning,audio_level,delivery_speed,language";
                break;
            case "audio_captioning":
                retval = VC_RTE_STORAGE.learnerPrefAudioCaptioning;
                break;
            case "audio_level":
                retval = VC_RTE_STORAGE.learnerPrefAudioLevel;
                break;
            case "delivery_speed":
                retval = VC_RTE_STORAGE.learnerPrefDeliverySpeed; 
                break;
            case "language":
                retval = VC_RTE_STORAGE.learnPrefLanguage;
                break;
            default:
                localErrorCode = 401;
                break;
        }
        
        if (localErrorCode != 0) 
        {
            VC_RTE.errorCode = localErrorCode;
        }
        return retval;
    },
    getValueObjectives : function(/*String*/ parameter)
    {
        var localErrorCode = 0;
        var retval = "";
        var a = parameter.split(".");
        var n = parseInt(a[0]);
     
        if (parameter == "_children")
        {
            return "id,score,success_status,completion_status,progress_measure,description";
        }
        else if (parameter == "_count")
        {
            return VC_RTE_STORAGE.objectives.length + "";
        }
        if (!VC_RTE_UTIL.isPositiveInt(n)) 
        {
            localErrorCode = 406;
        }
        else if (n > VC_RTE_STORAGE.objectives.length - 1) 
        {
            localErrorCode = 407;
        }
        else 
        {   switch (a[1])
            {
                case "completion_status":
                    retval = VC_RTE_STORAGE.objectives[n].completion_status;
                    break;
                case "description":
                    retval = VC_RTE_STORAGE.objectives[n].description;
                    break;
                case "id":
                    retval = VC_RTE_STORAGE.objectives[n].id;
                    break;
                case "progress_measure":
                    retval = VC_RTE_STORAGE.objectives[n].progress_measure;
                    break;
                case "score":
                    retval = VC_RTE.getValueScore(VC_RTE_STORAGE.objectives[n].score, a[2]);
                    break;
                case "success_status":
                    retval = VC_RTE_STORAGE.objectives[n].success_status;
                    break;
                default:
                    localErrorCode = 351;
                    break;
            }
        }
        
        if (localErrorCode != 0)
        {
            VC_RTE.errorCode = localErrorCode;
        }
        return retval;
    },
    updateTotalTimeAtEndOfSession : function()
    {
    },

    setCorrectResponses : function(/*Interaction*/ interaction, /*int*/ num, /*String*/ nume, /*Object*/ valoare)
    {
        var localErrorCode = 0;
        var typ = VC_RTE_STORAGE.interactions[interaction].type;
        var i = parseInt(num);
        
        if (typ == null)
        {
            return 301;
        }
        
        if (!VC_RTE_UTIL.isPositiveInt(i))
        {
            return 351;
        }
        
        if (nume != "pattern") 
        {
            return 351;
        }
        
        if ((i > 0) && ((typ == "true-false") || (typ == "likert"))) 
        {
            return 351;
        }
        
        if (i > VC_RTE_STORAGE.interactions[interaction].correctResponses.length) 
        {
            return 351;
        }
        
        VC_RTE_STORAGE.interactions[interaction].correctResponses[i] = valoare.toString();
        
        return 0;
    },

    setValueInteractions:function(/*String*/ parameter, /*String*/ valoare)
    {
        var localErrorCode = 0;
        var a = parameter.split(".");
        var n = parseInt(a[0]);
        
        if (!VC_RTE_UTIL.isPositiveInt(n)) 
        {
            return 406;
        }
        
        if (n > VC_RTE_STORAGE.interactions.length) 
        {
            return 407;
        }
        
        if (a[1] == "id")
        {
            if ((!valoare) || (valoare == "") || (!VC_RTE_UTIL.isValidIeeeIdentifier(valoare))) 
            {
                return 406;
            }
            
            if (n == VC_RTE_STORAGE.interactions.length)
            {
                VC_RTE_STORAGE.interactions[n] = new VC_RTE_MODEL_PROTOTYPES.Interaction(valoare);
            }
            else
            {
                VC_RTE_STORAGE.interactions[n].id = valoare;
            }
        }
        else
        {
            // nu exista
            if (n > VC_RTE_STORAGE.interactions.length - 1) 
            {
                return 407; 
            }
            // nu are id inca
            if (VC_RTE_STORAGE.interactions[n].id == null) 
            {
                return 408; 
            }
            
            
            switch (a[1])
            {
                case "type":
                    if (VC_RTE_STORAGE.interactions[n].type != null)
                    {
                        if (VC_RTE_STORAGE.interactions[n].type == valoare) 
                        {
                            return 0;
                        }
                        return 351;
                    }
                    if (VC_RTE.isValidInteractionType(valoare)) 
                    {
                        VC_RTE_STORAGE.interactions[n].type = valoare;
                    }
                    else 
                    {
                        localErrorCode = 351; // tip necunoscut                        
                    }
                    break;
                case "latency":
                    VC_RTE_STORAGE.interactions[n].latency = valoare;
                    break;
                case "timestamp":
                    VC_RTE_STORAGE.interactions[n].timestamp = valoare;
                    break;
                case "result":
                    VC_RTE_STORAGE.interactions[n].result = valoare;
                    break;
                case "weighting":
                    VC_RTE_STORAGE.interactions[n].weighting = valoare;
                    break;
                case "description":
                    VC_RTE_STORAGE.interactions[n].description = valoare;
                    break;
                case "correct_responses":
                    localErrorCode = VC_RTE.setCorrectResponses(n, a[2], a[3], valoare);
                    break;
                case "learner_response":
                    VC_RTE_STORAGE.interactions[n].learnerResponse = valoare;
                    break;
                case "objectives":
                    if ((VC_RTE_UTIL.isPositiveInt(a[2])) && (a[2] <= VC_RTE_STORAGE.interactions[n].objectives.length) && (a[3] == "id"))
                    {
                        VC_RTE_STORAGE.interactions[n].objectives[a[2]] = valoare;
                    }
                    else localErrorCode = 351;
                    break;
                default:
                    localErrorCode = 351;
                    break;
            }
        }
        return localErrorCode;
    },

    setValueLearnerPreference : function(/*String*/ parameter, /*String*/ valoare)
    {
        var localErrorCode = 0;
        var r = "true";
        switch (parameter)
                {
            case "audio_captioning":
                if ((valoare != "-1") || (valoare != "0") || (valoare != 1))
                {
                    localErrorCode = 406;
                }
                else
                {
                    VC_RTE_STORAGE.learnerPrefAudioCaptioning = valoare;
                }
                return "false";
                break;
            case "audio_level":
                var n = parseFloat(valoare);
                if ((isNaN(n)) || (n < 0))
                {
                    localErrorCode == 406;
                }
                else
                {
                    VC_RTE_STORAGE.learnerPrefAudioLevel = valoare
                }
                break;
            case "delivery_speed":
                var n = parseFloat(valoare);
                if ((isNaN(n)) || (n < 0))
                {
                    localErrorCode == 406;
                }
                else
                {
                    VC_RTE_STORAGE.learnerPrefDeliverySpeed = valoare;
                }
                break;
            case "language":
                VC_RTE_STORAGE.learnerPrefLanguage = valoare;
                break;
            default:
                localErrorCode = 401;
                break;
        }
        return localErrorCode;
    },

    setValueObjectives : function(/*String*/ parameter, /*String*/ valoare)
    {
        var localErrorCode = 0;
        var a = parameter.split(".");
        var n = parseInt(a[0]);
        
        if (!VC_RTE_UTIL.isPositiveInt(n)) 
        {
            return 406;
        }
        
        if (n > VC_RTE_STORAGE.objectives.length) 
        {
            return 407;
        }
        
        if (a[1] == "id")
        {
            if ((!valoare) || (valoare == "") || (!VC_RTE_UTIL.isValidIeeeIdentifier(valoare))) 
            {
                return 406;
            }
            
            if (n == VC_RTE_STORAGE.objectives.length)
            {
                var ok = true;
                for (var i = 0; i < VC_RTE_STORAGE.objectives.length; i++)
                {
                    if (VC_RTE_STORAGE.objectives[i].id == valoare) 
                    {
                        ok = false;
                    }
                }
                if (ok)
                {
                    VC_RTE_STORAGE.objectives[n] = new VC_RTE_MODEL_PROTOTYPES.Objective(valoare);
                }
                else 
                {
                    localErrorCode = 351;
                }
            }
            else
            {
                if ( VC_RTE_STORAGE.objectives[n].id != valoare)
                {
                    localErrorCode = 404;
                }
            }
        }
        else
        {
            if (n >  VC_RTE_STORAGE.objectives.length - 1) 
            {
                return 407;
            }
            
            if ( VC_RTE_STORAGE.objectives[n].id == null)
            {
                return 408;
            }
            
            switch (a[1])
            {
                case "description":
                     VC_RTE_STORAGE.objectives[n].description = valoare;
                    break;
                case "success_status":
                    if (VC_RTE.isValidSuccessStatus(valoare))  VC_RTE_STORAGE.objectives[n].success_status = valoare;
                    else localErrorCode = 406;
                    break;
                case "completion_status":
                    if (VC_RTE.isValidCompletionStatus(valoare))  VC_RTE_STORAGE.objectives[n].completion_status = valoare;
                    else localErrorCode = 406;
                    break;
                case "progress_measure":
                    if ((!isNaN(n)) && (n >= 0.0) && (n <= 1.0))  VC_RTE_STORAGE.objectives[n].progress_measure = valoare;
                    else localErrorCode = 406;
                    break;
                case "score":
                    localErrorCode = VC_RTE.setValueScore( VC_RTE_STORAGE.objectives[n].score, a[2], valoare);
                    break;
                default:
                    localErrorCode = 351;
                    break;
            }
        }
        return localErrorCode;
    },
    setValueCommentFromLearner : function(/*String*/ parametru, /*Object*/ valoare)
    {
        var localErrorCode = 0;
        var tmpComment = null
        var a = parametru.split(".");
        var n = parseInt(a[0]);

        if (!VC_RTE_UTIL.isPositiveInt(n))
        {
            return 406;
        }

        if (n > VC_RTE_STORAGE.commentsFromLearner.length)
        {
            return 407;
        }

        if (n == VC_RTE_STORAGE.commentsFromLearner.length)
        {
            tmpComment = new VC_RTE_MODEL_PROTOTYPES.CmiComment();
        }
        else 
        {
            tmpComment = VC_RTE_STORAGE.commentsFromLearner[n];
        }
        
        switch (a[1])
        {
            case "comment":
                tmpComment.comment = valoare;
                break;
            case "location":
                tmpComment.location = valoare;
                break;
            case "timestamp":
                tmpComment.timestamp = valoare;
                break;
            default:
                localErrorCode = 403;
        }
        
        if (localErrorCode == 0)
        {
            VC_RTE_STORAGE.commentsFromLearner[n] = tmpComment;
        }
        
        return localErrorCode;
    },

    setValueSessionTime:function(/*ISODuration*/ valoare)
    {
        VC_RTE.errorCode = 0;
        n = VC_RTE_UTIL.durationToCentisec(valoare);
        if (VC_RTE.errorCode == 0) 
        {
            VC_RTE_STORAGE.sessionTime = n;
        }
        return VC_RTE.errorCode;
    },
    isValidSuccessStatus : function(/*String*/ valoare)
    {
        var a = new Array("passed", "failed", "unknown");
        for (var i = 0; i < a.length; i++)
        {
            if (valoare == a[i])
            {
                return true;
            }
        }
        return false;
    },
    setValueSuccessStatus : function(/*SuccessStatus*/ valoare)
    {
        if (VC_RTE.isValidSuccessStatus(valoare))
        {
			VC_RTE_STORAGE.primarySuccessStatus = valoare;
            VC_RTE.errorCode = 0;
        }
        else
        {
            VC_RTE.errorCode = 406;
        }
        return VC_RTE.errorCode;
    },

    isValidCompletionStatus : function(/*String*/ valoare)
    {
        var a = new Array("completed", "incomplete", "not attempted", "unknown");
        for (var i = 0; i < a.length; i++) 
        {
            if (valoare == a[i]) 
            {
                return true;
            }
        }
        return false;
    },
    
    setValueScore : function(/*Score*/ score, /*String*/ parameter, /*String*/ valoare)
    {
        var n = parseFloat(valoare);
        if (isNaN(n)) return 406;
        switch (parameter)
        {
            case "scaled":
                if ((n < -1.0) || (n > 1.0)) 
                {
                    return 407;
                }
                score.scaled = n;
                break;
            case "raw":
                score.raw = n;
                break;
            case "min":
                score.min = n;
                break;
            case "max":
                score.max = n;
                break;
            default:
                return 401;
        }
        return 0;
    },
    
    setValueSuspendData : function(/*whatever :)*/ valoare)
    {
        if (valoare.length <= 64000)
        {
            VC_RTE_STORAGE.suspendData = valoare;
            if (valoare.length > 4000)
            {
                //FIXME: sa fie warn                
            }
            return 0;
        }
        else
        {
            return 351;
        }
    },

    setValueSuspendLocation : function(/*String*/ valoare)
    {
        if (valoare.length <= 1000)
        {
            VC_RTE_STORAGE.suspendLocation = valoare;
            return 0;
        }
        else
        {
            return 351;
        }
    },

    isValidInteractionType:function(/*String*/ type)
    {
        var a = new Array("true-false", "choice", "fill-in","long-fill-in", "likert", "matching", "performance", "sequencing", "numeric", "other")
        for (i = 0; i < a.length; i++)
        {
            if (type == a[i]) 
            {
                return true;
            }
        }
        return false;
    },

    setValueCompletionStatus: function(valoare)
    {
        if (VC_RTE.isValidCompletionStatus(valoare))
        {
            VC_RTE_STORAGE.primaryCompletionStatus = valoare;
            VC_RTE.errorCode = 0;
        }
        else
        {
            VC_RTE.errorCode = 406;
        }
        return VC_RTE.errorCode;
    },

    
    
    SetValue:function(/*String*/ parameter, /*Object*/ valoare)
    {
        var localErrorCode = 0;
        var retval = "false";
        VC_RTE.errorCode = 0;
        if (VC_RTE.communicationState < 1)
        {
            localErrorCode = 132;
        }
        else if (VC_RTE.communicationState > 2)
        {
            localErrorCode = 133;
        }
        
        if (localErrorCode == 0)
        {
            var a = parameter.split(".");
            switch (a[0])
            {
                case "cmi":
                    switch (a[1])
                    {
                        case "comments_from_learner":
                            localErrorCode = VC_RTE.setValueCommentFromLearner(VC_RTE_UTIL.stripLeadingParents(parameter, 2), valoare);
                            break;
                        case "comments_from_lms":
                        case "completion_threshold":
                        case "entry":
                        case "launch_data":
                        case "max_time_allowed":
                        case "mode":
                        case "scaled_passing_score":
                        case "time_limit_action":
                        case "total_time":
                            localErrorCode = 404;
                            break;
                        case "completion_status":
                            localErrorCode = VC_RTE.setValueCompletionStatus(valoare);
                            break;
                        case "exit":
                            switch (valoare)
                                    {
                                case "suspend":
                                    VC_RTE_CONFIG.suspended = true;
                                    break;
                                case "":
                                case "logout":
                                case "normal":
                                case "time-out":
                                    break;
                                default:
                                    localErrorCode = 404;
                                    break;
                            }
                            break;
                        case "interactions":
                            localErrorCode = VC_RTE.setValueInteractions(VC_RTE_UTIL.stripLeadingParents(parameter, 2), valoare);
                            break;
                        case "learner_preference":
                            localErrorCode = VC_RTE.setValueLearnerPreference(VC_RTE_UTIL.stripLeadingParents(parameter, 2), valoare);
                            break;
                        case "location":
                            localErrorCode = VC_RTE.setValueSuspendLocation(valoare);
                            break;
                        case "objectives":
                            localErrorCode = VC_RTE.setValueObjectives(VC_RTE_UTIL.stripLeadingParents(parameter, 2), valoare);
                            break;
                        case "progress_measure":
                            localErrorCode = VC_RTE.setValueByName(VC_RTE_UTIL.stripLeadingParents(parameter, 1), valoare);
                            break;
                        case "score":
                            localErrorCode = VC_RTE.setValueScore(VC_RTE_STORAGE.score, VC_RTE_UTIL.stripLeadingParents(parameter, 2), valoare);
                            break;
                        case "session_time":
                            localErrorCode = VC_RTE.setValueSessionTime(valoare);
                            break;
                        case "success_status":
                            localErrorCode = VC_RTE.setValueSuccessStatus(valoare);
                            break;
                            break;
                        case "suspend_data":
                            localErrorCode = VC_RTE.setValueSuspendData(valoare);
                            break;
                        default:
                            localErrorCode = 401;
                            break;
                    }
                    break;
                case "adl":
                    if (a[1] == "nav")
                    {
                        if (a[2] == "request")
                        {
                            switch (valoare)
                                    {
                                case "continue":
                                case "previous":
                                case "exit":
                                case "exitAll":
                                case "abandon":
                                case "abandonAll":
                                case "_none_":
                                    localErrorCode = VC_RTE.setValueByName(parameter, valoare);
                                    break;
                                default:
                                    if ((valoare.indexOf("choice") < 8) || (valoare.indexOf("{target=") != 0) || (valoare.indexOf("}") != valoare.indexOf("choice") - 1))
                                    {
                                        localErrorCode = 406;
                                    }
                                    break;
                            }
                        }
                        else
                        {
                            localErrorCode = 406;
                        }
                    }
                    else
                    {
                        //FIXME sa fie warn                        
                        localErrorCode = 401;
                    }
                    break;
                default:
                    if (parameter == "")
                    {
                        localErrorCode = 406;
                    }
                    else
                    {
                        //FIXME sa fie warn                        
                        localErrorCode = 401;
                    }
            }
        }
        if ((localErrorCode == 0) && (VC_RTE.errorCode != 0)) 
        {
            localErrorCode = 0;
        }
        
        VC_RTE.errorCode = localErrorCode;
        retval = ((VC_RTE.errorCode == 0).toString());
                
        
        return retval;
    },
    
    GetValue:function(/*String*/ parameter)
    {
        var retval = "";
        var localErrorCode = 0;        

        
        if (VC_RTE.communicationState < 1)
        {
            localErrorCode = 122;
        }
        else if (VC_RTE.communicationState > 2)
        {
            localErrorCode = 123; // !ups
        }

        if (localErrorCode == 0)
        {
            var a = parameter.split(".")
            VC_RTE.errorCode = 0;           
            switch (a[0])
            {
                case "cmi":
                    switch(a[1])
                    {
                        case "_version":
                            retval = "1.0.AEL_VC_RTE";
                            break;
                        case "comments_from_learner":
                            retval = VC_RTE.getValueCommentFromLearner(VC_RTE_UTIL.stripLeadingParents(parameter,2));
                            break;
                        case "comments_from_lms":
                            retval = VC_RTE.getValueCommentFromLms(VC_RTE_UTIL.stripLeadingParents(parameter,2));
                            break;
                        case "completion_status":
                            retval = VC_RTE.getValueCompletionStatus();
                            break;
                        case "completion_threshold":
                            retval = "";
                            break;
                        case "credit":
                            if (!VC_RTE_CONFIG.defaultCMICredit) 
                            {
                                VC_RTE_CONFIG.defaultCMICredit = "credit";
                            }
                            retval = VC_RTE_CONFIG.defaultCMICredit;
                            break;
                        case "entry":
                            if (VC_RTE.resume) 
                            {
                                retval = "resume";
                            }
                            else 
                            {
                                retval = "ab-initio";
                            }
                            break;
                        case "exit":
                            retval = "";
                            localErrorCode = 405;
                            break;
                        case "interactions":
                            retval = VC_RTE.getValueInteractions(VC_RTE_UTIL.stripLeadingParents(parameter,2));
                            break;
                        case "launch_data":
                            retval = "";
                            break;
                        case "learner_id":
                            retval = VC_RTE_CONFIG.learnerId;
                            break;
                        case "learner_name":
                            retval = VC_RTE_CONFIG.learnerName;
                            break;
                        case "learner_preference":
                            retval = VC_RTE.getValueLearnerPreference(VC_RTE_UTIL.stripLeadingParents(parameter,2));
                            break;
                        case "location":
                            retval = VC_RTE_STORAGE.suspendLocation;
                            break;
                        case "max_time_allowed":
                            retval = "";
                            break;
                        case "mode":
                            retval = ((VC_RTE_CONFIG.defaultCMIMode=="")?"normal":VC_RTE_CONFIG.defaultCMIMode);
                            break;
                        case "objectives":
                            retval = VC_RTE.getValueObjectives(VC_RTE_UTIL.stripLeadingParents(parameter,2));
                            break;
                        case "progress_measure":
                            retval = VC_RTE.getValueByName(VC_RTE_UTIL.stripLeadingParents(parameter,1));
                            break;
                        case "scaled_passing_score":
                            retval = VC_RTE_CONFIG.passingScore.toString();
                            break;
                        case "score":
                            retval = VC_RTE.getValueScore(VC_RTE_STORAGE.score,VC_RTE_UTIL.stripLeadingParents(parameter,2));
                            break;
                        case "session_time":
                            retval = "";
                            localErrorCode = 405;
                            break;
                        case "success_status":
                            retval = VC_RTE.getValueSuccessStatus(); 
                            break;
                        case "suspend_data":
                            retval = VC_RTE_STORAGE.suspendData;
                            break;
                        case "time_limit_action":
                            retval = "continue,no message";
                            break;
                        case "total_time":
                            retval = VC_RTE_UTIL.centisecsToDuration(VC_RTE_STORAGE.totalAttemptTime);
                            break;
                        case "version":
                            retval = "1.0";
                            break;
                        default:
                            retval = "";
                            localErrorCode = 401;
                            break;
                    }
                    break;
                case "adl":
                    if (a[1] == "nav")
                    {
                        if (a[2] == "request")
                        {
                            switch(a[3])
                            {
                            case "continue":
                            case "previous":
                            case "exit":
                            case "exitAll":
                            case "abandon":
                            case "abandonAll":
                            case "_none_":
                                retval = VC_RTE.getValueByName(parameter);
                                break;
                            default:
                                if ((val.indexOf("choice") < 8) || (val.indexOf("{target=") != 0) || (val.indexOf("}") != val.indexOf("choice") - 1))
                                {
                                    localErrorCode = 406;
                                }
                                break;
                            }
                        }
                        else if (a[2] == "request_valid")
                        {
                            switch(a[3])
                            {
                                case "continue":
                                case "previous":
                                    retval = "unknown";
                                    break;
                                case "choice":
                                    if (a[4].indexOf("target=") == 0) 
                                    {
                                        retval = "unknown";
                                    }
                                    else localErrorCode = 406;
                                    break;
                                default:
                                    localErrorCode = 406;
                                    break;
                            }
                        }
                        else
                        {
                            localErrorCode = 406;
                        }
                    }
                    break;
                default:
                    if (parameter == "")
                    {
                        localErrorCode = 406;
                    }
                    else
                    {                        
                        localErrorCode = 201;
                    }
                    break;
            }
        }
        
        if ((localErrorCode == 0) && (VC_RTE.errorCode != 0)) 
        {
            localErrorCode = 0;
        }
        VC_RTE.errorCode = localErrorCode;        
        
        return retval + "";
    },
    
    Initialize:function(/*String*/ parameter)
    {
        VC_RTE.errorCode = 0;
        var retval = "true";
        if (VC_RTE.communicationState == 0)
        {
            retval = "true";
            VC_RTE.launch = false;
            VC_RTE.communicationState = 1;
        }
        else if (VC_RTE.communicationState < 3)
        {
            retval = "false";
            VC_RTE.errorCode = 103;
        }
        else if (VC_RTE.communicationState > 2)
        {
            retval = "false";
            VC_RTE.errorCode = 104;
        }
                
        
        // comunicam cu LMS-ul
        VC_RTE_COMM.sendInitialize();
        
        return retval + "";
    },
    
    Terminate:function(/*String*/ parameter)
    {
        VC_RTE.errorCode = 0;
        var retval = null;
        if (VC_RTE.communicationState == 0)
        {
            retval = "false";
            VC_RTE.errorCode = 112;
        }
        else if (VC_RTE.communicationState == 1)
        {
            retval = "true";
            VC_RTE.communicationState = 3;
        }
        else
        {
            retval = "false";
            VC_RTE.errorCode = 113;
        }
                
        
        // comunicam cu LMS-ul
        VC_RTE_COMM.sendTerminate();
        
        return retval + "";
    },

    Commit:function()
    {
        VC_RTE.errorCode = 0;
        var retval = "true";
        if (VC_RTE.communicationState < 1)
        {
            VC_RTE.errorCode = 142;
            retval = "false";
        }
        if (VC_RTE.communicationState > 2)
        {
            VC_RTE.errorCode = 143;
            retval = "false";
        }
        
        // comunicam cu LMS-ul
        VC_RTE_COMM.sendCommit();
        
        return retval;
    },

    GetLastError:function()
    {        
        return VC_RTE.errorCode + "";
    },
    
    GetErrorString:function(/*String*/ errorCode)
    {
        var retval = null;
        if ((VC_RTE.debug) && (typeof errorCode == 'number' && isFinite(errorCode)))
        {            
        }
        
        var n = parseInt(errorCode);
        
        if (isNaN(n))
        {
            VC_RTE.errorCode = 406; // Type mismatch
            return "";
        }

        switch (n)
        {
            case 0: retval = "No error"; break;
            case 101: retval = "General exception"; break;
            case 102: retval = "General initialization failure"; break;
            case 103: retval = "Already initialized"; break;
            case 104: retval = "Content instance terminated"; break;
            case 111: retval = "General termination failure"; break;
            case 112: retval = "Termination before initialization"; break;
            case 113: retval = "Termination after termination"; break;
            case 122: retval = "Retrieve data before initialization"; break;
            case 123: retval = "Retrieve data after termination"; break;
            case 132: retval = "Store data before initialization"; break;
            case 133: retval = "Store data after termination"; break;
            case 142: retval = "Commit before initialization"; break;
            case 143: retval = "Commit after termination"; break;
            case 201: retval = "General argument error"; break;
            case 302: retval = "General get failure"; break;
            case 351: retval = "General set failure"; break;
            case 391: retval = "General commit failure"; break;
            case 401: retval = "Undefined data model element"; break;
            case 402: retval = "Unimplemented data model element"; break;
            case 403: retval = "Data model element value not initialized"; break;
            case 404: retval = "Data model element is read only"; break;
            case 405: retval = "Data model element is write only"; break;
            case 406: retval = "Data model element type mismatch"; break;
            case 407: retval = "Data model element value out of range"; break;
            case 408: retval = "Data model element dependency not established"; break;
            default: retval = "General exception"; break;
        }        
        return retval + "";    
    },
    
    GetDiagnostic:function()
    {        
        return "Diagnostic not available in AeL Virtual Class RTE";
    }
}
