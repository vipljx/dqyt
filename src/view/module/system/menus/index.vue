<template>
  <div>
    <Row :gutter="8">
      <Col :xs="10" :sm="10" :md="10" :lg="14">
        <Card shadow style="height: 720px" >
          <p slot="title">菜单列表信息</p>
          <tree-table style="max-height:700px;overflow: auto"
                      expand-key="menuName"
                      @radio-click="rowClick"
                      :expand-type="false"
                      :is-fold="false"
                      :tree-type="true"
                      :selectable="false"
                      :columns="columns"
                      :data="data">
            <template slot="status" slot-scope="scope">
              <Badge v-if="scope.row.status===1" status="success"/>
              <Badge v-else="" status="error"/>
            </template>
            <template slot="icon" slot-scope="scope">
              <Icon :type="scope.row.icon" size="16"/>
            </template>
            <template slot="caozuo" slot-scope="{ row }">
              <a @click.stop="moveAction(row,0)" :disabled="false">上移</a>&nbsp;
              <a @click.stop="moveAction(row,1)" :disabled="false">下移</a>&nbsp;
            </template>
          </tree-table>
        </Card>
      </Col>
      <Col :xs="14" :sm="14" :md="14" :lg="10">
        <Card shadow style="height: 720px">
          <p slot="title">菜单信息维护</p>
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
              确定删除,菜单资源【{{formItem.menuName}}】吗?{{formItem.children && formItem.children.length > 0 ?
              '存在子菜单,将一起删除.是否继续?' : ''}}
            </Modal>
          </div>
          <Form ref="menuForm" :model="formItem" :rules="formItemRules" :label-width="80">
            <FormItem label="上级菜单" prop="parentId" v-show="isParent">
              <treeselect :disabled="disabled"
                          v-model="formItem.parentId"
                          :options="selectTreeData"
                          :default-expand-level="1"
                          :normalizer="treeSelectNormalizer"/>
            </FormItem>
            <FormItem label="菜单名称" prop="menuName">
              <Input :disabled="disabled" v-model="formItem.menuName" placeholder="请输入内容"></Input>
            </FormItem>
            <FormItem label="页面地址" prop="path" v-show="isUrl">
              <Input :disabled="disabled" v-model="formItem.path" placeholder="请输入内容">
                <Select :disabled="disabled" slot="prepend" style="width: 80px">
                  <Option value="/" selected="selected">/</Option>
                </Select>
                <Select :disabled="disabled" slot="append" style="width: 100px">
                  <Option value="窗口内打开" selected="selected">窗口内打开</Option>
                </Select>
              </Input>
              <span style="color:red">例子:【system/menus/index】前端组件所在位置：/view/module/{{formItem.path}}.vue</span>
            </FormItem>
            <FormItem label="图标">
              <Input :disabled="disabled" v-model="formItem.icon" placeholder="请输入内容">
                <Icon size="16" :type="formItem.icon" slot="prepend"/>
                <Poptip width="600" slot="append" placement="left">
                  <Button :disabled="disabled" icon="ios-search"></Button>
                  <div slot="content">
                    <ul class="icons">
                      <li class="icons-item" :title="item" @click="onIconClick(item)" v-for="item in selectIcons">
                        <Icon :type="item" size="28"/>
                        <p>{{item}}</p>
                      </li>
                    </ul>
                  </div>
                </Poptip>
              </Input>
            </FormItem>
            <FormItem label="状态">
              <RadioGroup v-model="formItem.status">
                <Radio :disabled="disabled" label="0">禁用</Radio>
                <Radio :disabled="disabled" label="1">启用</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <Button :disabled="disabled" @click="handleSubmit" :loading="saving" type="primary">保存</Button>
              <Button :disabled="disabled" @click="setEnabled(true,3)" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
<!--      <Col :xs="16" :sm="16" :md="16" :lg="8">-->
<!--        <Card shadow>-->
<!--          <menu-action :value="formItem"></menu-action>-->
<!--        </Card>-->
<!--      </Col>-->
    </Row>
  </div>
