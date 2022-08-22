import "../styles/kitchensink.css";
import "../styles/master.css";
import "../styles/prism.css";
import "../styles/styles.scss";
import './controller';
import './init';
// import './paster';

// https://getbootstrap.com/docs/5.0/components/offcanvas/#via-javascript
import { Offcanvas } from 'bootstrap';
document.onload = () => {
    const offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'))
    offcanvasElementList.map(function (offcanvasEl) {
        return new Offcanvas(offcanvasEl, { backdrop: false })
    })
}