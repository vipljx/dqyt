<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="请求路径" prop="path">
          <Input type="text" v-model="pageInfo.path" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="接口名称" prop="apiName">
          <Input type="text" v-model="pageInfo.apiName" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="接口编码" prop="apiCode">
          <Input type="text" v-model="pageInfo.apiCode" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="服务名" prop="serviceId">
          <Input type="text" v-model="pageInfo.serviceId" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button :disabled="true"  class="search-btn" type="primary" @click="handleModal()">
            <Icon type="search"/>&nbsp;&nbsp;
            <span>添加</span>
          </Button>
        </ButtonGroup>
      </div>
      <Alert show-icon>
        <Tag color="red">@EnableResourceServer</Tag>
        <span>自动扫描服务下的API接口</span>
      </Alert>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot="apiName" slot-scope="{ row }">
          <Badge v-if="row.status===1" status="success"/>
          <Badge v-else="" status="error"/>
          <span>{{row.apiName}}</span>
        </template>
        <template slot="isAuth" slot-scope="{ row }">
          <Tag color="green" v-if="row.isAuth===1">身份认证</Tag>
          <Tag v-else-if="row.isAuth!==1">无认证</Tag>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a :disabled="true"   @click="handleModal(row)">
            编辑</a>&nbsp;
          <Dropdown v-show="true"  transfer ref="dropdown" @on-click="handleClick($event,row)">
            <a href="javascript:void(0)">
              <span>更多</span>
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem  name="remove">删除接口</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator
            show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="680"
           @on-cancel="handleReset">
      <Alert show-icon v-if="formItem.apiId?true:false">
        <span>接口信息部分内容,需要在接口定义时修改。</span>
        <Poptip placement="bottom" title="示例代码">
          <a>示例代码</a>
          <div slot="content">
            <div v-highlight>
                <pre>
                        // 接口介绍
                        @ApiOperation(value = "接口名称", notes = "接口备注")
                        @PostMapping("/testApi")
                        // 忽略接口,将不再添加或修改次接口
                        @ApiIgnore
                        // 方法名为接口标识
                        public ResultBody testApi() {
                           return ResultBody.success();
                        }
                </pre>
            </div>
          </div>
        </Poptip>
      </Alert>
      <Form ref="form1" :model="formItem" :rules="formItemRules" :label-width="100">
        <FormItem label="服务名称" prop="serviceId">
          <Select :disabled="formItem.apiId?true:false" v-model="formItem.serviceId" filterable clearable>
            <Option v-for="item in selectServiceList" :value="item.serviceId">{{ item.serviceName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="接口分类" prop="apiCategory">
          <Input v-model="formItem.apiCategory" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="接口标识" prop="apiCode">
          <Input :disabled="formItem.apiId?true:false" v-model="formItem.apiCode" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="接口名称" prop="apiName">
          <Input :disabled="formItem.apiId?true:false" v-model="formItem.apiName" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="请求地址" prop="path">
          <Input :disabled="formItem.apiId?true:false" v-model="formItem.path" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="优先级">
          <InputNumber v-model="formItem.priority"></InputNumber>
        </FormItem>
        <FormItem label="身份认证">
          <RadioGroup v-model="formItem.isAuth">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="formItem.status">
            <Radio label="0">禁用</Radio>
            <Radio label="1">启用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="formItem.apiDesc" type="textarea" placeholder="请输入内容"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="handleReset">取消</Button>&nbsp;
        <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {listConvertTree} from '@/libs/util'
  import {getApis, updateApi, addApi, removeApi} from '@/api/api'
  import {getServiceList} from '@/api/data'

  export default {
    name: 'SystemApi',
    data () {
      const validateEn = (rule, value, callback) => {
        let reg = /^[_.a-zA-Z0-9]+$/
        if (value === '') {
          callback(new Error('接口标识不能为空'))
        } else if (value !== '' && !reg.test(value)) {
          callback(new Error('只允许字母、数字、点、下划线'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        modalVisible: false,
        modalTitle: '',
        saving: false,
        pageInfo: {
          total: 0,
          page: 1,
          limit: 10,
          path: '',
          apiName: '',
          apiCode: '',
          serviceId: ''
        },
        selectServiceList: [{serviceId: '', serviceName: '无'}],
        formItemRules: {
          serviceId: [
            {required: true, message: '所属服务不能为空', trigger: 'blur'}
          ],
          apiCategory: [
            {required: true, message: '接口分类不能为空', trigger: 'blur'}
          ],
          apiCode: [
            {required: true, validator: validateEn, trigger: 'blur'}
          ],
          apiName: [
            {required: true, message: '接口名称不能为空', trigger: 'blur'}
          ]
        },
        formItem: {
          apiId: '',
          apiCode: '',
          apiName: '',
          apiCategory: 'default',
          path: '',
          status: 1,
          isAuth: 1,
          openSwatch: false,
          authSwatch: true,
          serviceId: '',
          priority: 0,
          apiDesc: ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'apiName',
            slot: 'apiName',
            width: 200,
            filters: [
              {
                label: '禁用',
                value: 0
              },
              {
                label: '启用',
                value: 1
              }
            ],
            filterMultiple: false,
            filterMethod (value, row) {
              if (value === 0) {
                return row.status === 0
              } else if (value === 1) {
                return row.status === 1
              }
            }
          },
          {
            title: '地址',
            key: 'path',
            width: 200,
          },
          {
            title: '分类',
            key: 'apiCategory',
            width: 100,
          },
          {
            title: '服务名称',
            key: 'serviceId',
            width: 200
          },
          {
            title: '接口安全',
            key: 'isAuth',
            slot: 'isAuth',
            width: 200
          },
          {
            title: '最后更新时间',
            key: 'updateTime',
            width: 180
          },
          {
            title: '描述',
            key: 'apiDesc',
            width: 400
          },
          {
            title: '操作',
            key: '',
            slot: 'action',
            fixed: 'right',
            width: 120
          }
        ],
        data: []
      }
    },
    methods: {
      handleModal (data) {
        if (data) {
          this.modalTitle = '编辑接口 - ' + data.apiName
          this.formItem = Object.assign({}, this.formItem, data)
        } else {
          this.modalTitle = '添加接口'
        }
        this.formItem.status = this.formItem.status + ''
        this.formItem.isAuth = this.formItem.isAuth + ''
        this.modalVisible = true
      },
      handleResetForm (form) {
        this.$refs[form].resetFields()
      },
      handleReset () {
        const newData = {
          apiId: '',
          apiCode: '',
          apiName: '',
          apiCategory: 'default',
          path: '',
          status: 1,
          isAuth: 1,
          serviceId: '',
          priority: 0,
          apiDesc: ''
        }
        this.formItem = newData
        //重置验证
        this.handleResetForm('form1')
        this.modalVisible = false
        this.saving = false
      },
      handleSubmit () {
        this.$refs['form1'].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.apiId) {
              updateApi(this.formItem).then(res => {
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                }
                this.handleReset()
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            } else {
              addApi(this.formItem).then(res => {
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                }
                this.handleReset()
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            }
          }
        })
      },
      handleRemove (data) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          onOk: () => {
            removeApi(data.apiId).then(res => {
              this.handleSearch()
              if (res.code === 0) {
                this.pageInfo.page = 1
                this.$Message.success('删除成功')
              }
            })
          }
        })
      },
      handleSearch (page) {
        if (page) {
          this.pageInfo.page = page
        }
        this.loading = true
        getApis(this.pageInfo).then(res => {
          this.data = res.data.records
          this.pageInfo.total = parseInt(res.data.total)
        }).finally(() => {
          this.loading = false
        })
      },
      handlePage (current) {
        this.pageInfo.page = current
        this.handleSearch()
      },
      handlePageSize (size) {
        this.pageInfo.limit = size
        this.handleSearch()
      },
      handleClick (name, row) {
        switch (name) {
          case 'remove':
            this.handleRemove(row)
            break
        }
      },
      handleLoadServiceList () {
        getServiceList().then(res => {
          if (res.code === 0) {
            this.selectServiceList.push(...res.data)
          }
        })
      }
    },
    mounted: function () {
      this.handleLoadServiceList()
      this.handleSearch()
    }
  }
</script>
