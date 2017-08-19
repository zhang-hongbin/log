import React, { Component } from 'react'
import style from './style.css';//导入
import { Menu, Select, Radio, Button, Form, Input, Row, Col, Table, message } from 'antd';
import ajax from './ajax';
import UrlBuilder from '@51xianqu/url-builder';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class SearchInput extends React.Component {
  state = {
    data: [],
    value: '',
    name: ''
  }
  handleSearch = (name) => {
    name = (name || '').trim();
    setTimeout(this.fetch(name),1000);
  }

  /**
   * 选中某项
   * @param {Object} value 
   */
  handleSelect = (value) => {
    const { onChange } = this.props;
    var name = this.state.data.find(d => d.id === parseInt(value)).shopName;
    this.setState({
      value: value,
      name: name
    })

    onChange && onChange(value);
  }

  fetch(name) {
    var requestUrl = UrlBuilder.ka('/shop/read/searchSuggestShop');
    let param = {};
    param.keyword = name;
    param.organizeId = window.FEC.orgInfo.id;
    ajax.postJSON(requestUrl, {
      body: param
    }).then(res => {
      if (res.status) {
        this.setState({ 
          name,
          value: '',
          data: res.entry || []
        })
      } else {
        console.log(res.message);
        message.info({
          title: '提醒',
          content: res.message
        });
      }
    }).catch(err => {
      console.warn(err.toString());
    })
  }

  render() {
    const options = this.state.data.map(d => <Option key={d.id}>{d.shopName}</Option>);
    return (
      <Select
        mode="combobox"
        value={this.state.name}
        placeholder={this.props.placeholder}
        notFoundContent=""
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onSelect={this.handleSelect}
      >
        {options}
      </Select>
    );
  }
}

class Greeter extends Component {
  constructor(props){
    super(props);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if ( err ) {
        return;
      }
      
      var shopId = window.FEC.isAdmin ? values.shopId : window.FEC.shopInfo[0].id;
      
      this.props.callBackParent(shopId, 1);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className={style.root}>
        <h2 className={style.h2}><span className={style.h2Span}>店铺日志</span></h2>
        <div className={style.queryHead}>
          <Form layout="inline" onSubmit={e => this.handleSubmit(e)} >
            {
              window.FEC.isAdmin
              ?
              <FormItem label="店铺名称">
                 {getFieldDecorator('shopId')( 
                  <SearchInput placeholder=" 输入店铺名称 " style={{ width: 180 }} />
                 )} 
              </FormItem>
              :
              <FormItem label="店铺名称">
                <Input disabled value={window.FEC.shopInfo[0].shopName} style={{ width:180 }}/>
              </FormItem>
            }
            <FormItem>
              <Button type="primary" htmlType="submit"  className={style.queryButton}>查询</Button>
            </FormItem>
          </Form>
          
        </div>
      </div>
    );
  }
}
export default Form.create()(Greeter);
