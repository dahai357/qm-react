import React from 'react'
import { Button,Input, InputNumber} from 'antd'; 
import { MoneytoFixed, TimeFormatFull} from '../../../service/utils'
import EventBus from '../../../service/EventBus'

export default class ModifyOrderGoods extends React.Component {
  constructor(props) {
    super(props) 
    this.props = props;
    this.state = {
      goods: this.props.goods, 
      goodsNumOld: this.props.goods.goodsNum,  
      goodsNumNew: this.props.goods.goodsNum,
      inputNum: this.props.goods.goodsNum,
      showNum: true   
    }         
  }

  componentDidMount() { 

  }

  componentWillReceiveProps(nextProps){      
      this.setState({
        goodsNumNew : nextProps.goods.goodsNum,
        goodsNumOld : nextProps.goods.goodsNum,
        inputNum : nextProps.goods.goodsNum
      })     
  }

  modifyNum() {
    this.setState({
      showNum:false
    })
    this.onEdit(true);     
  }

  cancelModify() {
    this.setState({      
      showNum: true,
      inputNum: this.state.goodsNumNew
    })
    this.onEdit(false);    
  }

  onHandle(){
    var num = this.state.inputNum,
    n = Number(num);
    this.setState({
      goodsNumNew: num
    }) 
    if (Number.isNaN(n) || ''=== n) {
        EventBus.emit('ERROR_API', '请输入数量');
        this.setState({
          inputNum: this.state.goodsNumOld,
          goodsNumNew: this.state.goodsNumOld
        }) 
    }else{
      this.onEdit(false); 
      this.setState({
        showNum:true
      }) 
      if(this.props.onHandle) {
        var goodsObj = {
          goodsId: this.state.goods.goodsId,       
          goodsNum: num,
          goodsNumOld: this.state.goodsNumOld
        }
        this.props.onHandle(goodsObj);
      } 
    }       
  }  

  onEdit(val){ 
    if(this.props.onEdit) {
      this.props.onEdit(val);
    }
  }

  textChange(e){     
    this.setState({      
      inputNum: e
    })   
  }

  limitDecimals(value) {
    return isNaN(parseInt(value)) ? '' : parseInt(value)
  }

  render() {
    let self = this;  
    let { goods, goodsNumNew, showNum, inputNum} = self.state;
    return (
      <tbody> 
        <tr>
          <td>
            {
              (goods.goodsGroup&&goods.goodsGroup.length > 0)  ?  
                <div className="fonts12 colorg marginb5">组合商品</div>
                :null 
            }
              <div className="info-box">
                  <div className="pic">
                      <img src={goods.goodsImage} alt="" />
                  </div>
                  <div className="detail">
                      <div>{goods.goodsName}</div>
                      {
                        (goods.goodsAttr && goods.goodsAttr.length>0) ?
                        <div className="fonts12 colorg">
                            {
                                goods.goodsAttr.map(function (r, index) {
                                    return <span key={index}>{(index > 0 ? '; ' : '') + r.attrValue}</span>
                                })
                            }
                        </div>
                        :null
                      }
                  </div>
              </div>
          </td>
          <td>
              {MoneytoFixed(goods.goodsPrice)} 
          </td>
          <td>
            { showNum ?  <div> {goodsNumNew} </div> : null } 
              { 
                  showNum ? null: 
                  <div className="modify-num-box"> 
                      <InputNumber type='text' className='add-input width80' min={0} value={inputNum}  formatter={this.limitDecimals}  parser={this.limitDecimals} step={1} onChange={(e) => { this.textChange(e) }} />
                      <div>
                        <Button className="btn-txt-blue marginr10 btn-confirm" onClick={(e) => { self.onHandle() }}>确定</Button>
                        <Button className="btn-txt-blue btn-cancel" onClick={(e) => { self.cancelModify() }}>取消</Button>
                      </div> 
                  </div> 
              }
          </td>
          <td>
            { 
              showNum ? <Button className="btn-txt-blue btn-confirm" onClick={(e) => { self.modifyNum() }}>修改</Button>  : null
            }
          </td>
        </tr> 
        {
          ( goods.goodsGroup && goods.goodsGroup.length > 0)  ?                   
            goods.goodsGroup.map(function (grp, index)  {
              return (
                <tr>
                  <td>
                    <div className="fonts12 colorg marginb5">搭配商品{index+1}</div>
                    <div className="info-box">
                      <div className="pic">
                          <img src={grp.goodsImage} alt="" />
                      </div>
                      <div className="detail">
                          <div>{grp.goodsName}</div>
                          {  
                            (grp.goodsAttr&& grp.goodsAttr.length>0) ?
                              <div className="fonts12 colorg">
                                  {
                                      grp.goodsAttr.map(function (r, index) {
                                          return <span key={index}>{(index > 0 ? '; ' : '') + r.attrValue}</span>
                                      })
                                  }
                              </div>
                            :null
                          }
                      </div>
                  </div>
                  </td>
                  <td>{MoneytoFixed(grp.discountPrice)}</td>
                  <td>{grp.num}</td>
                  <td></td>
                </tr>
              )
            })         
         : null
        }
      </tbody>                  
    );
  }
}