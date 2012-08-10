var svg_ns = "http://www.w3.org/2000/svg";
var xlink_ns = "http://www.w3.org/1999/xlink";

var count=0;
var column = 0;
var topsvg = document.documentElement;
var startY = 50;
var rowHeight = 8;
var rowWidth = 240;
var fontSize = "8";
var isPassed = true;


/************************************************************************
 ************************************************************************
 * Utility Functions
 ************************************************************************
 ************************************************************************/


function drawString( text, color )
{
  node_to_insert=document.createElementNS(svg_ns,"text");
  node_to_insert.setAttributeNS(null,"font-size",fontSize);	
  var xVal = 5 +(  column * rowWidth );
  node_to_insert.setAttributeNS(null,"x", xVal.toString() );	
  var yVal = startY + count++ * rowHeight;
  node_to_insert.setAttributeNS(null, "y",  yVal.toString()  );
  node_to_insert.setAttributeNS(null, "fill",  color  );
  node_to_insert.textContent=text ;
  document.getElementById( "test-body-content" ).appendChild(node_to_insert);          
  
  if ( count > 26 && column == 0  )
  {
      count = 1;
      column++;
  }  
}




/**
 * Get a string representation of the given SVGPath object.
 */
function getSVGPathString( path )
{
  if ( 0 == path.numberOfSegments )
  {
    return "";
  }

  var str = "[ ";
  for ( var segNum = 0; segNum < path.numberOfSegments; ++segNum )
  {
    var pathSeg = path.getSegment( segNum );

    var numParams = 2;
    switch( pathSeg )
    {
    case SVGPath.MOVE_TO:
      str += "M";
      break;

    case SVGPath.LINE_TO:
      str += "L";
      break;

    case SVGPath.CURVE_TO:
      str += "C";
      numParams = 6;
      break;

    case SVGPath.QUAD_TO:
      str += "Q";
      numParams = 4;
      break;

    case SVGPath.CLOSE:
      str += "Z";
      numParams = 0;
      break;

    default:
      // Should not happen.
      return 0;
    }

    str += " ";

    for ( var parNum = 0; parNum < numParams; ++parNum )
    {
      str += path.getSegmentParam( segNum, parNum ).toString();
      str += " ";
    }

    str += " ";
  }

  str += "]";
  return str;
}


/**
 * Check if two SVGPath objects are equal.
 * p1  : first path
 * p2  : second path
 * dev : allowed +/- deviation for float values
 * Returns 1 if they are equal, 0 otherwise.
 */
function isEqualSVGPath( p1, p2, dev )
{
  if ( p1.numberOfSegments != p2.numberOfSegments )
  {
    return 0;
  }

  for ( var segNum = 0; segNum < p1.numberOfSegments; ++segNum )
  {
    var p1Seg = p1.getSegment( segNum );
    var p2Seg = p2.getSegment( segNum );
    if ( p1Seg != p2Seg )
    {
      return 0;
    }

    var numParams = 2;
    switch( p1Seg )
    {
    case SVGPath.MOVE_TO:
      break;

    case SVGPath.LINE_TO:
      break;

    case SVGPath.CURVE_TO:
      numParams = 6;
      break;

    case SVGPath.QUAD_TO:
      numParams = 4;
      break;

    case SVGPath.CLOSE:
      numParams = 0;
      break;

    default:
      // Should not happen.
      return 0;
    }

    for ( var parNum = 0; parNum < numParams; ++parNum )
    {
      var p1Param = p1.getSegmentParam( segNum, parNum );
      var p2Param = p2.getSegmentParam( segNum, parNum );
      if 
      (
        ( ( p1Param < ( p2Param - dev ) ) || ( p1Param >( p2Param + dev ) ) ) &&
        ( ( p2Param < ( p1Param - dev ) ) || ( p2Param >( p1Param + dev ) ) )
      )
      {
        return 0;
      }
    }
  }
  return 1;
}


/************************************************************************
 ************************************************************************
 * Test Iteration Object Definitions
 ************************************************************************
 ************************************************************************/


/**
 * Create a get*Trait() test iteration object.
 * id       : iter id
 * fnName   : function name (e.g. getTrait, getTraitNS, etc.)
 * ns       : namespace
 * elem     : SVG element
 * attr     : attribute/property name
 * expected : expected value, 0 if no value is expected
 * dev      : allowed +/- deviation for float values
 * ecode    : expected exception code, 0 if no exception is expected
 * ename    : expected exception string, for display purposes, 0 if no exception is expected
 */
