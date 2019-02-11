<template>
  <div>
    <!-- 头部标题 -->
    <head-top signin-up='msite'>
      <!-- 图标 -->
      <router-link :to="'/search/geohash'" class="link_search" slot="search">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none" />
          <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2" />
        </svg>
      </router-link>
      <!-- 标题 -->
      <router-link to="/home" slot="msite-title" class="msite_title">
        <span class="title_text ellipsis">{{msiteTitle}}</span>
      </router-link>
    </head-top>

    <!-- 食品分类导航 -->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="foodTypes.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide food_types_container" v-for="(item,index) in foodTypes" :key="index">
            <router-link :to="{path:'/food',query:{geohash,title:foodItem.title,restaurant_category_id:getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url" alt="">
                <figcaption>{{foodItem.title}}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <!-- 组件没有出来前显示 -->
      <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else>
    </nav>
    <!-- 附近商家 -->
    <div class="shop_list_container">
      <header class="shop_header">
        <svg class="shop_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
        </svg>
        <span class="shop_header_title">附近商家</span>
      </header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import headTop from "../../components/header/head"; //头部组件
import footGuide from "../../components/footer/footerGuide"; // 底部组件
import shopList from "../../components/common/shoplist"; //商铺组件
import { msiteAddress, msiteFoodTypes, cityGuess } from "../../service/getDate";
import Swiper from "swiper";
import "../../style/swiper.min.css";
export default {
  data() {
    return {
      geohash: "", //city页面传递过来的地址geohash
      msiteTitle: "请选择地址...", //msite页面头部标题
      foodTypes: [], //食品分类，是一个空的数组
      hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
      imgBaseUrl: "https://fuss10.elemecdn.com" //图片域名地址
    };
  },
  //beforeMount 挂载到dom前
  async beforeMount() {
    if (!this.$route.query.geohash) {
      const address = await cityGusee(); //如果geohash请求不成功，将请求默认城市首页
      this.geohash = address.latitude + "," + address.longitude; //获取默认城市首页的经度和纬度
    } else {
      this.geohash = this.$route.query.geohash; //将请求下来的位置信息进行赋值
    }
    //保存geohash到Vuex ,与...mapMutations映射
    this.SAVE_GEOHASH(this.geohash);
    //获取地理位置
    let res = await msiteAddress(this.geohash); //将获取到的经纬度信息传给msiteAddress方法,得出具体的地址
    this.msiteTitle = res.name; //取具体的地址名称
    //记录当前经纬度
    this.RECORD_ADDRESS(res);
    //这个时候已经获取地理位置数据，将hasGetData 赋值为true,获取商铺列表信息
    this.hasGetData = true;
  },

  mounted() {
    //获取导航食品列表
    msiteFoodTypes(this.geohash)
      .then(res => {
        // console.log(res);
        //   console.log("导航食品长度=" + res.length);
        let resLength = res.length; //导航食品的长度
        let resArr = [...res]; //返回一个新的数组
        // console.log(resArr);
        let foodArr = [];
        for (let i = 0, j = 0; i < resLength; i += 8, j++) {
          foodArr[j] = resArr.splice(0, 8);
        }
        this.foodTypes = foodArr;
      })
      .then(() => {
        //初始化swiper
        new Swiper(".swiper-container", {
          pagination: ".swiper-pagination",
          loop: true
        });
      });
  },
  components: {
    headTop,
    shopList,
    footGuide
  },
  methods: {
    ...mapMutations(["RECORD_ADDRESS", "SAVE_GEOHASH"]),
    // 解码url地址，求去restaurant_category_id值
    getCategoryId(url) {
      let urlData = decodeURIComponent(
        url.split("=")[1].replace("&target_name", "")
      );
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
// 左侧搜索图标
.link_search {
  left: 0.8rem;
  @include wh(0.9rem, 0.9rem);
  @include ct; //定位垂直上下居中
}
// 中间标题
.msite_title {
  @include center;
  width: 50%;
  color: #fff;
  text-align: center;
  margin-left: -0.5rem;
  .title_text {
    @include sc(0.8rem, #fff);
    text-align: center;
    display: block;
  }
}

// 食品导航分类
.msite_nav {
  padding-top: 2.1rem;
  background-color: #fff;
  border-bottom: 0.025rem solid $bc;
  height: 10.6rem;
  .swiper-container {
    @include wh(100%, auto);
    padding-bottom: 0.6rem;
    .swiper-pagination {
      bottom: 0.2rem;
    }
  }
  .fl_back {
    @include wh(100%, 100%);
  }
}
.food_types_container {
  display: flex;
  flex-wrap: wrap;
  .link_to_food {
    width: 25%;
    padding: 0.3rem 0rem;
    @include fj(center);
    figure {
      img {
        margin-bottom: 0.3rem;
        @include wh(1.8rem, 1.8rem);
      }
      figcaption {
        text-align: center;
        @include sc(0.55rem, #666);
      }
    }
  }
}
// 附近商家
.shop_list_container {
  margin-top: 0.4rem;
  border-top: 0.025rem solid $bc;
  background-color: #fff;
  .shop_header {
    .shop_icon {
      fill: #999;
      margin-left: 0.6rem;
      vertical-align: middle;
      @include wh(0.6rem, 0.6rem);
    }
    .shop_header_title {
      color: #999;
      @include font(0.55rem, 1.6rem);
    }
  }
}
</style>