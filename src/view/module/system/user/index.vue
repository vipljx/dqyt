<template>
  <div>
    <Row :gutter="8">
      <Col :xs="10" :sm="10" :md="10" :lg="12" >
        <Card shadow style="height: 320px" >
          <p slot="title">组织机构信息列表</p>
          <tree-table style="max-height:250px;overflow: auto;"
                      expand-key="menuName"
                      @radio-click="rowClick"
                      :expand-type="false"
                      :is-fold="false"
                      :tree-type="true"
                      :selectable="false"
                      :columns="columns"
                      :data="data">
          </tree-table>
        </Card>
      </Col>
      <Col :xs="10" :sm="10" :md="10" :lg="12" >
        <Card shadow style="height: 320px">
          <p slot="title">组织机构信息维护</p>
          <div class="search-con search-con-top">
            <ButtonGroup>
              <Button type="primary" :disabled="false" @click="setEnabled(true,1)">
                添加
              </Button>
              <Button type="primary" :disabled="formItem.menuId && false"
                      @click="setEnabled(false,2)">编辑
              </Button>
              <Button type="primary" :disabled="formItem.menuId && false"
                      @click="confirmModal = true">删除
              </Button>
            </ButtonGroup>
            <Modal
              v-model="confirmModal"
              title="提示"
              @on-ok="handleRemove">
              确定删除,机构信息【{{formItem.menuName}}】吗?{{formItem.children && formItem.children.length > 0 ?
              '存在子机构,将一起删除.是否继续?' : ''}}
            </Modal>
          </div>
          <Form ref="menuForm" :model="formItem" :rules="formItemRules" :label-width="80" >
            <FormItem label="上级机构" prop="parentId" v-show="isParent">
              <treeselect :disabled="disabled"
                          v-model="formItem.parentId"
                          :options="selectTreeData"
                          :default-expand-level="1"
                          :normalizer="treeSelectNormalizer"/>
            </FormItem>
            <FormItem label="机构名称" prop="menuName">
              <Input :disabled="disabled" v-model="formItem.menuName" placeholder="请输入内容"></Input>
            </FormItem>
            <FormItem>
              <Button :disabled="disabled" @click="handleSubmit" :loading="saving" type="primary">保存</Button>
              <Button :disabled="disabled" @click="setEnabled(true,3)" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
      <Col :xs="16" :sm="16" :md="16" :lg="24" style="margin-top: 10px">
        <Card shadow>
          <p slot="title">用户列表信息</p>
          <menu-action :value="formItem"></menu-action>
        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
  import {listConvertTree} from '@/libs/util'
  import {addOrg, getOrgs, delOrgInfo, updOrgInfo} from '@/api/org'
  import MenuAction from './user-action.vue'
  import icons from './icons'

  export default {
    name: 'SystemMenu',
    components: {
      MenuAction
    },
    data() {
      const validateOrg = (rule, value, callback) => {
        if(this.formItem.parentId ==='0')
        {
          callback(new Error('请选择组织机构'))
        }else{
          callback()
        }
      }
      return {
        confirmModal: false,
        disabled: true,
        saving: false,
        visible: false,
        isParent:true,
        selectIcons: icons,
        selectTreeData: [{
          menuId: '0',
          menuName: '无'
        }],
        formItemRules: {
          parentId: [
            { required: true, validator: validateOrg, trigger: 'input' }
          ],
          menuName: [
            {required: true, message: '机构名称不能为空', trigger: 'blur'}
          ]
        },
        formItem: {
          menuId: '',
          menuCode: '',
          menuName: '',
          icon: 'md-document',
          parentId: '0',
          menuDesc: ''
        },
        columns: [
          {
            title: '机构名称',
            key: 'menuName',
            minWidth: '130px'
          }
        ],
        data: []
      }
    },
    methods: {
      treeSelectNormalizer(node) {
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        }
      },
      setSelectTree(data) {
        this.selectTreeData = [{menuId: '0', menuName: '无'}].concat(data)
      },
      setEnabled(enabled,type) {
        if(type===1 ){
          this.isParent= true;
        }else if(type===2)
        {
          this.isParent = false;
        }
        if (enabled) {
          this.handleReset()
        }
        this.disabled = false
      },
      rowClick(data) {
        this.disabled = true
        this.handleReset()
        if (data) {
          this.formItem = Object.assign({}, data.row)
        }
      },
      handleReset() {
        const newData = {
          menuId: '',
          menuCode: '',
          menuName: '',
          icon: 'md-document',
          parentId: '0',
          menuDesc: ''
        }
        this.formItem = newData
        this.$refs['menuForm'].resetFields()
        this.saving = false
      },
      handleSubmit() {
        this.$refs['menuForm'].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.menuId && this.formItem.menuId!=='0') {
              updOrgInfo(this.formItem).then(res => {
                if (res.code === 0) {
                  this.disabled = true
                  this.$Message.success('保存成功')
                }
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            } else {
              addOrg(this.formItem).then(res => {
                if (res.code === 0) {
                  this.disabled = true
                  this.$Message.success('保存成功')
                  this.handleSearch()
                }
              }).finally(() => {
                this.saving = false
              })
            }
          }
        })
      },
      handleRemove() {
        if("881520ee2d1fe860107ff249c6c9035e" === this.formItem.menuId)
        {
          this.$Message.error('顶级目录无法删除')
          return false;
        }
        delOrgInfo(this.formItem.menuId).then(res => {
          this.handleReset()
          this.handleSearch()
          if (res.code === 0) {
            this.$Message.success('删除成功')
          }
        })
      },
      onIconClick(item) {
        this.formItem.icon = item
      },
      handleSearch() {
        getOrgs().then(res => {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '0'
          }
          let data = listConvertTree(res.data, opt)
          this.data = this.dataToData(data)
          this.setSelectTree(this.data)
        })
      },
      dataToData(data) {
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
            menuCode: item.menuAuthority,
            menuDesc: item.menuId,
            menuId: item.menuId,
            menuName: item.menuName,
            parentId: item.parentId,
            status: item.menuState,
            path: item.menuUrl
          }
          obj.push(_obj)
        })
        return obj
      }
    },
    mounted: function () {
      this.handleSearch()
    }
  }
</script>
<style>
  .icons {
    overflow: auto;
    zoom: 1;
    height: 300px;
  }

  .icons-item {
    float: left;
    margin: 6px;
    width: 60px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: #5c6b77;
    transition: all .2s ease;
    position: relative;
  }

  .icons-item p {
    word-break: break-all;
    overflow: hidden;
  }
</style>