function getTraitIter
( 
  id,
  fnName, 
  ns, 
  elem, 
  attr, 
  expected,
  dev,
  ecode,
  ename 
)
{
  this.id = id;
  this.fnName = fnName;
  this.ns = ns;
  this.elem = elem;
  this.attr = attr;
  this.expected = expected;
  this.dev = dev;
  this.ecode = ecode;
  this.ename = ename;
}


/**
 * Create a set*Trait() test iteration object.
 * id          : iter id
 * fnName      : function name (e.g. setTrait, setTraitNS, etc.)
 * getFnName   : getter function name (e.g. getTrait, getTraitNS, etc.), used for verification
 * ns          : namespace
 * elem        : SVG element
 * attr        : attribute/property name
 * value       : value to set
 * expected    : expected value from getter function, 0 if no value expected
 * dev         : allowed +/- deviation for float values
 * ecode       : expected exception code, 0 if no exception expected
 * ename       : expected exception string, for display purposes, 0 if no exception expected
 */
function setTraitIter
( 
  id,
  fnName, 
  getFnName, 
  ns, 
  elem, 
  attr, 
  value, 
  expected,
  dev,
  ecode,
  ename 
)
{
  this.id = id;
  this.fnName = fnName;
  this.getFnName = getFnName;
  this.ns = ns;
  this.elem = elem;
  this.attr = attr;
  this.value = value;
  this.expected = expected;
  this.dev = dev;
  this.ecode = ecode;
  this.ename = ename;
}


/************************************************************************
 ************************************************************************
 * Single Test Iteration Run Methods
 ************************************************************************
 ************************************************************************/


/**
 * Run a single get*Trait() test iteration.
 * iter : a getTraitIter object
 */