</template>

<script>
  import {listConvertTree} from '@/libs/util'
  import {addMenu, getMenus, menuSort, removeMenu, updateMenu} from '@/api/menu'
  import MenuAction from './menu-action.vue'
  import icons from './icons'

  export default {
    name: 'SystemMenu',
    components: {
      MenuAction
    },
    data() {
      const validateEn = (rule, value, callback) => {
        let reg = /^[_a-zA-Z0-9]+$/
        if (value === '') {
          callback(new Error('菜单标识不能为空'))
        } else if (value !== '' && !reg.test(value)) {
          callback(new Error('只允许字母、数字、下划线'))
        } else {
          callback()
        }
      }
      return {
        confirmModal: false,
        disabled: true,
        saving: false,
        visible: false,
        isUrl: true,
        isParent:true,
        selectIcons: icons,
        selectTreeData: [{
          menuId: '60914034d768af34cedfa8d7f0defca2',
          menuName: '无'
        }],
        formItemRules: {
          parentId: [
            {required: true, message: '请选择上级菜单', trigger: 'blur'}
          ],
          menuName: [
            {required: true, message: '菜单名称不能为空', trigger: 'blur'}
          ]
        },
        formItem: {
          menuId: '',
          menuCode: '',
          menuName: '',
          icon: 'md-document',
          status: 1,
          parentId: '60914034d768af34cedfa8d7f0defca2',
          menuDesc: ''
        },
        columns: [
          {
            title: '菜单名称',
            key: 'menuName',
            minWidth: '130px'
          },
          {
            title: '排序',
            key: 'priority',
            minWidth: '50px'
          },
          {
            title: '状态',
            key: 'status',
            type: 'template',
            minWidth: '50px',
            template: 'status'
          },
          {
            title: '图标',
            key: 'icon',
            type: 'template',
            minWidth: '50px',
            template: 'icon'
          },
          {
            title: '操作',
            key: 'caozuo',
            type: 'template',
            minWidth: '120px',
            template: 'caozuo'
          },

        ],
        data: []
      }
    },
    methods: {
      treeSelectNormalizer(node) {
        return {
          id: node.menuId.toString(),
          label: node.menuName,
          children: node.children
        }
      },
      moveAction(row, type) {
        menuSort(row,type).then(res => {
          console.log(res);
          if (!res.data) {
            this.$Message.error('无法跨级上移')
          } else {
            this.$Message.success('保存成功')
            this.handleSearch()
          }
        }).finally(() => {
          this.saving = false
        })
      },
      setSelectTree(data) {
        this.selectTreeData = [{menuId: '60914034d768af34cedfa8d7f0defca2', menuName: '无'}].concat(data)
      },
      setEnabled(enabled,type) {
        if(type===1 ){
          this.isParent= true;
          this.isUrl = true;
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
        this.isUrl = data.row.parentId === "60914034d768af34cedfa8d7f0defca2" ? false : true;
        this.disabled = true
        this.handleReset()
        if (data) {
          this.formItem = Object.assign({}, data.row)
        }
        this.formItem.status = this.formItem.status + ''
      },
      handleReset() {
        const newData = {
          menuId: '',
          menuCode: '',
          menuName: '',
          icon: 'md-document',
          status: '1',
          parentId: '60914034d768af34cedfa8d7f0defca2',
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
            if (this.formItem.menuId) {
              updateMenu(this.formItem).then(res => {
                if (res.code === 0) {
                  this.disabled = true
                  this.$Message.success('保存成功')
                }
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            } else {
              addMenu(this.formItem).then(res => {
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
        removeMenu(this.formItem.menuId).then(res => {
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
        getMenus().then(res => {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '60914034d768af34cedfa8d7f0defca2'
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
            menuName: item.fullName,
            parentId: item.parentId,
            priority: item.menuSort,
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
