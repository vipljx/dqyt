<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="角色名称" prop="roleName">
          <Input type="text" v-model="pageInfo.roleName" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)" >查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="handleModal()">
            <Icon type="md-add"/>&nbsp;
            <span>添加</span>
          </Button>
        </ButtonGroup>
      </div>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot="action" slot-scope="{ row }">
          <a  @click="handleModal(row)">编辑</a>&nbsp;
          <a  @click="handleModal(row,forms[1])">分配菜单</a>&nbsp;
          <Dropdown transfer ref="dropdown" @on-click="handleClick($event,row)">
            <a href="javascript:void(0)" >
              <span>更多</span>
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list" >
              <DropdownItem  name="remove" >删除角色</DropdownItem>
            </DropdownMenu>
          </Dropdown>&nbsp;
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.size" show-elevator
            show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="800"
           @on-cancel="handleReset">
      <Form v-show="current == 'form1'" ref="form1" :model="formItem" :rules="formItemRules" :label-width="100">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="formItem.roleName" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="formItem.roleDesc" type="textarea" placeholder="请输入内容"></Input>
        </FormItem>
      </Form>

      <Form v-show="current == 'form2'" ref="form2" :model="formItem" :rules="formItemRules" :label-width="100">
        <FormItem label="功能菜单(选填)" prop="grantMenus">
          <tree-table
            ref="tree"
            style="max-height:500px;overflow: auto"
            expand-key="menuName"
            :expand-type="false"
            :is-fold="false"
            :tree-type="true"
            :selectable="true"
            :columns="columns2"
            :data="selectMenus">
          </tree-table>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="saving" @click="handleSubmit">保存</Button>&nbsp;
        <Button type="default" @click="handleReset">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRoles, updateRole, addRole, removeRole, getRoleUsers, addRoleUsers } from '@/api/role'
import { getAllUsers } from '@/api/user'
import {
  getAuthorityMenu,
  getAuthorityRole,
  grantAuthorityRole
} from '@/api/authority'
import { startWith, listConvertTree } from '@/libs/util'

