import React from 'react';
import { DataBusInstance } from '../service/databus'
export default class BaseCmpt extends React.Component {
    session = null;
    constructor(props) {
        super(props)
        this.session = DataBusInstance.getSessionKey();
        if (!!!this.session) {
            props.history.push('/');
        }
    }
}