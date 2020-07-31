import Zmage from '../../service/zmage.development'
import React from 'react'
export default class ZZmage extends React.Component {

    handleDown(src) {        
        var req = new XMLHttpRequest(); 
         req.open("GET",  src, true);
         req.responseType = 'blob';
         req.onload = function (e) {              
             var ks = src.split('?');
             var splits = ks[0].split('/')
             download(req.response, splits[splits.length-1]); 
         }
         req.send();
     }

    render() {
        let { src } = this.props;
        return (
            <React.Fragment>
                <Zmage handleDown={(e) => { this.handleDown(e) }} 
                className={this.props.className?this.props.className:'book-img'} 
                src={src} alt={this.props.alt?this.props.alt:''} />
            </React.Fragment>
        )
    }
}