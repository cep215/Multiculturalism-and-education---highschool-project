var strLocation = String(window.location)
var arrLocation = strLocation.split('/')
var numLength = arrLocation.length
var strSwfName = arrLocation[numLength-2]
var strFolderName = arrLocation[numLength-3]
var booIsCompleted = false


window.onload = function () {
	initializeCommunication()}
	
	
window.onunload = function() {
	if (booIsCompleted  != true) 
		storeDataValue( "cmi.completion_status", "incomplete" )
	terminateCommunication()}
	
	
function fSetCompleted () {
	storeDataValue( "cmi.completion_status", "completed" )
	booIsCompleted = true}

	
function fGetURL (s) {
	window.open(s)}
	

function fGetValue (s) {
	val = getAPIHandle().GetValue(s);
	if (val)
	{
		storeDataValue( "cmi.completion_status", "completed" )
		booIsCompleted = true
	}	
	return val}
	
	
	
function LMS_Commit () {
   // do not call a set after Terminate() was called
   if ( terminated != "true" )
   {
      var api = getAPIHandle();

      if ( api == null )
      {
		alert('api==null');
         return "";
      }
      else
      {
		alert('commit');
		var result = api.Commit("");
		// var errCode = retrieveLastErrorCode();
		// alert(result+' = '+errCode);
		alert(result);
		 return result;
      }
   }
   else
   {
	alert('terminated');
      return "";
   }
}