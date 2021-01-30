<template>
  <div class="monitor-wrapper">
    <div class="layout-charts">
      <div class="layout-charts-cpu">
        <el-card class="box-card"
                 shadow="always">
          <div slot="header"
               class="card-header">
            <p>CPU</p>
            <el-tooltip :content="'核心数：' + param.logicalProcessorOfCPU + '核'"
                        placement="top">
              <div class="processorOfCPU">
                <div v-for="i of param.logicalProcessorOfCPU"
                     :key="i">
                  <svg t="1611982526086"
                       class="icon"
                       viewBox="0 0 1031 1024"
                       version="1.1"
                       xmlns="http://www.w3.org/2000/svg"
                       p-id="2024"
                       width="16"
                       height="16">
                    <path d="M1026.935541 342.815803v-57.79111h-125.925907V125.547941H741.558079V3.250514h-57.791109v122.297427H541.840471V3.250514h-57.274554v122.297427H342.689814V3.250514h-57.828906v122.297427H125.396754v159.464153H0v57.803709h125.913309v141.913899H0V542.483015h125.913309v141.951696H0v57.803708h125.913309v159.464154h159.464153v122.297427h57.79111v-122.297427H485.057273v122.297427h57.828906v-122.297427h141.9139v122.297427h57.791109v-122.297427H902.080539V742.238419h125.913309v-57.791109H902.080539V542.483015h125.913309v-57.753313H902.080539V342.815803h124.855002zM843.735079 843.407508H183.187864v-660.055859h660.547215v660.055859z m-145.013227-515.017435H328.20109v370.520763h370.520762V328.390073z"
                          fill="#1296db"
                          p-id="2025"></path>
                  </svg>
                </div>
              </div>
            </el-tooltip>
          </div>
          <div class="card-content-wrapper">

            <div class="charts-card-wrapper"
                 v-loading="loading">
              <div ref="utilizationRateOfCPUSystemEcharts"></div>
              <div ref="utilizationRateOfCPUUserEcharts"></div>
              <div ref="currentWaitingRateOfCPUEcharts"></div>
              <div ref="currentIdleRateOfCPUEcharts"></div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="layout-charts-memory">
        <el-card class="box-card"
                 shadow="always"
                 header="内存">
          <div class="card-content-wrapper"
               v-loading="loading">
            <div ref="memoryPie"></div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="layout-server">
      <el-card class="box-card"
               shadow="always"
               header="服务器信息">
        <el-form label-width="100px"
                 v-loading="loading">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="操作系统">
                {{param.osName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统版本">
                {{param.osVersion}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务器名称">
                {{param.hostName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务器ip">
                {{param.serverIp}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户">
                {{param.userName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="家目录">
                {{param.userHome}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div class="layout-java">
      <el-card class="box-card"
               shadow="always"
               header="Java虚拟机">
        <el-form label-width="100px"
                 v-loading="loading">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="JVM">
                {{param.jvmName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Java版本">
                {{param.javaVersion}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启动时间">
                {{param.jvmStartTime}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Java路径">
                {{param.javaHome}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目路径">
                {{param.projectDir}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总线程数">
                {{param.totalThread}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div class="layout-disk">
      <el-card class="box-card"
               shadow="always"
               header="磁盘信息">
        <el-table :data="param.diskParamList"
                  style="width: 100%"
                  v-loading="loading">
          <el-table-column prop="path"
                           label="路径"
                           width="180">
          </el-table-column>
          <el-table-column prop="un"
                           label="可用"
                           width="180">
          </el-table-column>
          <el-table-column prop="free"
                           label="空闲">
          </el-table-column>
          <el-table-column prop="total"
                           label="总量">
          </el-table-column>
          <el-table-column prop="rate"
                           label="可用百分比">
            <template slot-scope="scope">
              {{((parseFloat(scope.row.un.replace('G', '')) / parseFloat(scope.row.total.replace('G', ''))) * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      colorList: ['#73DDFF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF'],
      param: {
        // 磁盘信息
        diskParamList: [],
        // 操作系统
        osName: '',
        // 服务器版本
        osVersion: '',
        // 服务器ip
        serverIp: '',
        // 服务器名称
        hostName: '',
        // 程序启动时间
        jvmStartTime: '',
        // pid
        pid: '',
        // cpu核数
        processors: '',
        // javaHome
        javaHome: '',
        // javaVersion
        javaVersion: '',
        // jvm
        jvmName: '',
        // userHome
        userHome: '',
        // userName
        userName: '',
        // 项目部署路径
        projectDir: '',
        // 初始的总内存(JVM)
        initialMemorySize: '',
        // 最大可用内存(JVM)
        maxMemorySize: '',
        // 已使用的内存(JVM)
        usedMemorySize: '',
        // 总的物理内存
        totalMemorySize: '',
        // 剩余的物理内存
        freePhysicalMemorySize: '',
        // 已使用的物理内存
        usedPhysicalMemorySize: '',
        // 总线程数
        totalThread: '',
        // cpu核数
        logicalProcessorOfCPU: '',
        // cpu系统使用率
        utilizationRateOfCPUSystem: '',
        // cpu用户使用率
        utilizationRateOfCPUUser: '',
        // cpu当前等待率
        currentWaitingRateOfCPU: '',
        // cpu当前空闲率
        currentIdleRateOfCPU: ''
      },
      timer: ''
    }
  },
  mounted () {
    this.loading = true
    this.scheduleMain()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    scheduleMain () {
      var that = this
      that.getSysInfo()
      that.timer = setInterval(function () {
        that.getSysInfo()
      }, 5000)
    },
    getSysInfo () {
      this.$http.get('/sys/info/get').then(({ data }) => {
        this.param = this.$util.recover(this.param, data.data)
        this.loading = false
        this.$nextTick(() => {
          this.drawCPU('系统使用率', this.param.utilizationRateOfCPUSystem, this.$refs.utilizationRateOfCPUSystemEcharts)
          this.drawCPU('用户使用率', this.param.utilizationRateOfCPUUser, this.$refs.utilizationRateOfCPUUserEcharts)
          this.drawCPU('当前等待率', this.param.currentWaitingRateOfCPU, this.$refs.currentWaitingRateOfCPUEcharts)
          this.drawCPU('当前空闲率', this.param.currentIdleRateOfCPU, this.$refs.currentIdleRateOfCPUEcharts)
          this.drawMemory()
        })

      })
    },
    drawCPU (text, value, ref) {
      // var value = 0.2;
      var data = [value, value, value];
      var option = {
        backgroundColor: new this.$echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
          offset: 0,
          color: '#431ab8'
        }, {
          offset: 1,
          color: '#471bba'
        }]),
        title: {
          text: (value * 100).toFixed(0) + '{a|%}',
          textStyle: {
            fontSize: 16,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: 'white',
            rich: {
              a: {
                fontSize: 16,
              }
            }
          },
          x: 'center',
          y: '35%'
        },
        graphic: [{
          type: 'group',
          left: 'center',
          top: '60%',
          children: [{
            type: 'text',
            z: 100,
            left: '10',
            top: 'middle',
            style: {
              fill: 'white',
              text: text,
              font: '16px Microsoft YaHei'
            }
          }]
        }],
        series: [{
          type: 'liquidFill',
          radius: '80%',
          center: ['50%', '50%'],
          //  shape: 'roundRect',
          data: data,
          backgroundStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0.5,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(68, 145, 253, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(68, 145, 253, .25)'
              }, {
                offset: 0,
                color: 'rgba(68, 145, 253, 1)'
              }],
              globalCoord: false
            },
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 20,
              borderColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(69, 73, 240, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(69, 73, 240, .25)'
                }, {
                  offset: 1,
                  color: 'rgba(69, 73, 240, 1)'
                }],
                globalCoord: false
              },
              shadowBlur: 10,
              shadowColor: '#000',
            }
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(58, 71, 212, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(31, 222, 225, .2)'
              }, {
                offset: 0,
                color: 'rgba(31, 222, 225, 1)'
              }],
              globalCoord: false
            }
          },
          label: {
            normal: {
              formatter: '',
            }
          }
        },]
      };
      this.$echarts.init(ref).setOption(option)
    },
    drawMemory () {
      var that = this
      var totalMemorySize = parseFloat(that.param.totalMemorySize.replace('G', ''))
      var dataArr = parseFloat((parseFloat(that.param.usedPhysicalMemorySize.replace('G', '')) / totalMemorySize).toFixed(2)) * 100;
      var colorSet = {
        color: '#468EFD'
      };
      var option = {
        backgroundColor: '#0E1327',
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [{
          name: "内存使用情况",
          type: "gauge",
          // center: ['20%', '50%'],
          radius: '60%',

          splitNumber: 10,
          axisLine: {
            lineStyle: {
              color: [
                [0.7, colorSet.color],
                [0.8, '#FFCC66'],
                [0.9, '#FF6633'],
                [1, "#FF3300"]
              ],
              width: 8
            }
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,

          },
          splitLine: {
            show: false,
          },
          itemStyle: {
            show: false,
          },
          detail: {
            formatter: function (value) {
              if (value !== 0) {
                var num = Math.round(value);
                return parseInt(num).toFixed(0) + "%";
              } else {
                return 0;
              }
            },
            offsetCenter: [0, 82],
            textStyle: {
              padding: [0, 0, 0, 0],
              fontSize: 18,
              fontWeight: '700',
              color: colorSet.color
            }
          },
          title: { //标题
            show: true,
            offsetCenter: [0, 46], // x, y，单位px
            textStyle: {
              color: "#fff",
              fontSize: 14, //表盘上的标题文字大小
              fontWeight: 400,
              fontFamily: 'PingFangSC'
            }
          },
          data: [{
            name: "内存使用",
            value: dataArr,
          }],
          pointer: {
            show: true,
            length: '75%',
            radius: '20%',
            width: 10, //指针粗细
          },
          animationDuration: 4000,
          tooltip: {
            trigger: 'item',
            formatter: (p) => {
              return `已使用：${that.param.usedPhysicalMemorySize}`
            }
          }
        },
        {
          name: '外部刻度',
          type: 'gauge',
          //  center: ['20%', '50%'],
          radius: '80%',
          min: 0, //最小刻度
          max: 100, //最大刻度
          splitNumber: 10, //刻度数量
          startAngle: 225,
          endAngle: -45,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: [
                [1, 'rgba(0,0,0,0)']
              ]
            }
          }, //仪表盘轴线
          axisLabel: {
            show: true,
            color: '#4d5bd1',
            distance: 20,
            formatter: function (v) {
              switch (v) {
                case 0:
                  return 0;
                case 10:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 20:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 30:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 40:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 50:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 60:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 70:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 80:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 90:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
                case 100:
                  return (totalMemorySize / 10 * (v / 10)).toFixed(2) + 'G';
              }
            }
          }, //刻度标签。
          axisTick: {
            show: true,
            splitNumber: 7,
            lineStyle: {
              color: colorSet.color, //用颜色渐变函数不起作用
              width: 1,
            },
            length: -8
          }, //刻度样式
          splitLine: {
            show: true,
            length: -20,
            lineStyle: {
              color: colorSet.color, //用颜色渐变函数不起作用
            }
          }, //分隔线样式
          detail: {
            show: false
          },
          pointer: {
            show: false
          }
        },
        ]
      }
      this.$echarts.init(this.$refs.memoryPie).setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-wrapper {
  > div {
    padding: 10px 20px;
  }
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
  ::v-deep .el-form-item__content {
    text-align: center;
  }
  .layout-charts {
    height: 300px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .layout-charts-cpu {
      .processorOfCPU {
        display: flex;
        flex-direction: row;
        align-items: center;
        > div {
          &:first-child {
            margin-left: 0;
          }
          margin: 0 10px;
        }
      }
      .charts-card-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        > div {
          width: 50%;
          height: 50%;
        }
        .left {
          width: 60%;
        }
        .right {
          width: 40%;
        }
      }
    }
    .layout-charts-memory {
      .card-content-wrapper {
        > div {
          width: 100%;
          height: 100%;
        }
      }
    }
    .el-card {
      height: 100%;
      ::v-deep .el-card__header {
        height: 20%;
        padding: 0 20px;
        display: flex;
        align-items: center;
        .card-header {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            margin: 0;
          }
        }
      }
      ::v-deep .el-card__body {
        height: 80%;
        padding: 0;
        .card-content-wrapper {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
      }
    }
    > div {
      width: 49%;
    }
  }
}
</style>