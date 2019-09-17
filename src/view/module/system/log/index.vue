<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="操作人账号" prop="userAccount">
          <Input type="text" v-model="pageInfo.userAccount" placeholder="请输入操作人账号"/>
        </FormItem>
        <FormItem label="操作人姓名" prop="userName">
          <Input type="text" v-model="pageInfo.userName" placeholder="请输入操作人姓名"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)" >查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>
      <Table :columns="columns" :data="data" :loading="loading">
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.size" show-elevator
            show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
  </div>
</template>

<script>
import { getLogs} from '@/api/log'

export default {
  name: 'SystemRole',
  data () {
    return {
      pageInfo: {
        total: 0,
        page: 1,
        size: 10,
        roleName: ''
      },
      loading: false,
      columns: [
        {
          title: '操作人姓名',
          key: 'userName',
          minWidth: 120
        },
        {
          title: '操作人账号',
          key: 'userAccount',
          minWidth: 120
        },
        {
          title: '日志类型',
          key: 'logType_dictText',
          minWidth: 120
        },
        {
          title: '日志描述',
          key: 'logContent',
          minWidth: 120
        },
        {
          title: '操作类型',
          key: 'operateType_dictText',
          minWidth: 120
        },
        {
          title: 'ip',
          key: 'ip',
          minWidth: 120
        },
        {
          title: '请求方法',
          key: 'method',
          minWidth: 120
        },
        {
          title: '请求url',
          key: 'requestUrl',
          minWidth: 120
        },
        {
          title: '请求时间[毫秒]',
          key: 'costTime',
          minWidth: 120
        },
        {
          title: '登录时间',
          key: 'createTime',
          minWidth: 120
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
      this.formItem = Object.assign({}, this.formItem, data)
      step = this.forms[0]
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
    },
    handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getLogs(this.pageInfo).then(res => {
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
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
