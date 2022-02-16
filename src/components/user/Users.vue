<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="15"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="5"
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" stripe border>
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="160px" label="操作">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="small"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="small"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="small"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="setRoleDialogClosed"
    >
      <p>当前用户:{{ userInfo.username }}</p>
      <p>当前角色:{{ userInfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRole" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加用户的提示框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDialogClosed"
    >
      <!-- 提示框内容 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed"
    >
      <!-- 提示框内容 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3|4|5|8][0-9]\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormrules: {
        username: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRole: ''
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUsersList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUsersList();
    },
    async userStateChange(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败!");
      }
      this.$message.success("更新用户状态成功!");
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        //console.log(valid)
        if (!valid) return;
        //发起添加用户的网络请求
        const res = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.data.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUsersList();
      });
    },
    //展示编辑对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败!");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败!");
        }
        this.getUsersList();
        this.$message.success("更新用户信息成功!");
        this.editDialogVisible = false;
      });
    },
    async removeUserById(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmRes);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败!");
      }
      console.log(res);
      this.$message.success("删除用户成功!");
      this.getUsersList();
    },
    async setRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }
      this.rolesList = res.data;

      this.setRoleDialogVisible = true;
    },
    async saveRoleInfo(){
      if(!this.selectedRole){
        return this.$message.error('请选择要分配的角色!')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,
      {rid: this.selectedRole})

      console.log(res)
      if(res.meta.status !== 200) {
        return this.$message.error('分配角色失败!')
      }
      this.$message.success('分配角色成功!')
      this.getUsersList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed(){
      this.selectedRole = ''
    }
  },
};
</script>

<style lang="less" scoped>
.is-success {
  border: 1px solid greenyellow !important;
}
</style>
