<template>
    <div>
        <shoplist></shoplist>
        <!-- 底部组件 -->
        <footGuide></footGuide>
    </div>
</template>

<script>
// 底部组件
import footGuide from "../../components/footer/footerGuide";
import shoplist from "../../components/common/shoplist";
export default {
  components: {
    footGuide,
    shoplist
  }
};
</script>

<style scoped>
</style>