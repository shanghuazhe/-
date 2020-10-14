<template>
  <div class="hm-header">
    <div class="left"><i class="iconfont iconjiantou2"></i></div>
    <div class="center"><slot></slot></div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.hm-header {
  height: 40px;
  border: 1px solid #ccc;
  background-color: #f4f4f4;

  display: flex;
  text-align: center;
  align-items: center;

  .left,
  .right {
    width: 30px;
  }
  .center {
    flex: 1;
    font-weight: 700;
    font-size: 20px;
  }
}
</style>
