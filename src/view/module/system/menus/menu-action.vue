<template>
  <div>
    <div class="search-con search-con-top">
      <ButtonGroup>
        <Button
          :disabled="value.menuId"
          class="search-btn" type="primary" @click="handleModal(1)">
          <Icon type="search"/>&nbsp;&nbsp;
          <span>添加功能权限</span>
        </Button>
      </ButtonGroup>
    </div>
    <Table :columns="columns" :data="data" :loading="loading">
      <template slot="status" slot-scope="{ row }">
        <Badge v-if="row.status===1" status="success"/>
        <Badge v-else="" status="error"/>
        <span>{{row.actionName}}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <a :disabled="false" @click="handleModal(2,row)">编辑</a> &nbsp;
        <!--        <a :disabled="hasAuthority('systemMenuEdit')?false:true" @click="handleModal(row,forms[1])">接口授权</a> &nbsp;-->
        <a :disabled="false" @click="handleRemove(row)">删除</a>
      </template>
    </Table>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="800"
           @on-cancel="handleReset">
      <Form ref="formPermission" :model="formItem" :rules="formItemRules" :label-width="100">
        <FormItem label="所属菜单">
          <Input disabled v-model="value.menuName"></Input>
        </FormItem>
        <FormItem label="功能名称" prop="actionName">
          <Input v-model="formItem.actionName" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="功能权限" prop="actionCode">
          <Input v-model="formItem.actionCode" placeholder="请输入内容"></Input>
          <span>菜单标识+自定义标识.默认后缀：View、Edit</span>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="formItem.status">
            <Radio label="0">禁用</Radio>
            <Radio label="1">启用</Radio>
          </RadioGroup>
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
  import { addAction, checkAuthOnelyone, getActionsByMenu, removeAction, updateAction, } from '@/api/action'

  export default {
    name: 'MenuAction',
    props: {
      value: Object
    },
    data () {
      const validateEn = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('功能权限不能为空'))
        } else {
          console.log(this.oldAuth + '----' + this.formItem.actionCode)
          if (this.oldAuth !== this.formItem.actionCode) {
            const parentId = this.oldAuth === '' ? this.value.menuId : this.formItem.parentId
            checkAuthOnelyone(parentId, this.formItem.actionCode).then(res => {
              console.log(res.data)
              if (!res.data) {
                callback(new Error('功能权限不能重复'))
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
        oldAuth: '',
        modalVisible: false,
        saving: false,
        loading: false,
        modalTitle: '',
        confirmModal: false,
        selectApis: [],
        formItemRules: {
          actionCode: [
            { required: true, validator: validateEn, trigger: 'blur' }
          ],
          actionName: [
            { required: true, message: '功能名称不能为空', trigger: 'blur' }
          ]
        },
        formItem: {
          actionCode: '',
          actionName: '',
          status: 1,
          menuId: '',
          parentId: '',
          type: ''
        },
        columns: [
          {
            title: '功能名称',
            slot: 'status',
            minWidth: 80
          },
          {
            title: '功能编码',
            key: 'actionCode',
            minWidth: 80
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
        if (type === 2) {
          this.oldAuth = data.actionCode
          this.formItem = Object.assign({}, this.formItem, data)
        } else if (type === 1) {
          this.parentId = this.value.menuId
          this.oldAuth = ''
        }
        this.modalTitle = data ? '编辑功能 - ' + this.value.menuName + ' > ' + data.actionName : '添加功能 - ' + this.value.menuName
        this.modalVisible = true
        this.formItem.status = this.formItem.status + ''
      },
      handleReset () {
        //重置验证
        this.$refs['formPermission'].resetFields()
        this.modalVisible = false
        this.saving = false
      },
      handleSubmit () {
        this.$refs['formPermission'].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.type === 2) {
              updateAction(this.formItem).then(res => {
                this.handleReset()
                this.handleSearch()
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                }
              }).finally(() => {
                this.saving = false
              })
            } else {
              addAction(this.formItem, this.value.menuId).then(res => {
                this.handleReset()
                this.handleSearch()
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
      handleSearch () {
        if (!this.value || !this.value.menuId) {
          return
        }
        console.log(JSON.stringify(this.value))
        this.loading = true
        getActionsByMenu(this.value.menuId).then(res => {
          let arr = []
          res.data.forEach(item => {
            let _item = {
              status: item.menuState,
              actionCode: item.menuAuthority,
              actionName: item.fullName,
              menuId: item.menuId,
              parentId: item.parentId
            }
            arr.push(_item)
          })
          this.data = arr
        }).finally(() => {
          this.loading = false
        })
      },
      handleRemove (data) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          onOk: () => {
            removeAction(data.menuId).then(res => {
              if (res.code === 0) {
                this.$Message.success('删除成功')
              }
              this.handleSearch()
            })
          }
        })
      }
    },
    watch: {
      value (val) {
        this.handleSearch()
      }
    },
  }
</script>