export default {
  name: 'SystemRole',
  data () {
    return {
      titles: ['选择接口', '已选择接口'],
      listStyle: {
        width: '240px',
        height: '500px'
      },
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: [
        'form1',
        'form2',
        'form3'
      ],
      selectApis: [],
      selectMenus: [],
      selectUsers: [],
      pageInfo: {
        total: 0,
        page: 1,
        size: 10,
        roleName: ''
      },
      formItemRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        roleId: '',
        roleName: '',
        path: '',
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        userIds: []
      },
      columns: [
        {
          title: '角色名称',
          key: 'roleName',
          minWidth: 300
        },
        {
          title: '用户数量',
          key: 'userCount',
          minWidth: 200
        },
        {
          title: '描述',
          key: 'roleDesc',
          minWidth: 200
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 150
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 200
        }
      ],
      columns2: [
        {
          title: '菜单',
          key: 'menuName',
          minWidth: '250px'
        }

      ],
      data: []
    }
  },
  methods: {
    handleModal (data, step) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (!step) {
        step = this.forms[0]
      }
      if (step === this.forms[0]) {
        this.modalTitle = data ? '编辑角色 - ' + data.roleName : '添加角色'
        this.modalVisible = true
      }
      if (step === this.forms[1]) {
        this.modalTitle = data ? '分配权限 - ' + data.roleName : '分配权限'
        this.handleLoadRoleGranted(this.formItem.roleId)
      }
      if (step === this.forms[2]) {
        this.modalTitle = data ? '添加成员 - ' + data.roleName : '添加成员'
        this.handleLoadRoleUsers(this.formItem.roleId)
      }
      if (!step) {
        step = this.forms[0]
      }
      this.current = step
    },
    handleResetForm (form) {
    },
    handleReset () {
      const newData = {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        userIds: []
      }
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.handleResetForm(form)
      })
      this.current = this.forms[0]
      this.formItem.grantMenus = []
      this.formItem.grantActions = []
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit () {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.roleId) {
              updateRole(this.formItem).then(res => {
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                  this.handleReset()
                }
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            } else {
              addRole(this.formItem).then(res => {
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                  this.handleReset()
                }
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            }
          }
        })
      }

      if (this.current === this.forms[1]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            const menuIds = this.$refs['tree'].getCheckedProp('menuId');
            if(menuIds.length ===0)
            {
              this.$Message.error('请至少选中一项')
              return false;
            }
            this.saving = true
            const info = {
              roleId:this.formItem.roleId,
              menus:menuIds.join(",")
            }
            grantAuthorityRole(info).then(res => {
              if (res.code === 0) {
                this.$Message.success('授权成功')
                this.handleReset()
              }
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }

      if (this.current === this.forms[2]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            addRoleUsers({
              roleId: this.formItem.roleId,
              userIds: this.formItem.userIds
            }).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleReset()
              }
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }
    },
    handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getRoles(this.pageInfo).then(res => {
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
      this.pageInfo.size = size
      this.handleSearch()
    },
    handleRemove (data) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          removeRole(data.roleId).then(res => {
            if (res.code === 0) {
              this.pageInfo.page = 1
              this.$Message.success('删除成功')
            }
            this.handleSearch()
          })
        }
      })
    },
    handleLoadRoleGranted (roleId) {
      if (!roleId) {
        return
      }
      const that = this
      const p1 = getAuthorityMenu()
      const p2 = getAuthorityRole(roleId)
      Promise.all([p1, p2]).then(function (values) {
        let res1 = values[0]
        let res2 = values[1]
        if (res1.code === 0 && res1.data) {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '60914034d768af34cedfa8d7f0defca2'
          }
          if (res2.code === 0 && res2.data && res2.data.length > 0) {
            res2.data.map(item => {
              that.formItem.grantMenus.push(item.menuId)
            })
          }
          console.log(that.formItem.grantMenus);
          res1.data.map(item => {
            // 菜单选中
            if (that.formItem.grantMenus.includes(item.menuId)) {
              item._isChecked = true
              console.log('======');
            }
          })
          let data = listConvertTree(res1.data, opt)
          that.selectMenus =that.toData(data)
        }
        that.modalVisible = true
      })
    },
    toData(data) {
      let obj = []
      if (!data) {
        return ''
      }
      data.map(item => {
        let _obj = {
          children: this.toData(item.childMenus),
          createTime: item.createTime,
          hasChild: item.hasChild,
          icon: item.menuIcon,
          isPersist: item.menuId,
          menuCode: item.menuAuthority,
          menuDesc: item.menuId,
          menuId: item.menuId,
          menuName: item.fullName,
          parentId: item.parentId,
          priority: item.menuSort,
          status: item.menuState,
          path: item.menuUrl,
          _isChecked:item._isChecked || false
        }
        obj.push(_obj)
      })
      return obj
    },
    handleLoadRoleUsers (roleId) {
      if (!roleId) {
        return
      }
      const that = this
      const p1 = getAllUsers()
      const p2 = getRoleUsers(roleId)
      Promise.all([p1, p2]).then(function (values) {
        let res1 = values[0]
        let res2 = values[1]
        if (res1.code === 0) {
          res1.data.map(item => {
            item.key = item.userId
            item.label = `${item.userName}(${item.nickName})`
          })
          that.selectUsers = res1.data
        }
        if (res2.code === 0) {
          res2.data.map(item => {
            that.formItem.userIds.push(item.userId)
          })
        }
        that.modalVisible = true
      })
    },
    transferRender (item) {
      return `<span  title="${item.label}">${item.label}</span>`
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      this.formItem.userIds = newTargetKeys
    },
    handleClick (name, row) {
      switch (name) {
        case 'addUser':
          this.handleModal(row, this.forms[2])
          break
        case 'remove':
          this.handleRemove(row)
          break
      }
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