function runSingleGetTraitIter( iter )
{
  //DEBUG
  //drawString( "runSingleGetTraitIter( "
  //            + "id="        + iter.id
  //            + ", fnName="   + iter.fnName 
  //            + ", ns="       + iter.ns 
  //            + ", elem="     + iter.elem 
  //            + ", attr="     + iter.attr 
  //            + ", expected=" + iter.expected
  //            + ", dev="      + iter.dev 
  //            + ", ecode="    + iter.ecode
  //            + ", ename="    + iter.ename 
  //            + " )" );

  try
  {
    var cmd = iter.id + ": ";
    var fnNameLen = iter.fnName.length;
    var fnNameSuffix = iter.fnName.substring( fnNameLen - 2, fnNameLen );
    if ( fnNameSuffix == "NS" )
    {
      cmd += iter.elem.id 
        + "." 
        + iter.fnName 
       + "(  "
        + iter.ns 
       + ", \"" 
        + iter.attr 
        + "\" )";
      value = iter.elem[iter.fnName]( iter.ns, iter.attr );
    }
    else if ( fnNameSuffix == "it" )
    {
      cmd += iter.elem.id 
        + "." 
        + iter.fnName 
        + "( \"" 
        + iter.attr 
        + "\" )";
      value  = iter.elem[iter.fnName](iter.attr);
    }
    else
    {
      isPassed = false;
      drawString( "runSingleGetTraitIter: Invalid fnName = " + iter.fnName, "red" );
    }

    if ( iter.ecode )
    {
      isPassed = false;
      drawString( "No exception was thrown! Expected " + iter.ename, "red" );
    }
    else if ( iter.fnName.match("Float") )
    {
      if ( ( value >= ( iter.expected - iter.dev ) ) && ( value <= ( iter.expected + iter.dev ) ) )
      {
        drawString( cmd + " = \"" + value + "\" (" + iter.expected + " +/- " + iter.dev + ")", "green"  );
      }
      else
      {
        isPassed = false;
        drawString( cmd + " = \"" + value + "\", expected = " + iter.expected + " +/- " + iter.dev, "red" );
      }
    }
    else if ( iter.fnName.match("Matrix") )
    {
      if
      (
           ( value.getComponent(0) >= ( iter.expected.getComponent(0) - iter.dev ) ) 
        && ( value.getComponent(0) <= ( iter.expected.getComponent(0) + iter.dev ) ) 
        && ( value.getComponent(1) >= ( iter.expected.getComponent(1) - iter.dev ) ) 
        && ( value.getComponent(1) <= ( iter.expected.getComponent(1) + iter.dev ) ) 
        && ( value.getComponent(2) >= ( iter.expected.getComponent(2) - iter.dev ) ) 
        && ( value.getComponent(2) <= ( iter.expected.getComponent(2) + iter.dev ) ) 
        && ( value.getComponent(3) >= ( iter.expected.getComponent(3) - iter.dev ) ) 
        && ( value.getComponent(3) <= ( iter.expected.getComponent(3) + iter.dev ) ) 
        && ( value.getComponent(4) >= ( iter.expected.getComponent(4) - iter.dev ) ) 
        && ( value.getComponent(4) <= ( iter.expected.getComponent(4) + iter.dev ) ) 
        && ( value.getComponent(5) >= ( iter.expected.getComponent(5) - iter.dev ) ) 
        && ( value.getComponent(5) <= ( iter.expected.getComponent(5) + iter.dev ) ) 
      )
      {
        drawString( cmd + " = [" 
          + value.getComponent(0) + " "
          + value.getComponent(1) + " "
          + value.getComponent(2) + " "
          + value.getComponent(3) + " "
          + value.getComponent(4) + " "
          + value.getComponent(5)
          + "] ( [" 
          + iter.expected.getComponent(0) + " "
          + iter.expected.getComponent(1) + " "
          + iter.expected.getComponent(2) + " "
          + iter.expected.getComponent(3) + " "
          + iter.expected.getComponent(4) + " "
          + iter.expected.getComponent(5)
          + "] +/- " + iter.dev + ")", "green" );
      }
      else
      {
        isPassed = false;
        drawString( cmd + " = [" 
          + value.getComponent(0) + " "
          + value.getComponent(1) + " "
          + value.getComponent(2) + " "
          + value.getComponent(3) + " "
          + value.getComponent(4) + " "
          + value.getComponent(5)
          + "], expected = [" 
          + iter.expected.getComponent(0) + " "
          + iter.expected.getComponent(1) + " "
          + iter.expected.getComponent(2) + " "
          + iter.expected.getComponent(3) + " "
          + iter.expected.getComponent(4) + " "
          + iter.expected.getComponent(5)
          + "] +/- " + iter.dev, "red" );
      }
    }
    else if ( iter.fnName.match("Rect") )
    {
      if
      (
           ( value.x      >= ( iter.expected.x      - iter.dev ) ) 
        && ( value.x      <= ( iter.expected.x      + iter.dev ) ) 
        && ( value.y      >= ( iter.expected.y      - iter.dev ) ) 
        && ( value.y      <= ( iter.expected.y      + iter.dev ) ) 
        && ( value.width  >= ( iter.expected.width  - iter.dev ) ) 
        && ( value.width  <= ( iter.expected.width  + iter.dev ) ) 
        && ( value.height >= ( iter.expected.height - iter.dev ) ) 
        && ( value.height <= ( iter.expected.height + iter.dev ) ) 
      )
      {
        drawString( cmd + " = [" 
          + value.x      + " "
          + value.y      + " "
          + value.width  + " "
          + value.height
          + "] ( [" 
          + iter.expected.x      + " "
          + iter.expected.y      + " "
          + iter.expected.width  + " "
          + iter.expected.height
          + "] +/- " + iter.dev + ")", "green" );
      }
      else
      {
        isPassed = false;
        drawString( cmd + " = [" 
          + value.x      + " "
          + value.y      + " "
          + value.width  + " "
          + value.height
          + "], expected = [" 
          + iter.expected.x      + " "
          + iter.expected.y      + " "
          + iter.expected.width  + " "
          + iter.expected.height
          + "] +/- " + iter.dev, "red" );
      }
    }
    else if ( iter.fnName.match("Path") )
    {
      if ( isEqualSVGPath ( value, iter.expected, iter.dev ) )
      {
        drawString( cmd + " = " + getSVGPathString(value) 
          + " ( " + getSVGPathString(iter.expected) + " +/- " + iter.dev + " )", "green" );
      }
      else
      {
        isPassed = false;
        drawString( cmd + " = " + getSVGPathString(value) 
          + ", expected = " + getSVGPathString(iter.expected) + " +/- " + iter.dev, "red" );
      }
    }
    else if ( iter.fnName.match("RGBColor") )
    {
      if ( value == null && iter.expected == null )
      {
        drawString( cmd + " = [ null ] ( null ) ", "green" );
      }
      else if
      (
        ( value.red   >= ( iter.expected.red   - iter.dev ) ) &&
        ( value.red   <= ( iter.expected.red   + iter.dev ) ) &&
        ( value.green >= ( iter.expected.green - iter.dev ) ) &&
        ( value.green <= ( iter.expected.green + iter.dev ) ) &&
        ( value.blue  >= ( iter.expected.blue  - iter.dev ) ) &&
        ( value.blue  <= ( iter.expected.blue  + iter.dev ) )
      )
      {
        drawString( cmd + " = [ "
          + value.red   + ", "
          + value.green + ", "
          + value.blue
          + " ] ( "
          + iter.expected.red   + ", "
          + iter.expected.green + ", "
          + iter.expected.blue
          + " ] +/- " + iter.dev + " )", "green" );
      }
      else
      {
        isPassed = false;
        drawString( cmd + " = [ "
          + value.red   + ", "
          + value.green + ", "
          + value.blue
          + " ], expected = [ "
          + iter.expected.red   + ", "
          + iter.expected.green + ", "
          + iter.expected.blue
          + " ] +/- " + iter.dev, "red" );
      }
    }
    else
    {
      if ( value == iter.expected )
      {
        drawString( cmd + " = \"" + value + "\"", "green" );
      }
      else
      {
        isPassed = false;
        drawString( cmd + " = \"" + value + "\", expected = \"" + iter.expected + "\"", "red" );
      }
    }
  }
  catch(e)
  {
    if ( e.code == iter.ecode )
    {    
      drawString( cmd + ", got expected exception = " + iter.ename, "green" );
    }
    else
    {
      isPassed = false;
      drawString( cmd + ", got unexpected exception = (" + e.code + ") "  
                      + ", expecting = (" + iter.ecode + ") " + iter.ename, "red" );
    }
  }
}


