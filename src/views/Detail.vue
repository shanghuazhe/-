<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconjiantou2" @click="$router.back()"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div v-if="detail.has_follow" @click="unfollow" class="follow">已关注</div>
        <div v-else class="follow" @click="follow">关注</div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <div class="title line2">{{detail.title}}</div>
      <div class="name">
        <span>{{detail.user.nickname}}</span>
        <span>{{detail.create_date | date}}</span>
      </div>
      <!-- 内容部分 -->
      <!-- 文本内容 (图片+文字) -->
      <div v-if="detail.type===1" v-html="detail.content"></div>
      <!-- 视频  controls控制条 -->
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div @click="like" class="like" :class="{ active:detail.has_like}">
          <i class="iconfont icondianzan"></i>
          <i>{{detail.like_length}}</i>
        </div>
      </div>
    </div>

    <!-- 滚到某个位置插眼 -->
    <div ref="box"></div>
    <!-- 评论 -->
    <div class="comments">
      <!-- 评论组件 -->
      <hm-comment v-for=" comment in commentsList" :key="comment.id" :comment="comment"></hm-comment>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <!-- input -->
      <div class="input" v-if="!isShow">
        <div class="left">
          <input ref="input" @focus="handleFocus" type="text" />
        </div>
        <div class="center">
          <van-icon name="chat-o" :badge="detail.comment_length" />
        </div>
        <div class="right" @click="star">
          <van-icon name="star-o" :class="{active:detail.has_star}" />
        </div>
      </div>
      <!-- textarea -->
      <div class="textarea" v-else>
        <div class="left">
          <!-- 失焦  blur -->
          <textarea
            v-model="content"
            ref="textarea"
            @blur="handleBlur"
            :placeholder=" replyName ?'回复:'+ replyName :'请输入内容' "
          ></textarea>
        </div>
        <div class="right">
          <div class="send" @touchstart="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {} //这里user写成空对象 是因为上面内容部分 detail.user.nickname 这里detail.user如果没有回报错,这样写就是为了解决报错问题的
      }, //详情页信息
      commentsList: [], // 评论列表
      isShow: false, //控制 textarea显示
      replyId: "", //回复ID
      replyName: "", //回复昵称
      content: "" //回复|评论的内容
    };
  },
  created() {
    this.getDetail();
    this.getComments();

    // 注册事件
    this.$bus.$on("reply", async (replyId, replyName) => {
      // console.log("detail", replyId, replyName);

      // 保存
      this.replyId = replyId; //用来发送
      this.replyName = replyName; //它的作用仅仅是为了显示在 textarea里面

      // 让textarea 出来
      this.isShow = true;
      await this.$nextTick();
      this.$refs.textarea && this.$refs.textarea.focus();
    });
  },
  mounted() {
    console.log("111", this.$refs);
  },
  methods: {
    //获取详情页信息
    async getDetail() {
      const res = await this.$axios.get(`/post/${this.$route.params.id}`);
      // console.log("详情页信息", res.data.data);
      this.detail = res.data.data;
    },
    // 取消关注
    async unfollow() {
      const res = await this.$axios.get(
        `/user_unfollow/${this.detail.user.id}`
      );
      const { message } = res.data;
      this.$toast(message);
      this.getDetail();
    },
    //关注
    async follow() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$toast("请先登录");
        // this.$router.push("/login");
        this.$router.push({
          name: "login",
          params: {
            back: true
          }
        });
      }
      const res = await this.$axios.get(`/user_follows/${this.detail.user.id}`);
      const { message, statusCode } = res.data;
      if (statusCode === 200) {
        //提示关注成功
        this.$toast(message);
        //点击关注成功后 重新获取
        this.getDetail();
      }
    },
    async like() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$toast("请登录");
        this.$router.push({
          name: "login",
          params: {
            back: true
          }
        });
        return;
      }
      // 请求
      const res = await this.$axios.get(`/post_like/${this.detail.id}`);
      console.log("点赞", res.data);
      // 提示
      const { message } = res.data;
      this.$toast.success(message);
      // 重新加载
      this.getDetail();
    },
    // 获取评论列表
    async getComments() {
      const res = await this.$axios.get(
        `/post_comment/${this.$route.params.id}`
      );
      this.commentsList = res.data.data;
    },
    // 聚焦
    async handleFocus() {
      //1. 显示 textarea  => 数据更新 ,更新视图是异步的
      this.isShow = true;
      //2. 聚焦
      await this.$nextTick();
      this.$refs.textarea.focus();
    },
    //失焦
    handleBlur() {
      this.isShow = false; // 失焦 textarea 都要隐藏

      if (!this.content) {
        // 失焦的时候,让 replyID 和 replyName 清空
        this.replyId = "";
        this.replyName = "";
      }
    },
    //点击发送
    async send() {
      const res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId
        }
      );
      console.log("评论结果:", res.data);
      const { statusCode, message } = res.data;
      if (statusCode === 200) {
        // 成功提示
        this.$toast.success(message);
        //重新刷新请求评论
        this.getComments();
        // 清空
        this.content = "";
        this.replyId = "";
        this.replyName = "";

        // textarea影藏
        this.isShow = false;

        // 滚到某个位置
        // const element = this.$refs.box;
        // element.scrollIntoView();
        this.$refs.box.scrollIntoView();
      }
    },
    //收藏
    async star() {
      const res = await this.$axios.get(`/post_star/${this.$route.params.id}`);
      this.$toast.success(res.data);
      this.getDetail();
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    i {
      font-size: 50px;
    }
  }
  .right {
    width: 80px;
    // background: pink;
    .follow {
      border: 1px solid #666;
      width: 60px;
      height: 24px;
      text-align: center;
      line-height: 26px;
      border-radius: 12px;
    }
  }
}

.container {
  padding: 10px;
  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 10px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 20px;
    }
  }
  .content {
    margin-top: 20px;
  }
}

/deep/ img {
  width: 100%;
}

video {
  width: 100%;
  margin-top: 10px;
}

// 点赞
.bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  .like {
    height: 30px;
    width: 80px;
    border: 1px solid #000;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    i {
      margin: 0 5px;
    }
  }
  .like.active {
    border: 1px solid #f00;
    i {
      color: red;
    }
  }
}
// 评论部分
.comments {
  border-top: 3px solid #ccc;
  padding-bottom: 40px;
}

// 底部
.footer {
  background: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  .input {
    height: 40px;
    display: flex;
    .left {
      flex: 1;
      // background: red;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        height: 30px;
        width: 80%;
        border: none;
        border-radius: 15px;
        background: #ddd;
        text-indent: 1em;
      }
    }
    .center,
    .right {
      width: 60px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .active {
      color: #f00;
      font-weight: 700;
    }
  }
  .textarea {
    height: 70px;
    display: flex;
    .left {
      flex: 1;
      // background: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        border-radius: 8px;
        resize: none;
        background: #ddd;
        text-indent: 1em;
        padding-top: 5px;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .send {
        background: #f00;
        color: #fff;
        width: 40px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>