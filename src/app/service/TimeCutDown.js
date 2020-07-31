import React, { Component } from 'react'

export default class TimeCutDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
        }
    }
    componentDidMount() {
        if (this.props.endTime && this.props.startTime) {
            this.countFun(this.props.startTime * 1000, this.props.endTime * 1000);
        }
    }
    //组件卸载取消倒计时
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    countFun = (st, time) => {
        let end_time = time,
            sys_second = (10 * 60 * 1000) - (st - end_time);
        this.timer = setInterval(() => {
            //防止倒计时出现负数
            if (sys_second > 1000) {
                sys_second -= 1000;
                let day = Math.floor((sys_second / 1000 / 3600) / 24);
                let hour = Math.floor((sys_second / 1000 / 3600) % 24);
                let minute = Math.floor((sys_second / 1000 / 60) % 60);
                let second = Math.floor(sys_second / 1000 % 60);
                this.setState({
                    day: day,
                    hour: hour < 10 ? "0" + hour : hour,
                    minute: minute < 10 ? "0" + minute : minute,
                    second: second < 10 ? "0" + second : second
                })
            } else {
                clearInterval(this.timer);
                //倒计时结束时触发父组件的方法
                if(this.props.timeEnd){
                    this.props.timeEnd();
                }

                this.setState({
                    second: 0
                })
            }
        }, 1000);
    }

    render() {
        return (
            <span>
                {
                    (this.state.minute <= 10
                        && this.state.day == 0
                        && this.state.hour == 0
                        && this.state.second > 0) ? <span>{this.state.minute}分{this.state.second}秒</span> : null
                }
            </span>
        )
    }
}