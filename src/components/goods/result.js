import React, { Component } from 'react'
import config from './config.json';
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
            pageNo: undefined,
            total: undefined
        }
    }
    imgUrl(text, row) {
        return <img src={getImgUrl(text)} style={{width:'80px',height:'80px'}} />
    }
    item(text, row) {
        return <div>
            <p>商品ID：{text.id}</p>
            <p>条形码：{text.barcode}</p>
            <p>商家编码：{text.skuCode}</p>
            <p>名称：{text.itemName}</p>
            <p>规格：{text.property} / 单位：{text.unit}</p>
        </div>
    }
    shop(text, row) {
        return <div>
            <p>店铺ID：{text.id}</p>
            <p>店铺名称：{text.shopName}</p>
        </div>
    }
    renderOperateContent(text, record) {
        var renderData;
        if (/{"?.*"?:.*}/g.test(text)) {
            renderData = JSON.parse(text);
        } else {
            renderData = { pureString: text };
        }
        
        var renderContent = [], 
            keys = Object.keys(renderData),
            imgIndex = keys.indexOf('图片');

        if (~keys.indexOf('图片')) {
            const content = (<div>
                 <img  src={getImgUrl(renderData["图片"])}/> 
                {keys.map((key, i) => {
                    var detailContent = [];
                    if (/.jpg$/g.test(renderData[key])) {
                        //图片显示提前，什么都不做
                    } else if(key.indexOf('价格')>-1){
                        detailContent.push(<p key={i.toString()}>
                            <label>{key}:</label>
                            <span>{renderData[key]/100}</span>
                        </p>)
                        console.log(renderData)
                    }else{
                        detailContent.push(<p key={i.toString()} >
                            <label>{key}:</label>
                            <span>{renderData[key]}</span>
                        </p>)
                    }
                    return detailContent;
                    }
                )}
                
            </div>);
                
            renderContent = <p>
                <img src={getImgUrl(renderData["图片"])}/>
                <br/>
                <Popover placement="left"  content={content} trigger="hover">
                    <span href="javascript:void 0;" className={style.popSpan }>详情快照</span>
                </Popover>
            </p>
        } else {
            keys.forEach((key, i) => {
                if (key === 'pureString') {
                    renderContent.push(<p key={i.toString()}>{renderData[key]}</p>);
                }
                //转义字符
                else {
                    if (key === '价格') {
                        renderContent.push( <p key={i.toString()}>
                            <label>{key}:</label>
                            <span>¥{renderData[key]/100}</span>
                        </p>)
                    } else {
                        renderContent.push( <p key={i.toString()}>
                            <label>{key}:</label>
                            <span>{renderData[key]}</span>
                        </p>)
                    }
                }
            });
        }
        
        return <div className={style["operator-desc"]}>{renderContent}</div>;
    }


    componentWillReceiveProps(nextProps) {
        if ('transmitData' in nextProps) {
            let { data, pageNo, total } = nextProps.transmitData;
            this.setState({ data, pageNo, total });
        }
    }


    render(){
        var { data, pageNo, total } = this.state;
        const pagination =  {
            total: total ? total : 0,
            current: pageNo,
            showTotal: (total) => `共${total}条`,
            onChange: (current) => {
                this.props.callBackUpdatePage(current);
            }
        } 
        // 初始未搜索，显示无商品日志
        if(!data){
            return <div className={style.divnoresult}> 
            <img src="//imgsize.52shangou.com/img/n/05/23/1495500010232_9122.png" className={style.noresult} />
            <br />
            <span>暂无商品日志</span>
            </div>
        // 搜索，但无结果
        }else if(!data.datas.length){
            return <div className={style.divnoresult}> 
            <img src="//imgsize.52shangou.com/img/n/05/23/1495500010232_6841.png" className={style.noresult} />
            <br />
            <span>查询无结果</span>
            </div>
        // 搜索，找到1条及以上记录，显示
        } else {
            const rowKey = (record) => {
            var a = record.index.toString();
            return a;
        }
        return <div style={{backgroundColor:'white',paddingRight:30,paddingLeft:30}}>
            <Table rowKey={rowKey} dataSource={data.datas} pagination={pagination} className={style.table}>
                <Column title="序号" dataIndex="index"/>
                <Column title="商品图" dataIndex="imgUrl" render={(text, row) => this.imgUrl(text, row)} />
                <Column title="商品信息" dataIndex="item" render={(text, row) => this.item(text, row)}/>
                <Column title="店铺信息" dataIndex="shop" render={(text, row) => this.shop(text, row)}/>
                <Column title="操作时间" dataIndex="operateDate"/>
                <Column title="操作人" dataIndex="operateUser"/>
                <Column title="操作描述" dataIndex="operateDesc"/>
                <Column title="修改详细内容" dataIndex="operateContent" render={this.renderOperateContent.bind(this)} />                
            </Table>
            </div>
        }
    }


}