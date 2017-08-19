import React, { Component } from 'react'
import config from './config.json';
import style from './style.css';//导入
import { Menu, Select, Radio, Button, Form, Input, Row, Col, Table } from 'antd';
import ajax from './ajax'
import UrlBuilder from '@51xianqu/url-builder';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
      var queryType = "item";
      var primaryKey = values.primaryKey;
      this.props.callBackParent( queryType, primaryKey, 1);
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
        <h2 className={style.h2}><span className={style.h2Span}>商品日志</span></h2>
        <div className={style.queryHead}>
          
          <Form layout="inline" onSubmit={e => this.handleSubmit(e)} >


            <FormItem style={{ marginTop:14,marginLeft:21,marginRight:6 }}>
              {getFieldDecorator('module', {
                initialValue: "商品ID"
              })(
                <Select disabled style={{ width: 69 }}>
                  <Select.Option value="goodsId">商品ID</Select.Option>
                </Select>
                )}
            </FormItem>



            <FormItem style={{ marginTop:14}}>
              {getFieldDecorator('primaryKey', {
                rules: [{
                  type: 'string'
                }]
              })(
                <Input style={{ width:180 }} />
                )}
            </FormItem>


            {/* <FormItem {...formItemLayout} label="时间范围" style={{ width: 200, marginTop:14 }}>
              {getFieldDecorator('queryRange')(
                <RadioGroup >
                  <Radio value="timeToday">当天</Radio>
                  <Radio value="timeWeek">近7天</Radio>
                </RadioGroup>
              )}
            </FormItem> */}

            <FormItem style={{ marginTop:14}}>
              <Button type="primary" htmlType="submit"  className={style.queryButton}>查询</Button>
            </FormItem>

          </Form>
          
        </div>
      </div>
    );
  }
}
export default Form.create()(Greeter);
