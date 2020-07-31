import React from 'react'

import AntModal from './AntModal'

import { Layout, Button, Upload, Icon, message} from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import './more.less'
import TextArea from 'antd/lib/input/TextArea';

import moreApi from '../../api/moreApi'

export default class FeedModal extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            showPanel: 1,
            desc:'' ,
            fileList:[],
            bool:true  
        }
    }

    changeBox(e) {
        this.setState({
            showPanel: e
        })
    }

    setBool = (val) => {
        this.setState({
            bool: val
        })
    }

    saveFeedback() {
        var desc = this.state.desc,
        self = this,
        list = self.state.fileList,
        imgArr=[],imgGroup;
        if(desc.length>=10){
            list.forEach(function(value,i){
                if(list[i].fileName){
                    imgArr.push(list[i].fileName)
                }            
            }) 
            imgGroup = JSON.stringify(imgArr);            
            if(self.state.bool){
                self.setBool(false);
                moreApi.saveFeedback(desc,imgGroup).then(function(res){
                    if(res.resultCode == 1) {                                       
                        self.props.close()
                    }
                    self.setBool(true);
                })
            }
        }else{
            message.error('请填写10个字以上的清楚问题描述以便我们提供更好的帮助');
        }
    }

    textChanged(e) {
        var val = e.target.value;
        this.setState({
            desc:val
        })
    } 
    
    customRequest = (files)=> {        
        var self = this, 
        {file}  = files,   
        imgUid = file.uid, 
        isLt2M = file.size / 1024 / 1024 < 2,
        isImg = false;        
        if(file.type=='image/jpeg'||file.type=='image/png'||file.type=='image/bmp'||file.type=='image/gif'){            
            isImg = true;
        } 
        if(isLt2M&&isImg){   
            self.setState(state => ({
                fileList: [...state.fileList, file]
            }));
            const r = new FileReader();            
            r.readAsDataURL(file);
            r.onload = e => {                
                file.thumbUrl = e.target.result;
                moreApi.saveImage(file.thumbUrl,6).then(function (res) {
                    var url = res.responseContent.url,
                    fileName = res.responseContent.fileName,
                    list = self.state.fileList;
                    list.forEach(function(value,i){
                        if(list[i].uid==imgUid){
                            list[i].url = url;
                            list[i].fileName = fileName;
                            list[i].status = "done";
                        }
                    }) 
                    self.setState({fileList:list})                    
                }) 
            };
        }else if(!isImg&&isLt2M){
            message.error('请上传jpeg、png、gif、bmp格式图片');
        }else{
            message.error('请上传不大于2M图片');
        }
   }

   handleRemove(file){
        const self = this,
        imgUid = file.uid,
        list = self.state.fileList;
        list.forEach(function(value,i){
            if(list[i].uid==imgUid){
                list.splice(i,1);
            }
        }) 
        self.setState({fileList:list})
   }  


    render() {
        let {
            showPanel, desc, fileList
        } = this.state;       
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
        </div>
        );
        return (
            <AntModal close={this.props.close} height={'430px'} wrapClassName={'CustmeModal modal-feed'}>
                <div className='feed-wrap'>
                    <div className='top'>
                        意见反馈
                    </div>
                    <div className='input'>
                        <TextArea placeholder="请填写10个字以上的清楚问题描述，以便我们提供更好的帮助" className='textarea' value={desc} onChange={(e)=>{this.textChanged(e)}}></TextArea>
                    </div>
                    <div className="list-pic">
                        <Upload 
                        listType="picture-card"  
                        fileList={fileList}    
                        onRemove={this.handleRemove.bind(this)}             
                        customRequest={this.customRequest}
                        >
                        { fileList.length >= 3 ? null : uploadButton}
                        </Upload>
                    </div>
                    <div className="colorg fonts12">请上传jpeg、png、gif、bmp格式图片，图片不大于2M</div>
                    <div className='feed-btn-grp'>
                        <Button className="ant-btn-orange" onClick={()=>{this.saveFeedback()}}>提交</Button> 
                        <Button onClick={this.props.close}>取消</Button>
                    </div>
                </div>
            </AntModal>
        )
    }

}