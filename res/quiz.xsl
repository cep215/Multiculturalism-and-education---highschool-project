<defaults>
	<quiz contentPadding='6' CSSPath='quiz.css' headerPadding='4' toolbar='true' XSLPath='quiz.xsl' />
	<feedback title='Information' padding='5' offset='5' CSSTitle='html {font-family:Arial; font-size:17px; color:#ffffff; leading:0}' />
	
	<choice type='single-choice' margin='10' separator='6' />
	<answer padding='10' spacing='10' correct='false' />

	<matching bridge='30' layout='vertical' separator='10' size='50,50' />
	<source padding='2' />
	<target padding='2' correct='' />
	
	<fill-in />
	<long-fill-in />
	<input correct='' height='29' maxChars='0' padding='2' text='' width='100' />
	
	<drag-and-drop bridge='20' separat='10' sizeX='100' sizeY='29' />
	<drag infinite='false' padding='2' />
	<drop correct='1' padding='2' />
	
	<list />
	<select width='110' height='29' text='' />
	<option correct='false' />
	
	
	<img align='' offset='-2' />
	
</defaults>