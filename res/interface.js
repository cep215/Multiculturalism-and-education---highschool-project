window.onresize = function () {
	numW = document.body.clientWidth
	numH = document.body.clientHeight
	if (mcIframe) {
		mcIframe.style.height = mcSidebar.style.height = (numH - numT - numB) +'px'
	}
	fUpdate()}
	
	
window.onload = function () {
	numT = document.getElementById('top').offsetHeight
	numR = document.getElementById('right').offsetWidth
	numB = document.getElementById('bottom').offsetHeight
	numL = document.getElementById('left').offsetWidth
	mcSidebar = document.getElementById('sidebar')
	mcTree = document.getElementById('tree')
	mcShow = document.getElementById('show')
	mcHide = document.getElementById('hide')
	mcIframe = document.getElementById('iframe')
	mcPrevious = document.getElementById('previous')
	mcContinue = document.getElementById('continue')
	mcContentFrame = document.getElementById('contentFrame')
	mcTitle = document.getElementById('title')
	
	
	mcPrevious.onclick = function () {
		if (numCurrent-1<0) return false
		arr[numCurrent-1].onclick()
		return false}
		
		
	mcContinue.onclick = function () {
		if (numCurrent+1>arr.length-1) return false
		arr[numCurrent+1].onclick()
		return false}
		
	if (mcShow)
	{
		mcShow.onclick = function () {
			mcShow.style.display = 'none'
			mcTree.style.display = 'block'
			fUpdate()
			return false}
	}
		
	
	if (mcShow)
	{
		mcHide.onclick = function () {
			mcTree.style.display = 'none'
			mcShow.style.display = 'block'
			fUpdate()
			return false}
	}
		
		
	numCurrent = 0		
	strAddress = String(window.location).split('#')[1]							
	arr = document.getElementById('links').getElementsByTagName('a')
	for (var i = arr.length-1; i>=0; i--) {
		arr[i].nr = i
		if (String(arr[i].href).split('#')[1] == strAddress) numCurrent = i
		arr[i].onclick = function () {
			if (mcIframe) {			
				mcIframe.src = String(this.href).split('#')[1]
			}
			mcContentFrame.src = this.href
			arr[numCurrent].className = ''
			this.className = 'active'
			mcTitle.innerHTML = this.innerHTML
			numCurrent = this.nr
			mcContinue.className = this.nr == arr.length - 1? 'disabled' : ''
			mcPrevious.className = this.nr == 0? 'disabled' : ''
			//return false
			}}
	
	window.onresize()
	arr[numCurrent].onclick()}
	
	
function fUpdate() {
	numS = mcSidebar.offsetWidth
	if (mcIframe) {
		mcIframe.style.left = (numL+numS)+'px'
		mcIframe.style.width = (numW-numR-numL-numS)+'px'
	}
}