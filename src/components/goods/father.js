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
            goodsId: undefined,
            pageNo: 1,
            total:undefined
        }
    }
    
    handleChildQuery = (queryType, primaryKey, pageNo) => {
        this.queryData(queryType, primaryKey, pageNo);
    }

    handleChildUpdatePage = (pageNo) => {
        this.queryData('item',this.state.goodsId, pageNo);
    }

    /**
     * 查询数据
     */
    queryData(queryType, primaryKey, pageNo) {
        var url;
        if ( window.location.href.indexOf( 'dev' ) > -1 ){
            url = UrlBuilder.ka( '/itemcenter/ka/item/operateLog','gray' )
        } else {
            url= UrlBuilder.ka('/itemcenter/ka/item/operateLog');
        }

        var param = { primaryKey };
        if( !window.FEC.isAdmin ) {
            param.shopId = window.WMT.shopInfo[0].id;
        }
        param.module = queryType ;
        // param.pageSize = 2;
        if (pageNo) {
            param.pageNo = pageNo;
        } else {
            param.pageNo = this.state.pageNo;
        }

        Ajax.get(url,{
            params: param
        }).then(res => {
            if (res.status) {
                this.setState({ 
                    data: res.entry.logPage,
                    goodsId: primaryKey,
                    pageNo: param.pageNo,
                    total: res.entry.total
                })
            } else {
                message.warn(res.message);
            }
        }).catch(err => {
            console.log(err.toString());
        })
    } 

    render() {
        const { data, pageNo, total } = this.state;
        return <div>
            <Query callBackParent={ this.handleChildQuery } />
            <Result transmitData={ {data, pageNo, total} } callBackUpdatePage={ this.handleChildUpdatePage } />
        </div>
    }
}