/**
 * Run a single set*Trait() test iteration.
 * iter : a setTraitIter object
 */
function runSingleSetTraitIter( iter )
{
  //DEBUG
  //drawString( "runSingleSetTraitIter( "
  //            + "id="            + iter.id
  //            + ", fnName="      + iter.fnName 
  //            + ", getFnName="   + iter.getFnName 
  //            + ", ns="          + iter.ns 
  //            + ", elem="        + iter.elem 
  //            + ", attr="        + iter.attr 
  //            + ", value="       + iter.value 
  //            + ", expected="    + iter.expected 
  //            + ", dev="         + iter.dev 
  //            + ", ecode="       + iter.ecode 
  //            + ", ename="       + iter.ename 
  //            + " )" );


  try
  {
    var cmd = iter.id + ": ";
    var fnNameLen = iter.fnName.length;
    var fnNameSuffix = iter.fnName.substring( fnNameLen - 2, fnNameLen );
    if ( fnNameSuffix == "NS" )
    {
      cmd += iter.elem.id 
        + "." 
        + iter.fnName 
       + "(  "
        + iter.ns 
       + ", \"" 
        + iter.attr 
        + "\", \"" 
        + iter.value 
        + "\" )";
      iter.elem[iter.fnName]( iter.ns, iter.attr, iter.value );
      drawString( cmd, "green" );
    }
    else if ( fnNameSuffix == "it" )
    {
      cmd += iter.elem.id 
        + "." 
        + iter.fnName 
        + "( \"" 
        + iter.attr 
        + "\", \"" 
        + iter.value 
        + "\" )";
      iter.elem[iter.fnName]( iter.attr, iter.value );
      drawString( cmd, "green" );
    }
    else
    {
      isPassed = false;
      drawString( "runSingleSetTraitIter: Invalid fnName = " + iter.fnName , "red");
    }

    if ( iter.ecode )
    {
      isPassed = false;
      drawString( "No exception was thrown! Expected " + iter.ename, "red" );
    }
    else
    {
      runSingleGetTraitIter
      ( 
        new getTraitIter
        ( 
          iter.id, 
          iter.getFnName, 
          iter.ns, 
          iter.elem, 
          iter.attr, 
          iter.expected,
          iter.dev,
          0,
          0
        ) 
      );
    }

  }
  catch(e)
  {
    if ( e.code == iter.ecode )
    {    
      drawString( cmd + ", got expected exception = " + iter.ename, "green" );
    }
    else
    {
      isPassed = false;
      drawString( cmd + ", got unexpected exception = (" + e.code + ") "  
                      + ", expecting = (" + iter.ecode + ") " + iter.ename, "red" );
    }
  }

}


/************************************************************************
 ************************************************************************
 * Bulk Test Iteration Run Methods
 ************************************************************************
 ************************************************************************/


/**
 * Run all given getTraitIters.
 * iters : array of getTraitIter objects
 */
function runGetTraitIters( iters )
{
  var value = "";
  var elem = 0;

  for( var i = 0; i < iters.length; ++i )
  {
    try
    {
      runSingleGetTraitIter( iters[i] );
    }
    catch(e)
    {
      isPassed = false;
      drawString( "runGetTraitIter: Unexpected exception thrown! (" + e.code + ") ", "red" );
    }
  }
}


/**
 * Run all given setTraitIters.
 * iters : array of setTraitIter objects
 */
function runSetTraitIters( iters )
{
  var value = "";
  var elem = 0;

  for( var i = 0; i < iters.length; ++i )
  {
    try
    {
      runSingleSetTraitIter( iters[i] );
    }
    catch(e)
    {
      isPassed = false;
      drawString( "runSetTraitIters: Unexpected exception thrown! (" + e.code + ") ", "red" );
    }
  }
}



