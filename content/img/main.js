var booFullScreen = false
var numCurrent = 0
var arr = []
var nodeOld
			
			
window.onload = function () {
	var iframe = document.getElementById('iframe')
	var sidebar = document.getElementById('sidebar')
	
	var arrows = document.getElementById('arrows')
	arrows.onclick = function () {
		var body = document.getElementsByTagName('body')[0]
		if (booFullScreen) {
			sidebar.style.left = '0px'
			body.style.paddingLeft = '300px'}
		else {
			sidebar.style.left = '-279px'
			body.style.paddingLeft = '21px'}
		booFullScreen = !booFullScreen
		return false}
	arrows.onmouseover = function () {
		this.style.backgroundPosition = booFullScreen? '-58px 2px' : '-18px 2px'
		this.style.backgroundColor = '#dddddd'}
	arrows.onmouseout = function () {
		this.style.backgroundPosition = booFullScreen? '-38px 2px' : '2px 2px'
		this.style.backgroundColor = ''}
	
	arr = document.getElementById('sidebar').getElementsByTagName('a')
	nodeOld = arr[0]
	for (var i = 0; i<arr.length; i++) {
		arr[i].nr = i
		arr[i].onclick = function () {
			nodeOld.className = ''
			iframe.src = this.href
			this.className = 'active'
			nodeOld = this
			numCurrent = this.nr
			return false}}}
	
function prev () {
	if (numCurrent-1<0) return
	numCurrent--
	arr[numCurrent].onclick()}

	
function next () {
	if (numCurrent+1>arr.length-1) return
	numCurrent++
	arr[numCurrent].onclick()}

	
function embed (container, path, width, height, vars) {
	var flash = document.getElementById(container)
	if (flash) flash.innerHTML='<object type="application/x-shockwave-flash" data="'+path+'" width="'+width+'" height="'+height+'"><param name="allowScriptAccess" value="always" /><param name="movie" value="'+path+'" /><param name="FlashVars" value="'+vars+'" /></object>';}