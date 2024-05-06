<template>
  <!--园区概括-->
  <CustomCard :module-name="showProperty.moduleName">
    <div class="generalize-info">
      <ul v-if="showProperty.showItems" :class="showProperty.showItems.length > 4 ? 'three' : 'two'">
        <li v-for="(item, index) in showProperty.showItems" :key="index">
          <div class="person" v-if="item.value == 'personIn'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/person.png" class="person2" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.personInCount ? parkDetail.personInCount : 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'cameraNum'">
            <div class="person-img">
              <!-- <img src="../../assets/bigScreen/text.png" alt="" /> -->
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/control-detail.png" class="detail" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.cameraCount || 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'carIn'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/car.png" class="person2" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.vehicleInCount || 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'carRecNum'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/car.png" class="person2" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.vehicleReconCount || 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'carOut'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/carOut.png" class="car2" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.vehicleOutCount || 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'warnNum'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/alarmNew.png" class="alarm" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.alarmCount || 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'faceRecNum'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/personOut.png" class="car2" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.personReconCount ? parkDetail.personReconCount : 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
          <div class="person" v-if="item.value == 'taskNum'">
            <div class="person-img">
              <img src="../../assets/homePage/quan.png" class="quan" />
              <img src="../../assets/homePage/personOut.png" class="car2" />
            </div>
            <div class="person-info flex-column">
              <div class="park">
                {{ parkDetail.monitorCount ? parkDetail.monitorCount : 0 }}
              </div>
              <div class="gen-text">{{ isZh ? item.label : item.labelEn }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </CustomCard>
</template>

<script>
import { getControlNum } from '@/utils/api'
import CustomCard from './components/custom-card'
export default {
  props: ['showProperty'],
  components: {
    CustomCard,
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  data() {
    return {
      //园区概括
      parkDetail: {
        num: '', //人员进入数量
        outNum: '', //人员外出数量
        getControlNum: '', //布控数量

        warnNum: '', //告警数量
        carNum: '', //车辆进入数量
        outCarNum: '', //车辆外出数量
      },
      timer: null,
    }
  },
  created() {
    this.handleSetTimeOut(60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleSetTimeOut(time) {
      this.fetchgetControlNum()
      this.timer = setInterval(() => {
        this.fetchgetControlNum()
      }, time)
    },
    //布控数量
    fetchgetControlNum() {
      getControlNum({ passRecord: true }).then((res) => {
        if (res.resultCode === 0) {
          this.parkDetail = { ...res }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotateZ(0deg); /*从0度开始*/
  }
  100% {
    transform: rotateZ(360deg); /*360度结束*/
  }
}
.flex-column {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.generalize-info {
  width: 100%;
  height: 218px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;

  ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .three {
    li {
      width: 33.33%;
      min-height: 60px;
      max-height: 70px;
      z-index: 99;
      margin-top: 10px;
      border-radius: 8px;

      .person {
        width: 100%;
        min-height: 60px;
        max-height: 70px;
        display: flex;
        align-items: center;
        overflow: hidden;
      }

      .person-img {
        width: 50px;
        height: 44px;
        position: relative;

        .quan {
          width: 48px;
          height: 45px;
          display: block;
          animation: rotate 6s linear infinite;
        }

        .detail {
          position: absolute;
          left: 6px;
          top: 4px;
          width: 40px;
          height: 35px;
        }

        .person2 {
          position: absolute;
          left: 6px;
          top: 6px;
          width: 36px;
          height: 30px;
        }

        .car2 {
          position: absolute;
          left: 8px;
          top: 8px;
          width: 30px;
          height: 30px;
        }

        .alarm {
          position: absolute;
          left: 8px;
          top: 8px;
          width: 30px;
          height: 30px;
        }
      }

      .person-info {
        height: 70px;
        margin-left: 8px;

        .park {
          height: 30px;
          font-size: 22px;
          color: #1fbaf2;

          span {
            font-size: 12px;
            color: #cccccc;
          }
        }
      }

      .park {
        margin-top: 10px;
        font-weight: bold;
      }
    }
  }
  .two {
    li {
      width: 50%;
      min-height: 60px;
      max-height: 70px;
      z-index: 99;
      margin-top: 10px;
      border-radius: 8px;

      .person {
        width: 100%;
        min-height: 60px;
        max-height: 70px;
        display: flex;
        overflow: hidden;
      }

      .person-img {
        width: 74px;
        height: 70px;
        position: relative;

        .quan {
          width: 74px;
          height: 69px;
          display: block;
          animation: rotate 6s linear infinite;
        }

        .detail {
          position: absolute;
          left: 8px;
          top: 6px;
          width: 56px;
          height: 56px;
        }

        .person2 {
          position: absolute;
          left: 12px;
          top: 12px;
          width: 50px;
          height: 37px;
        }

        .car2 {
          position: absolute;
          left: 8px;
          top: 6px;
          width: 56px;
          height: 56px;
        }

        .alarm {
          position: absolute;
          left: 8px;
          top: 6px;
          width: 56px;
          height: 56px;
        }
      }

      .person-info {
        height: 70px;
        margin-left: 8px;

        .park {
          height: 30px;
          font-size: 24px;
          color: #1fbaf2;

          span {
            font-size: 12px;
            color: #cccccc;
          }
        }
      }

      .park {
        margin-top: 10px;
        font-weight: bold;
      }
    }
  }
}

.gen-text {
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
