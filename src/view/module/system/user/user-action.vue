<template>
  <div>
    <Form ref="searchForm"
          :model="queryData"
          inline
          :label-width="50">
      <FormItem label="账号" prop="userAccount">
        <Input type="text" v-model="queryData.userAccount" placeholder="请输入登录账号"/>
      </FormItem>
      <FormItem label="状态">
        <Select v-model="queryData.userStatus">
          <Option value="">请选择</Option>
          <Option value="1">启用</Option>
          <Option value="0">禁用</Option>
        </Select>
      </FormItem>
      <FormItem label="姓名" prop="userName">
        <Input type="text" v-model="queryData.userName" placeholder="请输入姓名"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
        <Button @click="handleReset('searchForm')" >重置
        </Button>
      </FormItem>
    </Form>
    <div class="search-con search-con-top">
      <ButtonGroup>
        <Button class="search-btn" type="primary" @click="handleModal(1)">
          <Icon type="search"/>&nbsp;&nbsp;
          <span>添加人员</span>
        </Button>
      </ButtonGroup>
    </div>
    <Table height="330" :columns="columns" :data="data" :loading="loading">
      <template slot="userStatus" slot-scope="{ row }">
        <Badge v-if="row.userStatus===1" status="success"/>
        <Badge v-else="" status="error"/>
      </template>
      <template slot="action" slot-scope="{ row }">
        <a :disabled="false" @click="handleModal(2,row)">编辑</a> &nbsp;
        <a :disabled="false" @click="handleRemove(row)">删除</a>
      </template>
    </Table>
    <Page transfer :total="pageInfo.total" :current="pageInfo.current" :page-size="pageInfo.limit" show-elevator
          show-sizer
          show-total
          @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="800"
           @on-cancel="handleReset">
      <Form ref="formPermission" :model="formItem" :rules="formItemRules" :label-width="100">
        <FormItem label="所属机构" prop="orgId">
          <treeselect
            v-model="value.menuId"
            :options="selectTreeData"
            :default-expand-level="1"
            :normalizer="treeSelectNormalizer"/>
        </FormItem>
        <FormItem label="选中角色">
          <CheckboxGroup v-model="selectRoles">
            <Checkbox v-for="item in roleList" :label="item.roleId" :key="item.roleId" ref="checkboxGroup">
              <span>{{item.roleName}}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="用户姓名" prop="userName">
          <Input v-model="formItem.userName" placeholder="请输入用户姓名"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="userPhone">
          <Input v-model="formItem.userPhone" placeholder="请输入用户手机号码"></Input>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="formItem.userStatus">
            <Radio label="0">禁用</Radio>
            <Radio label="1">启用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="登录账号" prop="userAccount">
          <Input v-model="formItem.userAccount" placeholder="请输入登录账号"></Input>
        </FormItem>
        <FormItem label="登录密码" prop="userPass">
          <Input v-model="formItem.userPass" type="password" placeholder="请输入登录密码"></Input>
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
  import { listConvertTree } from '@/libs/util'
  import { getOrgs } from '@/api/org'
  import {
    checkUserAccountOnelyOne,
    delUserInfo,
    getRoles,
    getUserListByOrgId,
    saveUser,
    updateUser
  } from '@/api/action'

  export default {
    name: 'MenuAction',
    props: {
      value: Object
    },
    data () {

      const validateOrg = (rule, value, callback) => {
        if(this.value.menuId ==='0')
        {
          callback(new Error('请选择组织机构'))
        }else{
          callback()
        }
      }
      const validateEn = (rule, value, callback) => {
        if (value === '' || value===undefined) {
          callback(new Error('请输入用户账号'))
        } else {
          if (this.userAccount !== this.formItem.userAccount) {
            checkUserAccountOnelyOne(this.formItem.userAccount).then(res => {
              if (!res.data) {
                callback(new Error('您输入的账号已存在'))
              } else {
                callback()
              }
            }).finally(() => {
              this.saving = false
            })
          } else {
            callback()
          }
        }
      }
      return {
        selectTreeData: [{
          menuId: '0',
          menuName: '无'
        }],
        pageInfo: {
          total: 0,
          current: 1,
          size: 10,
        },
        queryData: {
          userName: '',
          userAccount: '',
          userStatus: 1
        },
        selectRoles: [],
        roleList: [],
        userAccount: '',
        isShow: false,
        modalVisible: false,
        saving: false,
        loading: false,
        modalTitle: '',
        confirmModal: false,
        selectApis: [],
        formItemRules: {
          orgId: [
            { required: true, validator: validateOrg, trigger: 'input' }
          ],
          userAccount: [
            { required: true, validator: validateEn, trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入用户姓名', trigger: 'blur' }
          ],
          userPhone: [
            { required: true, message: '请输入用户手机号码', trigger: 'blur' }
          ],
          userPass: [
            { required: true, message: '请输入用户密码', trigger: 'blur' }
          ]
        },
        formItem: {
          actionCode: '',
          actionName: '',
          userStatus: 1,
          menuId: '',
          parentId: '',
          type: ''
        },
        columns: [
          {
            title: '登录账号',
            key: 'userAccount',
            minWidth: 120
          },
          {
            title: '用户姓名',
            key: 'userName',
            minWidth: 120
          },
          {
            title: '角色信息',
            key: 'releStrs',
            minWidth: 120
          },
          {
            title: '机构名称',
            key: 'orgName',
            minWidth: 120
          },
          {
            title: '状态',
            slot: 'userStatus',
            minWidth: 80
          },
          {
            title: '手机号码',
            key: 'userPhone',
            minWidth: 120
          },
          {
            title: '创建时间',
            key: 'createTime',
            minWidth: 200
          },
          {
            title: '操作',
            slot: 'action',
            fixed: 'right',
            minWidth: 100
          }
        ],
        data: []
      }
    },
    methods: {
      handleModal (type, data) {
        this.formItem.type = type
        getOrgs().then(res => {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '0'
          }
          let info = listConvertTree(res.data, opt)
          this.setSelectTree(this.dataToData(info))
        })
        if (type === 2) {
          this.value.menuId = data.orgId
          this.selectRoles = data.roles.split(',')
          this.userAccount = data.userAccount
          this.formItem = Object.assign({}, this.formItem, data)
        } else if (type === 1) {
          if(!this.value.menuId)
          {
            this.value.menuId = '0'
          }
          this.parentId = this.value.menuId;
          this.userAccount = ''
          this.selectRoles = []
        }

        const tstr = !this.value.menuName?"新增用户":this.value.menuName;
        this.modalTitle = data ? '编辑功能 - ' + this.value.menuName + ' > ' + data.userName : '添加功能 - ' + tstr
        this.modalVisible = true
        this.formItem.userStatus = this.formItem.userStatus + ''
      },
      handleReset (fromid) {
        if(this.$refs[fromid])
        {
          this.value.menuId='0'
          this.$refs[fromid].resetFields()
          this.handleSearch(1)
        }
        this.queryData.userStatus=''
        this.modalVisible = false
        this.saving = false
      },
      setSelectTree (data) {
        this.selectTreeData = [{ menuId: '0', menuName: '无' }].concat(data)
      },
      dataToData (data) {
        let obj = []
        if (!data) {
          return ''
        }
        data.map(item => {
          let _obj = {
            children: this.dataToData(item.childMenus),
            createTime: item.createTime,
            hasChild: item.hasChild,
            icon: item.menuIcon,
            isPersist: item.menuId,
            menuId: item.menuId,
            menuName: item.menuName,
            parentId: item.parentId,
          }
          obj.push(_obj)
        })
        return obj
      },
      treeSelectNormalizer (node) {
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        }
      },
      handleSubmit () {
        this.$refs['formPermission'].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.selectRoles.length === 0) {
              this.$Message.error('请选择角色信息')
              return false
            }
            if (this.formItem.type === 2) {
              this.formItem.orgId = this.value.menuId
              updateUser(this.formItem, this.selectRoles.join(',')).then(res => {
                this.handleReset()
                this.handleSearch(1)
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                }
              }).finally(() => {
                this.saving = false
              })
            } else {
              saveUser(this.formItem, this.value.menuId, this.selectRoles.join(',')).then(res => {
                this.handleReset()
                this.handleSearch(1)
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                }
              }).finally(() => {
                this.saving = false
              })
            }
          }
        })
      },
      handleSearch (page) {
        this.loading = true
        if (page) {
          this.pageInfo.current = page
        }
        this.queryData.orgId = this.value.menuId
        getUserListByOrgId(this.pageInfo, this.queryData).then(res => {
          this.pageInfo.total = parseInt(res.data.total)
          let arr = []
          res.data.records.forEach(item => {
            arr.push(item)
          })
          this.data = arr
        }).finally(() => {
          this.loading = false
        })
      },
      handlePage (current) {
        this.pageInfo.current = current
        this.handleSearch()
      },
      handlePageSize (size) {
        this.pageInfo.size = size
        this.handleSearch()
      },
      handleRemove (data) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          onOk: () => {
            delUserInfo(data.userId).then(res => {
              if (res.code === 0) {
                this.$Message.success('删除成功')
              }
              this.handleSearch()
            })
          }
        })
      }
    },
    created () {
      getRoles().then(res => {
        this.roleList = res.data
      }).finally(() => {
        this.saving = false
      })
      this.queryData.userStatus = ''
      this.handleSearch(1)
    },
    watch: {
      value (val) {
        if (!val.menuId) {
          this.value.menuId = '0'
        }
        this.isShow = true
        this.handleSearch(1)
      }
    },
    mounted: function () {
    }
  }
</script>
