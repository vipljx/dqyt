<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="进口名称" prop="deviceName">
          <Input type="text" v-model="pageInfo.deviceName" placeholder="请输入井口名称"/>
        </FormItem>
        <FormItem label="状态" prop="workState">
          <Select v-model="pageInfo.workState" style="width:200px">
            <Option value="自清洗">自清洗</Option>
            <Option value="测量中">测量中</Option>
          </Select>
        </FormItem>
        <FormItem label="是否在线" prop="isOnline">
          <Select v-model="pageInfo.isOnline" style="width:200px">
            <Option value="在线">在线</Option>
            <Option value="未在线">未在线</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot="isOnline" slot-scope="{ row }">
          <Badge v-if="row.isOnline==='在线'" status="success"/>
          <Badge v-else="" status="error"/>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a @click="handleModal(row)">配置井口</a>&nbsp;
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.size" show-elevator
            show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           fullscreen
           width="800"
           @on-cancel="handleReset">
      <Form ref="configFrom" :model="formItem" :rules="formItemRules" :label-width="100">
        <Row>
          <Col span="11">
            <FormItem label="井口名称">
              <Input v-model="formItem.deviceName" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="机构信息" prop="orgId">
              <treeselect
                v-model="formItem.orgId"
                :options="selectTreeData"
                :default-expand-level="1"
                :normalizer="treeSelectNormalizer"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="状态">
              <Input v-model="formItem.isOnline" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="工作状态">
              <Input v-model="formItem.workState" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="含水率测量值">
              <Input v-model="formItem.waterRate" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="持续时间【秒】">
              <Input v-model="formItem.workDuration" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="11">
            <FormItem label="罐体温度">
              <Input v-model="formItem.tankTemperature" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="设备温度">
              <Input v-model="formItem.equipmentTemperature" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="管线压力">
              <Input v-model="formItem.pipelinePressure" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="设备压力">
              <Input v-model="formItem.equipmentPressure" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="位置信息" prop="position">
              <Input v-model="formItem.position"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="罐体温度阀值" prop="tankTemperatureThreshold">
              <Input v-model="formItem.tankTemperatureThreshold"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="设备温度阀值" prop="equipmentTemperatureThreshold">
              <Input v-model="formItem.equipmentTemperatureThreshold"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="管线压力阀值" prop="pipelinePressureThreshold">
              <Input v-model="formItem.pipelinePressureThreshold"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="设备压力阀值" prop="equipmentPressureThreshold">
              <Input v-model="formItem.equipmentPressureThreshold"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="采集时间">
              <Input v-model="formItem.acquisitionTime" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="11">
            <FormItem label="更新时间">
              <Input v-model="formItem.updTime" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="创建时间">
              <Input v-model="formItem.createTime" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="saving" @click="handleSubmit">保存</Button>&nbsp;
        <Button type="default" @click="handleReset">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { listConvertTree } from '@/libs/util'
  import { checkOrgLast, queryWellheadConfigById, queryWellheadConfigList, updWellheadConfig } from '@/api/wellhead'
  import { getOrgs } from '@/api/org'

  export default {
    name: 'wellHead',
    data () {
      const validateOrg = (rule, value, callback) => {
        if (value === '' || value === '0') {
          callback(new Error('请选择组织机构'))
        } else {
          checkOrgLast(value).then(res => {
            if (!res.data) {
              callback(new Error('请选择末级组织机构'))
            } else {
              callback()
            }
          }).finally(() => {
            this.saving = false
          })
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
          size: 10,
          deviceName: '',
          workState: '',
          isOnline: ''
        },
        selectTreeData: [{
          menuId: '0',
          menuName: '无'
        }],
        formItemRules: {
          orgId: [
            { required: true, validator: validateOrg, trigger: 'input' }
          ],
          position: [
            { required: true, message: '请输入位置信息', trigger: 'blur' }
          ],
          tankTemperatureThreshold: [
            { required: true, message: '请输入罐体温度阀值', trigger: 'blur', type: 'number' }
          ],
          equipmentTemperatureThreshold: [
            { required: true, message: '请输入罐体温度阀值', trigger: 'blur', type: 'number' }
          ],
          pipelinePressureThreshold: [
            { required: true, message: '请输入管线压力阀值', trigger: 'blur', type: 'number' }
          ],
          equipmentPressureThreshold: [
            { required: true, message: '请输入设备压力阀值', trigger: 'blur', type: 'number' }
          ]
        },
        orgColumns: [
          {
            title: '机构名称',
            key: 'menuName',
            minWidth: '130px'
          }
        ],
        formItem: {},
        columns: [
          {
            title: '井口名称',
            key: 'deviceName',
            minWidth: 120
          },
          {
            title: '所属机构',
            key: 'orgName',
            minWidth: 100
          },
          {
            title: '状态',
            key: 'isOnline',
            type: 'template',
            minWidth: 80,
            slot: 'isOnline',
          },
          {
            title: '含水率',
            key: 'waterRate',
            minWidth: 80
          },
          {
            title: '工作状态',
            key: 'workState',
            minWidth: 100
          },
          {
            title: '持续时间【秒】',
            key: 'workDuration',
            minWidth: 120
          },
          {
            title: '罐体温度',
            key: 'tankTemperature',
            minWidth: 100
          },
          {
            title: '设备温度',
            key: 'equipmentTemperature',
            minWidth: 100
          },
          {
            title: '管线压力',
            key: 'pipelinePressure',
            minWidth: 100
          },
          {
            title: '设备压力',
            key: 'equipmentPressure',
            minWidth: 100
          },
          {
            title: '采集时间',
            key: 'acquisitionTime',
            minWidth: 150
          },
          {
            title: '更新时间',
            key: 'updTime',
            minWidth: 150
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
        data: [],
        orgData: []
      }
    },
    methods: {
      treeSelectNormalizer (node) {
        return {
          id: node.menuId.toString(),
          label: node.menuName,
          children: node.children
        }
      },
      handleModal (data) {
        queryWellheadConfigById(data.wellheadId).then(res => {
          this.formItem = res.data
          this.modalTitle = '配置井口 - ' + data.deviceName
          this.modalVisible = true
        }).finally(() => {
          this.loading = false
        })
      },
      handleResetForm (form) {
        this.$refs[form].resetFields()
      },
      handleReset () {
        this.$refs['configFrom'].resetFields()
        this.modalVisible = false
        this.saving = false
      },
      handleSubmit () {
        this.$refs['configFrom'].validate((valid) => {
          if (valid) {
            const info = {
              wellheadId: this.formItem.wellheadId,
              orgId: this.formItem.orgId,
              position: this.formItem.position,
              tankTemperatureThreshold: this.formItem.tankTemperatureThreshold,
              equipmentTemperatureThreshold: this.formItem.equipmentTemperatureThreshold,
              pipelinePressureThreshold: this.formItem.pipelinePressureThreshold,
              equipmentPressureThreshold: this.formItem.equipmentPressureThreshold
            }
            console.log(JSON.stringify(info))
            updWellheadConfig(info).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
            }).finally(() => {
              this.modalVisible = false
              this.saving = false
            })
          }
        })
      },
      handleSearch (page) {
        if (page) {
          this.pageInfo.page = page
        }
        this.loading = true
        queryWellheadConfigList(this.pageInfo).then(res => {
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
      loadOrg () {
        getOrgs().then(res => {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '0'
          }
          let data = listConvertTree(res.data, opt)
          this.orgData = this.dataToData(data)
          this.setSelectTree(this.orgData)
        })
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
      },
      setSelectTree (data) {
        this.selectTreeData = [{ menuId: '0', menuName: '无' }].concat(data)
      },
      rowClick (data) {
        console.log(data)
      },
    },
    mounted: function () {
      this.handleSearch()
      this.loadOrg()
    }
  }
</script>
