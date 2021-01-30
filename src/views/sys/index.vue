<template>
  <div class="index-wrapper">
    <div class="layout-content">
      <div class="logo">
        <img class="animated slideInLeft"
             src="/image/logo-large.png">
      </div>
      <div class="description">
        <p>YULI CLOUD 1.0.0</p>
        <p>快速开发平台，帮助业务快速成型</p>
        <p>开发文档：<a target="_blank"
             href="http://docs.javayuli.cn">http://docs.javayuli.cn</a></p>
        <div class="badges">
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud/issues"><img alt="GitHub issues"
                 src="https://img.shields.io/github/issues/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud/network"><img alt="GitHub forks"
                 src="https://img.shields.io/github/forks/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud/stargazers"><img alt="GitHub stars"
                 src="https://img.shields.io/github/stars/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud"><img alt="GitHub license"
                 src="https://img.shields.io/github/license/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud/issues-pr"><img alt="GitHub issues"
                 src="https://img.shields.io/github/issues-pr/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud/issues-pr-closed"><img alt="GitHub issues"
                 src="https://img.shields.io/github/issues-pr-closed/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud"><img alt="GitHub issues"
                 src="https://img.shields.io/github/last-commit/hanguilin/yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud"><img alt="GitHub issues"
                 src="https://visitor-badge.glitch.me/badge?page_id=hanguilin.yuli-cloud"></a>
          <a target="_blank"
             href="https://github.com/hanguilin/yuli-cloud/releases"><img src="https://img.shields.io/github/release/hanguilin/yuli-cloud"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.index-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .layout-content {
    height: 60%;
    width: 60%;
    .logo {
      display: flex;
      justify-content: center;
    }
    .description {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      > p {
        &:first-child {
          font-weight: bold;
          margin: 15px 0;
        }
        margin: 5px 0;
      }
      .badges {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 10px 0;
        > a {
          margin: 5px;
        }
      }
    }
  }
}
</style>