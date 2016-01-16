<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
    xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
    xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:ims="http://www.imsglobal.org/xsd/imscp_v1p1">

	<xsl:template match="/">
	  <html>

	  <head>
		<link href="res/interface.css" rel="stylesheet" type="text/css" />
		<script type='text/javascript' src='res/interface.js'></script>
		<script type='text/javascript' src='res/RTE.js'></script>
		<script type='text/javascript' src='res/RTEAPI.js'></script>
	  </head>
	  <body>
		<div id='top'>
        	<div id="top_left">
				<a href='..'>
                <img src='res/subject.png' width="48" height="48" /></a>
			</div>
            <div id="top_titluri">
            	<h1><xsl:value-of select="ims:manifest/ims:organizations/ims:organization/ims:title"/></h1>
                <h2 id='title'></h2>
            </div>
            <div id="top_right">
				<img src='res/logo.png' width="48" height="48" />
			</div>
		</div>



		<div id='right'>
		</div>

		<iframe id='contentFrame' name='contentFrame'>
		</iframe>


		<div id='left'>
		</div>
		<div id='sidebar'>
			<div id='tree'>
				<ul id='links'>
				  <xsl:for-each select="ims:manifest/ims:organizations/ims:organization">
					<xsl:apply-templates select="ims:item"/>
				  </xsl:for-each>
				</ul>

			</div>
		</div>

	  </body>
	  </html>
	</xsl:template>



	<xsl:template match="ims:item">

		<xsl:choose>
			<xsl:when test="@identifierref">
				<li>
					<xsl:variable name="idref" select="@identifierref"/>
					<xsl:variable name="ref" select="//ims:manifest/ims:resources/ims:resource[@identifier=$idref]/@href"/>

					<xsl:element name="a">
					  <xsl:attribute name="href"><xsl:value-of select="$ref"/></xsl:attribute>
					  <xsl:attribute name="target">contentFrame</xsl:attribute>
					  <xsl:value-of select="ims:title"/>
					</xsl:element>
				</li>
			</xsl:when>
			<xsl:otherwise>
				<li><xsl:value-of select="ims:title"/></li>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:if test="ims:item">
			<ul>
				<xsl:apply-templates select="ims:item"/>
			</ul>
		</xsl:if>

	</xsl:template>


</xsl:stylesheet>
