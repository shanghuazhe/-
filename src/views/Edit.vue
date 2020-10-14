
<template>
  <div>
    <!-- 头部 -->
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <van-uploader :after-read="afterRead" class="uploader" />
    </div>
    <!-- 列表 -->
    <van-cell-group>
      <van-cell title="昵称" is-link :value="info.nickname" @click="showNickname" />
      <van-cell title="密码" is-link value="******" />
      <van-cell title="性别" is-link :value="info.gender === 1 ?'男':'女'" @click="showGender" />
    </van-cell-group>

    <!-- 修改昵称弹出框 -->
    <van-dialog @confirm="confirmNickname" v-model="isShowNickname" title="修改昵称" show-cancel-button>
      <van-field v-model="nickname" placeholder="请输入用新昵称"></van-field>
    </van-dialog>

    <!-- 修改性别弹出框 -->
    <van-dialog @confirm="confirmGender" v-model="isShowGender" title="修改性别" show-cancel-button>
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import LoginVue from "./Login.vue";
export default {
  data() {
    return {
      info: {},
      isShowNickname: false,
      nickname: "",
      isShowGender: false,
      gender: "1"
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const user_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      this.$axios.get(`/user/${user_id}`).then(res => {
        this.info = res.data.data;
      });
    },
    showNickname() {
      this.isShowNickname = true;
      //给nickname赋值
      this.nickname = this.info.nickname;
    },
    //修改昵称
    confirmNickname() {
      if (this.nickname === this.info.nickname) {
        this.$toast("修改昵称不能一致");
        return;
      }
      this.ml_editUser({
        nickname: this.nickname
      });
      // const user_id = localStorage.getItem("user_id");
      // const token = localStorage.getItem("token");
      // this.$axios
      //   .post(`/user_update/${user_id}`, {
      //     nickname: this.nickname
      //   })
      //   .then(res => {
      //     this.getInfo();
      //     this.$toast.success("修改昵称OK");
      //   });
    },
    showGender() {
      this.isShowGender = true;
      //数据回显
      this.gender = this.info.gender;
    },
    //点击弹窗内的确定按钮 修改性别
    confirmGender() {
      if (this.gender === this.info.gender) {
        this.$toast("修改性别不能一样");
        return;
      }
      //发送请求
      this.ml_editUser({
        gender: this.gender
      });
      // const user_id = localStorage.getItem("user_id");
      // const token = localStorage.getItem("token");
      // this.$axios
      //   .post(`/user_update/${user_id}`, {
      //     gender: this.gender
      //   })
      //   .then(res => {
      //     this.getInfo();
      //     this.$toast.success("修改性别成功");
      //   });
    },

    //读取图片后的回调
    async afterRead(data) {
      // console.log("图片", data.file);
      //借助formdata帮我们上传  ==>data
      let formdata = new FormData();
      formdata.append("file", data.file);

      //上传
      const res = await this.$axios.post("/upload", formdata);
      // console.log("文件上传", res.data.data.url);
      this.ml_editUser({
        head_img: res.data.data.url
      });
    },

    //封装后的函数 编辑资料
    async ml_editUser(data) {
      const user_id = localStorage.getItem("user_id");
      const res = await this.$axios.post(`/user_update/${user_id}`, data);
      this.getInfo();
      this.$toast.success(res.data.message);
    }
  }
};
</script>

<style scoped lang = 'less'>
.avatar {
  text-align: center;
  margin: 20px 0;
  position: relative;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
  .uploader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
}
</style>