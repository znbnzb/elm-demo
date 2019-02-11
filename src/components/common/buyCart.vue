<template>
  <section class="cart_module">

    <section
      v-if="true"
      class="cart_button"
    >

      <!-- 减号 -->
      <transition name="showReduce">
        <span
          @click="removeOutCart(foods.category_id,foods.item_id,foods.specfoods[0].food_id,foods.specfoods[0].name,foods.specfoods[0].price,'',foods.specfoods[0].packing_fee,foods.specfoods[0].sku_id,foods.specfoods[0].stock)"
          v-if="foodNum"
        >
          <svg>
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#cart-minus"
            ></use>
          </svg>
        </span>
      </transition>

      <!-- 数量 -->
      <transition name="fade">
        <span
          class="cart_num"
          v-if="foodNum"
        >{{foodNum}}</span>
      </transition>

      <!-- 加号 -->
      <svg
        class="add_icon"
        @click="addToCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock, $event)"
      >
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#cart-add"
        ></use>
      </svg>

    </section>

    <!-- 选规格的减号、数量、按钮 -->
    <section
      v-else
      class="choose_specification"
    >
      <section class="choose_icon_container">
        <!-- 减号 -->
        <transition name="showReaduce">
          <svg
            class="specs_reduce_icon"
            v-if="foodNum"
            @click="showReduceTip"
          >
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#cart-minus"
            ></use>
          </svg>
        </transition>

        <!-- 数量 -->
        <transition name="fade">
          <span
            class="cart_num"
            v-if="foodNum"
          >{{foodNum}}</span>
        </transition>
        <!-- 选规格按钮 -->
        <span
          class="show_chooselist"
          @click="showChooseList(foods)"
        >选规格</span>
      </section>

    </section>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      showMoveDot: [] //控制下落的小圆点显示还是隐藏
    };
  },
  mounted() {},
  computed: {
    ...mapState(["cartList"]),
    /**
     * 监听cartList变化，更新当前商品购物车的购物信息shopCart，同时返回一个新的对象
     * Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。
     * 它将返回目标对象。
     */
    shopCart: function() {
      return object.assign({}, this.cartList[this.shopId]);
    },
    //shopCart变化的时候重新计算当前商品数量
    foodNum: function() {
      let category_id = this.foods.category_id;
      let item_id = this.foods.item_id;
      if (
        this.shopCart &&
        this.shopCart[category_id] &&
        this.shopCart[category_id][item_id]
      ) {
        let num = 0;
        Object.values(this.shopCart[category_id][item_id]).forEach(
          (item, index) => {
            num += item.num;
          }
        );
        return num;
      } else {
        return 0;
      }
    }
  },
  props: ["foods", "shopId"],
  methods: {
    ...mapMutations(["ADD_CART", "REDUCE_CART"]),
    //移出购物车
    removeOutCart(
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock
    ) {
      if (this.foodNum > 0) {
        this.REDUCE_CART({
          shopId: this.shopId,
          category_id,
          item_id,
          food_id,
          name,
          price,
          specs,
          packing_fee,
          sku_id,
          stock
        });
      }
    },
    //加入购物车，计算按钮位置。
    addToCart(
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock,
      event
    ) {
      this.ADD_CART({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        pirce,
        specs,
        packing_fee,
        sku_id,
        stock
      });
      let elLeft = event.target.getBoundingClientRect().left;
      let eBottom = event.target.getBoundingClientRect().bottom;
      this.showMoveDot.push(true);
      this.$emit("showMoveDot", this.showMoveDot, eLift, eBottom);
    },
    //显示规格列表
    showChooseList(foodScroll) {
      this.$emit("showChooseList", foodScroll);
    },
    //点击多规格商品的减按钮，弹出提示
    showReduceTip() {
      this.$emit("showReduceTip");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.cart_module {
  .add_icon {
    position: relative;
    z-index: 999;
  }
  .cart_button {
    display: flex;
    align-items: center;
  }
  svg {
    @include wh(0.9rem, 0.9rem);
    fill: #3190e8;
  }
  .specs_reduce_icon {
    fill: #999;
  }
  .cart_num {
    @include sc(0.65rem, #666);
    min-width: 1rem;
    text-align: center;
    font-family: Helvetica Neue, Tahoma;
  }
  .choose_specification {
    .choose_icon_container {
      display: flex;
      align-items: center;
      .show_chooselist {
        display: block;
        @include sc(0.55rem, #fff);
        padding: 0.1rem 0.2rem;
        background-color: $blue;
        border-radius: 0.2rem;
        border: 1px solid $blue;
      }
    }
  }
}
.showReduce-enter-active,
.showReduce-leave-active {
  transition: all 0.3s ease-out;
}
.showReduce-enter,
.showReduce-leave-active {
  opacity: 0;
  transform: translateX(1rem);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fadeBounce-enter-active,
.fadeBounce-leave-active {
  transition: all 0.3s;
}
.fadeBounce-enter,
.fadeBounce-leave-active {
  opacity: 0;
  transform: scale(0.7);
}
</style>