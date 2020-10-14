<template>
  <div>
    <hm-header>我的关注</hm-header>

    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt />
        </div>
        <div class="center">
          <div class="nickname">{{item.nickname}}</div>
          <div class="date">{{item.create_date | date}}</div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [] //关注的用户列表
    };
  },
  created() {
    this.getFollowList();
  },
  methods: {
    async getFollowList() {
      const res = await this.$axios.get("/user_follows");
      // console.log(res);
      this.list = res.data.data;
    },
    //取消关注的用户
    async unfollow(id) {
      await this.$dialog.confirm({
        title: "提示",
        message: "确定要取消吗"
      });
      const res = await this.$axios.get(`/user_unfollow/${id}`);
      const { statusCode, message } = res.data;
      if (statusCode === 200) {
        this.$toast.success(message);
        this.getFollowList();
      }
    }
  }
};
</script>

<style lang='less' scoped>
.item {
  height: 80px;
  border-bottom: 1px solid #ccc;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .left {
    img {
      width: 40px;
      height: 40px;
      display: block;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    .name {
      font-size: 14px;
    }
    .date {
      color: #999;
      font-size: 12px;
    }
  }

  .right {
    height: 30px;
    line-height: 30px;
    background: #ddd;
    border-radius: 15px;
    padding: 0 15px;
    color: #000;
  }
}
</style>