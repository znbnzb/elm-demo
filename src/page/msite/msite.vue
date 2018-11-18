<template>
  <div>
    <shoplist></shoplist>
    <!-- 底部组件 -->
    <footGuide></footGuide>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import headTop from "../../components/header/head"; //头部组件
import footGuide from "../../components/footer/footerGuide"; // 底部组件
import shoplist from "../../components/common/shoplist"; //商铺组件
import { msiteAddress, msiteFoodTypes, cityGuess } from "../../service/getDate";
// import "../../plugins/swiper.min.js";
// import "../../style/swiper.min";

export default {
  components: {
    footGuide,
    shoplist
  }
};
</script>

<style scoped>
</style>