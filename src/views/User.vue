<template>
  <!-- 头部 -->
  <div>
    <hm-header>个人中心</hm-header>

    <!-- 信息 -->
    <div class="info">
      <!-- 图片注意路径问题 -->
      <div class="left"><img :src="$axios.defaults.baseURL + info.head_img" alt object-fit=/></div>
      <div class="center">
        <div class="nickname">
          <i v-if="info.gender === 1" class="iconfont iconxingbienan">
            {{
            info.nickname
            }}
          </i>
          <i v-else class="iconfont iconxingbienv">{{ info.nickname }}</i>
        </div>
        <div class="date">{{ info.create_date | date('YYYY-MM-DD hh:mm') }}</div>
      </div>
    </div>

    <!-- 列表部分 -->
    <van-cell-group>
      <van-cell @click="$router.push('/my-follow')" title="我的关注" is-link value="关注的用户" />
      <van-cell title="我的跟帖" is-link value="更贴/回复" @click="$router.push('/my-comment')" />
      <van-cell @click="$router.push('/my-star')" title="我的收藏" is-link value="文档/视频" />
      <van-cell title="设置" is-link @click="$router.push('/Edit')" />
      <van-cell title="退出" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      info: ""
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("user_id");
    const res = await this.$axios.get(`/user/${id}`);
    const { statusCode, data, message } = res.data;
    if (statusCode === 200) {
      this.info = data;
    } else if (statusCode === 401 && message === "用户信息验证失败") {
      console.log("token失败了");
    } else {
      this.$toast.fail(message);
    }
  },
  methods: {
    //点击退出
    logout() {
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "确定退出吗?"
        })
        .then(() => {
          //删除token
          localStorage.removeItem("token");
          //删除提示
          this.$toast.success("退出成功");
          //跳转到login
          this.$router.push("/login");
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style scoped lang="less">
.info {
  height: 100px;
  border-bottom: 2px solid #cccccc;

  display: flex;
  padding: 0 20px;
  align-items: center;

  .left {
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .center {
    flex: 1;
    padding-left: 20px;
    height: 50px;
    line-height: 25px;
    font-size: 14px;
    .name {
      color: #000;
    }
  }
}
</style>
