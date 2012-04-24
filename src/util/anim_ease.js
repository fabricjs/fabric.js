(function(){

function sine(pos){
	return (-Math.cos(pos * Math.PI) / 2) + 0.5; 
}

/** @namespace */
fabric.util.ease = {
  sine: sine
};

}());