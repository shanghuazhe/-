<template>
  <div>
    <!-- 头部 -->
    <hm-header>登录</hm-header>
    <!-- logo -->
    <hm-logo></hm-logo>
    <!-- 输入框 -->
    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      clearable
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />
    <!-- 按钮 -->
    <hm-button @click.native="startLogin">登录</hm-button>

    <!-- 点击去注册 -->
    <div class="link">
      <router-link to="/register">点击注册账号</router-link>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  data() {
    return {
      username: "10086", //用户名
      password: "123", //密码
      usernameErrMsg: "", //用户名错误提示
      passwordErrMsg: "" //密码错误提示
    };
  },
  created() {
    const { username, password } = this.$route.params;
    if (username && password) {
      this.username = username;
      this.password = password;
    }
  },
  methods: {
    //校验用户名
    checkUsername() {
      const reg = /^1\d{3,5}$/;
      if (reg.test(this.username)) {
        this.usernameErrMsg = "";
      } else {
        this.usernameErrMsg = "用户名错误";
      }
    },
    //清除用户名错误提示
    clearUsername() {
      this.usernameErrMsg = "";
    },
    checkPassword() {
      const reg = /^\d{3,12}$/;
      if (reg.test(this.password)) {
        this.passwordErrMsg = "";
      } else {
        this.passwordErrMsg = "密码错误";
      }
    },
    //清空密码提示错误
    clearPassword() {
      this.passwordErrMsg = "";
    },
    async startLogin() {
      if (
        this.username !== "" &&
        this.password !== "" &&
        this.usernameErrMsg === "" &&
        this.passwordErrMsg === ""
      ) {
        const res = await this.$axios.post("/login", {
          username: this.username,
          password: this.password
        });
        const { statusCode, message, data } = res.data;
        if (statusCode === 200) {
          //保存loken  + id
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user.id);
          //提示
          this.$toast.success(message);

          //跳转
          this.$router.push("/user");
        } else {
          this.$toast.fail(message);
        }
      } else {
        this.$toast.loading("校验失败");
      }
    }
  }
};
</script>

<style>
.link {
  text-align: right;
  margin-right: 15px;
}
</style>
