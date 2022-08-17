var search = new URLSearchParams(document.location.search);
var numObjects = parseInt(search.get('n'), 10) || 200, radius = 20, width = 600, height = 600, optimizeCaching = parseInt(search.get('optimize_caching'));
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}
window.addEventListener('load', () => {
    document.getElementById('numshapes').innerHTML = numObjects;
    const optimizeCachingCheckbox = document.getElementById('optimize_caching');
    optimizeCachingCheckbox.onchange = function () {
        if (optimizeCaching !== optimizeCachingCheckbox.checked) {
            document.location.search = createSearchQuery(numObjects, optimizeCachingCheckbox.checked);
        }
    };
    optimizeCachingCheckbox.checked = optimizeCaching;
});
function createSearchQuery(num, optimize) {
    var params = new URLSearchParams();
    params.set('n', num);
    params.set('optimize_caching', typeof optimize !== 'undefined' ? optimize ? 1 : 0 : (optimizeCaching || 0));
    return params.toString();
}
function reload(num) {
    document.location.search = createSearchQuery(num);
    return false;
}
