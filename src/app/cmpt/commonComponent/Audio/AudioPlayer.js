import React from 'react'
import EventBus from '../../../service/EventBus' 
export default class AudioPlayer extends React.PureComponent {

    myAudio;
    
    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            audioArr: []
        }
    } 

    componentDidMount() {        
        this.getAudio();
        EventBus.onSingle('PLAY_AUDIO',this.play.bind(this,'new'));
        EventBus.onSingle('PLAY_AUDIO_CANCEL',this.play.bind(this,'cancel'));   
        EventBus.onSingle('PLAY_AUDIO_ClOSE',this.play.bind(this,'close'));
        EventBus.onSingle('PLAY_AUDIO_AUTO_ClOSE',this.play.bind(this,'autoClose')); 
        EventBus.onSingle('PLAY_AUDIO_ORDER',this.play.bind(this,'autoOrder')); 
        
    }  

    // 获取音频
    getAudio = () => {
        const myAudio = this.myAudio = new Audio()
        myAudio.preload = true;
        myAudio.loop = false;
        document.getElementById("audioBox").appendChild(myAudio);        
    }    

    playEndedHandler(){
        var arr = this.state.audioArr;
        if(arr.length>0){          
            this.myAudio.src = arr.pop();
            this.myAudio.play();  
            this.myAudio.addEventListener('ended', this.playEndedHandler.bind(this), false);                                  
            if(arr.length==1){
                this.myAudio.removeEventListener('ended',this.playEndedHandler.bind(this),false);
            }           
        }
    }

    play(type) {
        var arr=[];    
        switch(type){
            case 'new':
               arr.push('./public/new_order.mp3');
               break;
            case 'cancel':
                arr.push('./public/cancel_order.mp3');
                break;
            case 'close':
                arr.push('./public/close_order.mp3');
                break;
            case 'autoClose':
                arr.push('./public/auto_close_order.mp3');
               break;
            case "autoOrder":
                arr.push('./public/auto_new_order.mp3')
        }        
        this.setState({
            audioArr: arr
        }, ()=> { 
            if(this.myAudio.paused||this.myAudio.ended){
                this.myAudio.src = this.state.audioArr.pop();
                this.myAudio.play();    
                this.myAudio.addEventListener('ended', this.playEndedHandler.bind(this), false);              
            }else{
                this.myAudio.addEventListener('ended', this.playEndedHandler.bind(this), false);  
            }                     
        })                
    }


    render() { 
        return (
            <div id='audioBox' />                      
        );
    }
} 