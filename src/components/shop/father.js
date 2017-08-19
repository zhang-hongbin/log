import React from 'react';
import Query from './query';
import Result from './result';
import Ajax from './ajax';
import UrlBuilder from '@51xianqu/url-builder';
import { message } from 'antd';

export default class Father extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: undefined,
            shopId: undefined,
            pageNum: 1
        }
    }
    
    handleChildQuery = (shopId, pageNum) => {
        this.queryData(shopId, pageNum);
    }

    handleChildUpdatePage = (pageNum) => {
        this.queryData(this.state.shopId, pageNum);
    }

    /**
     * 查询数据
     */
    queryData(shopId, pageNum) {
        const url= UrlBuilder.ka('/shop/organize/queryOrganizeShopOperatorLog');
        var param = { shopId };

        if (pageNum) {
            param.pageNum = pageNum;
        } else {
            param.pageNum = this.state.pageNum;
        }

        Ajax.postJSON(url,{
            body: param
        }).then(res => {
            if (res.status) {
                this.setState({ 
                    data: res.entry,
                    shopId: shopId,
                    pageNum: param.pageNum
                })
            } else {
                message.warn(res.message);
            }
        }).catch(err => {
            console.log(err.toString());
        })
    } 

    render() {
        const { data, pageNum } = this.state;
        return <div>
            <Query callBackParent={ this.handleChildQuery } />
            <Result transmitData={ {data, pageNum} } callBackUpdatePage={ this.handleChildUpdatePage } />
        </div>
    }
}
