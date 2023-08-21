<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- echarts 展示图形图标的节点 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
// echarts 的拓展包
import 'echarts-liquidfill'
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

let people = ref('215908人')
let charts = ref()

onMounted(() => {
  //获取 echarts 类的实例
  let myCharts = echarts.init(charts.value)
  //设置实例的配置项
  myCharts.setOption({
    //标题组件
    title: {
      text: '水球图',
    },
    //x|y轴组件
    xAxis: {},
    yAxis: {},
    //系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill', //系列
      data: [0.7, 0.7, 0.4, 0.2, 0.1], //展示的数据
      waveAnimation: true, //动画
      animationDuration: 1,
      animationDurationUpdate: 0,
      radius: '80%', //半径
      outline: {
        //外层边框颜色设置
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'skyblue',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
    //布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;
    margin-top: 10px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 20px;
      margin-right: 20px;

      span {
        color: yellowgreen;
      }
    }
  }

  .number {
    padding: 10px;
    margin-top: 40px;
    display: flex;
    justify-content: space-evenly;

    span {
      height: 40px;
      width: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      font-size: 30px;
      font-weight: bold;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 230px;
  }
}
</style>
