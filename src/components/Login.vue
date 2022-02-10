<template>
  <div id="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avater_box">
        <img src="../assets/shu.png" alt="" />
      </div>
      <div class="form_box">
        <el-form ref="form" :model="loginForm" :rules="loginRules" label-width="0px">
          <el-form-item label="" prop="username">
            <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="submitForm('form')"
              >提交</el-button
            >
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
           username: [
            { required: true, message: '请输入名字', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
    };
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            // alert('submit!');
            const {data: result} = await this.$http.post("login", this.loginForm)
            if(result.meta.status !== 200) return this.$message.error("登陆失败！")
            this.$message.success("登陆成功")
            console.log(result)
            window.sessionStorage.setItem('token',result.data.token)
            this.$router.push("/home")
          } else {
            console.log('登录错误!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  },
};
</script>

<style lang="less" scoped>
#login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
