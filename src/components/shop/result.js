import React, { Component } from 'react'
//import config from './config.json';
import { Table, Popover, Button } from 'antd';
import style from './style.css';//导入

const { Column } = Table;
const IMG_PREFIX = '//imgsize.52shangou.com/img/';


function getImgUrl(filePath) {
    return `${IMG_PREFIX}${filePath}@Q90_80w_80h.jpg`;
}

export default class Result extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: undefined,
            pageNum: undefined
        }
    }

    timeSwitch =(text, row)=>{
        var date = new Date(text); 
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? ('0'+date.getDate()) : date.getDate())  + ' ';
        var h = (date.getHours()< 10 ? ('0'+date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes()< 10 ? ('0'+date.getMinutes()) : date.getMinutes()) + ':';
        var s = date.getSeconds()< 10 ? ('0'+date.getSeconds()) : date.getSeconds();
        var time = Y+M+D+h+m+s;
        return <span>{time}</span>
    }

    

    componentWillReceiveProps(nextProps) {
        if ('transmitData' in nextProps) {
            let { data, pageNum } = nextProps.transmitData;
            this.setState({ data, pageNum });
        }
    }

    renderDetailContent(text, row) {
        var textArr = text.split(/\r\n|\n/g);
        return <div>{textArr.map((t,key) => {
                return <p key={key.toString()}>{t}</p>
            }
        )}</div>
        
    }


    render(){
        // var dataSource = this.state.data.list;
        var { data, pageNum } = this.state;
        const pagination =  {
            total: data ? data.total : 0,
            current: pageNum,
            showTotal: (total) => `共${total}条`,
            onChange: (current) => {
                this.props.callBackUpdatePage(current);
            }
        } 
        //初始未搜索，显示无店铺日志 dataSource = underfined
        if (!data) {
            return <div className={style.divnoresult}> 
            <img src="//imgsize.52shangou.com/img/n/05/23/1495500010232_9122.png" className={style.noresult} />
            <br />
            <span>暂无店铺日志</span>
            </div>
        //搜索，但无结果 dataSource = []
        } else if (!data.list.length){
            return <div className={style.divnoresult}> 
            <img src="//imgsize.52shangou.com/img/n/05/23/1495500010232_6841.png" className={style.noresult} />
            <br />
            <span>查询无结果</span>
            </div>
        //搜索，找到1条及以上记录，显示
        } else {
            return <div style={{backgroundColor:'white',paddingRight:30,paddingLeft:30}}>
                <Table rowKey={record => record.indexNO} dataSource={data.list} pagination={pagination} className={style.table}>
                    <Column title="序号" dataIndex="indexNO"/>
                    <Column title="店铺ID" dataIndex="shopId" className={style.shopId} />
                    <Column title="店铺名称" dataIndex="shopName" />
                    <Column title="操作时间" dataIndex="operatorTime" render={(text, row) => this.timeSwitch(text, row)} />
                    <Column title="操作人" dataIndex="operatorName" />
                    <Column title="操作描述" dataIndex="operatorTypeName"  />
                    <Column title="修改详细内容" dataIndex="content"  render={(text, row) =>  this.renderDetailContent(text,row)}/>              
                </Table>
            </div>
        }
    }
}