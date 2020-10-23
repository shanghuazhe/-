<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center" @click="$router.push('/search')">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
    <!-- 小三角 -->
    <van-sticky>
      <div class="container" @click="$router.push('/tabsedit')">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </van-sticky>
    <!-- tab栏 -->
    <van-tabs v-model="active" sticky>
      <van-tab :title="post.name" v-for="post in tabList" :key="post.id">
        <van-pull-refresh @refresh="onRefresh" v-model="isRefresh">
          <!-- 分页 -->
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="我也是有底线的"
            @load="onLoad"
            :immediate-check="false"
          >
            <hm-post
              @click.native="$router.push(`/detail/${post.id}`)"
              v-for=" (post,index) in postList"
              :key="index"
              :post="post"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  //将name组件缓存起来
  name: "home",
  data() {
    return {
      active: 1,
      tabList: [], //tab栏数据
      postList: [], //文章列表
      loading: false, //是否在加载动态中 (上一次)
      finished: false, //是否全部加载完成
      pageIndex: 1,
      pageSize: 5,
      isRefresh: false //是否正在下拉刷新中
    };
  },
  //监听 active 的变化
  watch: {
    active(newActive) {
      this.postList = [];
      this.pageIndex = 1;
      //2. 处理加载的
      this.finished = false;
      this.loading = true;
      this.getPostList(this.tabList[newActive].id);
    }
  },
  created() {
    this.getTabList();
  },
  activated() {
    // 从本地 获取
    const activeTabs = JSON.parse(localStorage.getItem("activeTabs"));
    if (activeTabs) {
      this.tabList = activeTabs;
      this.active = 1; //回到默认是最合适的
      this.getPostList(this.tabList[this.active].id);
      return;
    }
  },
  methods: {
    //获取 tab 栏位数据
    async getTabList() {
      // 从 本地获取
      let activeTabs = JSON.parse(localStorage.getItem("activeTabs"));
      if (activeTabs) {
        this.tabsList = activeTabs;
        this.getPostList(this.tabsList[this.active].id);
        return;
      }

      const res = await this.$axios.get("/category");
      this.tabList = res.data.data;

      //请求完tabList  => 才有tab 和 id
      this.getPostList(this.tabList[this.active].id);
    },
    //获取 文章列表
    async getPostList(id) {
      const res = await this.$axios.get("/post", {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      });
      if (this.postList.length > 0 && this.pageIndex === 1) {
        this.postList = [];
      }
      //拼接
      this.postList = [...this.postList, ...res.data.data];
      this.loading = false;
      //请求完成时 改为false
      this.isRefresh = false;
      if (res.data.data.length < this.pageSize) {
        this.finished = true;
      }
    },
    //触底加载
    onLoad() {
      console.log("触底");
      this.pageIndex++;
      this.getPostList(this.tabList[this.active].id);
    },
    onRefresh() {
      console.log("下拉刷新");
      //默认 isRefreshing : true

      //处理之前的数据
      this.postList = [];
      this.pageIndex = 1;

      //底部文字问题
      this.finished = false;
      this.loading = true;

      //重新加载
      this.getPostList(this.tabList[this.active].id);
    }
  }
};
</script>

<style lang="less" scoped>
//   加/deep/ 添加 scoped 之后, 组件的`根节点`添加了 `data-v-xxx`,  但是子节点没有添加 所以不会起到效果
/deep/ .van-tabs__nav {
  background: pink;
  margin-right: 40px;
}
//小三角
.container {
  width: 41.5px;
  height: 44px;
  background: pink;
  line-height: 44px;
  text-align: center;
  color: #000;
  font-weight: 700;
  position: absolute;
  right: 0;
  z-index: 999;
  .iconjiantou1 {
    z-index: 999;
  }
}
.header {
  height: 40px;
  background: #f00;
  display: flex;
  text-align: center;
  color: #fff;
  align-items: center;
  .left,
  .right {
    width: 60px;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 26px;
  }
  .iconsearch {
    margin-right: 10px;
  }
  .center {
    flex: 1;
    background: rgba(255, 255, 255, 0.5);
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
  }
}
</style>