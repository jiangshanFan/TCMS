<template>
  <div class="UserRoleAddOrEdit p20">
    <el-form :model="basicInfo" :rules="rules" ref="UserRoleAddOrEdit" label-width="120px" label-position="right" size="mini">

      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="角色名称：" prop="roleName">
            <el-input style="width:100%;" v-model="basicInfo.roleName" clearable maxlength="32"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="角色状态：" prop="status">
            <el-select v-model="basicInfo.status" placeholder="请选择">
              <el-option v-for="item in status" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否属于管理层：" prop="status" label-width="130px">
            <el-select v-model="basicInfo.manager" placeholder="请选择">
              <el-option v-for="item in manager" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="角色描述：" prop="des">
            <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="basicInfo.des"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6" :offset="2">
          <el-tree
            :data="permissionLists"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            check-strictly
            highlight-current
            @check="showCheck"
            :props="defaultProps">
          </el-tree>
        </el-col>
      </el-row>

      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="submitForm('UserRoleAddOrEdit')">确定</el-button>
          <el-button type="plain" @click="resetForm('UserRoleAddOrEdit')">重置</el-button>
        </el-form-item>
      </el-col>

    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  import _difference from 'lodash.difference'
  /** 导入api.js */
  import { insertRole, updateRole, getPermissionList, getPermissionListById, } from '../axios/api.js'
  export default {
    name: "UserRoleAddOrEdit",
    async created() {
      this.basicInfo = Object.assign({},this.$store.getters.auth_userRole);
      if (!this.basicInfo.status) {
        this.basicInfo = {
          status : 1,
          manager: false,
        }
      }
    },
    async mounted() {
      let res = await getPermissionList();
      if (res.status === 1) {
        this.permissionLists = res.msg;
      }

      if (Object.keys(this.basicInfo).length === 2) {
        this.choose = 0;
      } else {
        this.choose = 1;
        // this.getMenuClass(this.permissionLists);
        let res1 = await getPermissionListById({id: this.basicInfo.id});
        if (res1.status === 1) {
          // let arr = _difference(res1.msg, this.permissionListsClass);
          this.permissionIdsDefault = res1.msg;
          this.$refs.tree.setCheckedKeys(res1.msg);
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // getCheckedKeys
            let ifValid = false;
            let checkedKeys = this.$refs.tree.getCheckedKeys();
            console.log(checkedKeys);
            if (checkedKeys.length) {
              checkedKeys.forEach((item,i) => {
                let node = this.$refs.tree.getNode(item);
                if (node.data.type === 1) {
                  ifValid = node.childNodes.some(ic => ic.checked);
                }
              });

              if (ifValid) {
                let res;
                if (this.choose === 0) {
                  res = await insertRole({...this.basicInfo, permissionIds: this.permissionIdss});
                } else {
                  res = await updateRole({...this.basicInfo, permissionIds: this.permissionIdss});
                }
                if (res.status === 1) {
                  if (this.choose === 1) {
                    this.$emit('ifChange','edit');
                  } else {
                    this.$router.push({path: '/user/userRole'});
                  }

                  Message({showClose: true, type: 'success', message: '新增或更新角色成功！'})
                }
              } else {
                Message({showClose: true, type: 'error', message: '请仔细核对勾选项，提示：选择一级菜单后需添加此菜单下子菜单（至少选择一个），请检查是否有二级菜单漏选，确认无误再点击确定提交！'});
              }
            } else {
              Message({showClose: true, type: 'error', message: '请选择相关菜单！！'});
            }
          } else {
            console.log('error submit!!');
            Message({showClose: true, type: 'error', message: '请仔细核对角色信息，确认填写角色名称无误再点击确定提交！'});
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs.tree.setCheckedKeys(this.permissionIdsDefault);
      },

      // get permissionIds
      showCheck(obj,obj1) {
        let self = this;
        self.permissionIdss = obj1.checkedKeys;
        self.permissionIdsDelete = [];
        function nod(obj, val) {
          if (val === 0) {
            if(obj.key && !self.permissionIdss.includes(obj.key)) {
              self.permissionIdss.push(obj.key)
            }
          } else {
            self.permissionIdsDelete.push(obj.key);
          }
        }
        if (obj1.checkedKeys.includes(obj.id)) {
          let node = self.$refs.tree.getNode(obj.id);
          nodP(node);
          function nodP(node) {
            if (node.parent) {
              nod(node, 0);
              nodP(node.parent);
            } else {
              console.log(self.permissionIdss);
              self.$refs.tree.setCheckedKeys(self.permissionIdss);
            }
          }
        } else {
          console.log(self.$refs.tree.getNode(obj.id));
          nodC(self.$refs.tree.getNode(obj.id));
          function nodC(node) {
            nod(node, 1);
            if (node.childNodes.length) {
              node.childNodes.forEach(item => {
                nodC(item);
              });
            }
            console.log(self.permissionIdsDelete);
            self.$refs.tree.setCheckedKeys(_difference(self.$refs.tree.getCheckedKeys(), self.permissionIdsDelete));
          }
        }
      },

      // // 获取菜单项的类
      // getMenuClass(list = []) {
      //   for (let item of list) {
      //     if (item.children) {
      //       if (item.children.length) {
      //         this.permissionListsClass.push(item.id);
      //         this.getMenuClass(item.children);
      //       }
      //     }
      //   }
      //   console.log(this.permissionListsClass);
      // }
    },
    data() {
      return {
        // role status
        status: [
          { id: 0, label: '关闭'},
          { id: 1, label: '启用'},
        ],
        manager: [
          { id: false, label: '否'},
          { id: true, label: '是'},
        ],
        // basicInfo
        basicInfo: {},
        permissionLists: [],
        permissionIdsDefault: [],
        permissionIdss: [],
        // 上级取消后，需要去除的子项
        permissionIdsDelete: [],

        rules: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: ['blur','change'] },
          ],
          desc: [
            { message: '角色描述不能超过100字', max: 100, trigger: ['blur','change'] },
          ],
        },

        // choose api
        choose: 0,

        // tree
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
  }
</script>

<style scoped>

</style>
