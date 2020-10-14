<template>
  <div>
    <!-- 头部 -->
    <hm-header>注册</hm-header>
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
      v-model="nickname"
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      clearable
      @input="checkNickname"
      @clear="clearNickname"
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
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data() {
    return {
      username: "12341212",
      password: "12",
      nickname: "12345",
      nicknameErrMsg: "",
      usernameErrMsg: "",
      passwordErrMsg: ""
    };
  },
  methods: {
    checkUsername() {
      const reg = /^1\d{3,5}$/;
      if (reg.test(this.username)) {
        this.usernameErrMsg = "";
      } else {
        this.usernameErrMsg = "用户名错误";
      }
    },
    clearUsername() {
      this.usernameErrMsg = "";
    },
    checkNickname() {
      const reg = /^1\d{3,5}$/;
      if (reg.test(this.nickname)) {
        this.nicknameErrMsg = "";
      } else {
        this.nicknameErrMsg = "昵称错误";
      }
    },
    clearNickname() {
      this.nicknameErrMsg = "";
    },
    checkPassword() {
      const reg = /^\d{3,12}$/;
      if (reg.test(this.password)) {
        this.passwordErrMsg = "";
      } else {
        this.passwordErrMsg = "密码错误";
      }
    },
    clearPassword() {
      this.passwordErrMsg = "";
    },
    async startRegister() {
      if (
        this.username !== "" &&
        this.password !== "" &&
        this.nickname !== "" &&
        this.usernameErrMsg === "" &&
        this.nicknameErrMsg === "" &&
        this.passwordErrMsg === ""
      ) {
        this.$toast.success("成功");
        const res = await this.$axios.post("/register", {
          username: this.username,
          nickname: this.nickname,
          password: this.password
        });
        console.log("注册结果", res.data);

        const { message, statusCode } = res.data;
        if (statusCode === 200) {
          //提示
          this.$toast.success(message);

          //跳转
          this.$router.push({
            // path: "/login",
            name: "login",
            params: {
              username: this.username,
              password: this.password
            }
          });
        } else {
          this.$toast.fail(message);
        }
      } else {
        this.$toast.fail("校验失败");
      }
    }
  }
};
</script>

<style></style>
