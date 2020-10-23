<template>
  <div class="hm-comment">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <img :src="$axios.defaults.baseURL +comment.user.head_img" alt />
      </div>
      <div class="center">
        <div class="name">{{comment.user.nickname}}</div>
        <div class="date">{{comment.create_date}}</div>
      </div>
      <div class="right" @click="reply">回复</div>
    </div>
    <!-- 楼层 -->
    <hm-floor :count="getCount(0,comment)" v-if="comment.parent" :parent="comment.parent"></hm-floor>
    <!-- 内容 -->
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
export default {
  props: ["comment"],
  methods: {
    // 递归来查询parent的个数
    getCount(num, parent) {
      if (parent.parent) {
        return this.getCount(num + 1, parent.parent);
      } else {
        return num;
      }
    },
    //评论组件的回复
    reply() {
      console.log("评论组件的回复:");
      this.$bus.$emit("reply", this.comment.id, this.comment.user.nickname);
    }
  }
};
</script>

<style scoped lang = 'less'>
.hm-comment {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .header {
    align-items: center;

    display: flex;
    .left {
      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .center {
      padding-left: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 50px;
      line-height: 25px;
      .date {
        color: #999;
      }
    }
    .right {
      width: 50px;
      color: #999;
    }
  }
  .content {
    margin-top: 5px;
  }
}
</style>