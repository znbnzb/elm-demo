<template>
    <div>
        <p>呆呆{{guessCity}}</p>
    </div>
</template>

<script>
import { cityGuess } from "../../service/getDate";
export default {
  data() {
    return {
      guessCity: ""
    };
  },
  mounted() {
    //获取当前城市
    cityGuess().then(res => {
      this.guessCity = res.name;
      console.log(this.guessCity);
    });
  }
};
</script>

<style scoped>
</style>