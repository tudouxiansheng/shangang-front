export default function () {
  const devTypeIcons = {
    yuntai1: require('@/assets/img/amap/yuntai1.png'),
    yuntai2: require('@/assets/img/amap/yuntai2.png'),
    yuntai3: require('@/assets/img/amap/yuntai3.png'),
    yuntai4: require('@/assets/img/amap/yuntai4.png'),
    yuntai5: require('@/assets/img/amap/yuntai5.gif'),

    bolt1: require('@/assets/img/amap/bolt1.png'),
    bolt2: require('@/assets/img/amap/bolt2.png'),
    bolt3: require('@/assets/img/amap/bolt3.png'),
    bolt4: require('@/assets/img/amap/bolt4.png'),
    bolt5: require('@/assets/img/amap/bolt5.gif'),

    ballhead1: require('@/assets/img/amap/ballhead1.png'),
    ballhead2: require('@/assets/img/amap/ballhead2.png'),
    ballhead3: require('@/assets/img/amap/ballhead3.png'),
    ballhead4: require('@/assets/img/amap/ballhead4.png'),
    ballhead5: require('@/assets/img/amap/ballhead5.gif'),

    hemisphere1: require('@/assets/img/amap/hemisphere1.png'),
    hemisphere2: require('@/assets/img/amap/hemisphere2.png'),
    hemisphere3: require('@/assets/img/amap/hemisphere3.png'),
    hemisphere4: require('@/assets/img/amap/hemisphere4.png'),
    hemisphere5: require('@/assets/img/amap/hemisphere5.gif'),

    softMan1: require('@/assets/img/amap/softMan1.png'),
    softMan2: require('@/assets/img/amap/softMan2.png'),
    softMan3: require('@/assets/img/amap/softMan3.png'),
    softMan4: require('@/assets/img/amap/softMan4.png'),
    softMan5: require('@/assets/img/amap/softMan5.gif'),

    bayonet1: require('@/assets/img/amap/bayonet1.png'),
    bayonet2: require('@/assets/img/amap/bayonet2.png'),
    bayonet3: require('@/assets/img/amap/bayonet3.png'),
    bayonet4: require('@/assets/img/amap/bayonet4.png'),
    bayonet5: require('@/assets/img/amap/bayonet5.gif'),

    car1: require('@/assets/img/amap/car1.png'),
    car2: require('@/assets/img/amap/car2.png'),
    car3: require('@/assets/img/amap/car3.png'),
    car4: require('@/assets/img/amap/car4.png'),
    car5: require('@/assets/img/amap/car5.gif'),

    drone1: require('@/assets/img/amap/drone1.png'),
    drone2: require('@/assets/img/amap/drone2.png'),
    drone3: require('@/assets/img/amap/drone3.png'),
    drone4: require('@/assets/img/amap/drone4.png'),
    drone5: require('@/assets/img/amap/drone5.gif')
  }

  function getDevIcon(status, deviceType) {
    if (status == 1) {
      if (deviceType == 1) {
        return 'aci aci-camera-gun iconCss1'
      } else if (deviceType == 2) {
        return 'aci aci-camera-ptz iconCss1'
      } else if (deviceType == 3) {
        return 'aci aci-camera-ball iconCss1'
      } else if (deviceType == 4) {
        return 'aci aci-camera-hemisphere iconCss1'
      } else if (deviceType == 5) {
        return 'aci aci-x058_camera-soft-man iconCss1'
      } else if (deviceType == 6) {
        return 'aci aci-x055_camera-bayonet iconCss1'
      } else if (deviceType == 7) {
        return 'aci aci-x056_camera-car iconCss1'
      } else if (deviceType == 8) {
        return 'aci aci-x057_camera-drone iconCss1'
      }
    } else if (status == 0 || status == 2) {
      if (deviceType == 1) {
        return 'aci aci-camera-gun iconCss2'
      } else if (deviceType == 2) {
        return 'aci aci-camera-ptz iconCss2'
      } else if (deviceType == 3) {
        return 'aci aci-camera-ball iconCss2'
      } else if (deviceType == 4) {
        return 'aci aci-camera-hemisphere iconCss2'
      } else if (deviceType == 5) {
        return 'aci aci-x058_camera-soft-man iconCss2'
      } else if (deviceType == 6) {
        return 'aci aci-x055_camera-bayonet iconCss2'
      } else if (deviceType == 7) {
        return 'aci aci-x056_camera-car iconCss2'
      } else if (deviceType == 8) {
        return 'aci aci-x057_camera-drone iconCss2'
      }
    }
  }

  function setDevImg(deviceType = 1, status = 1) {
    if (status == 1) {
      if (deviceType == 1) {
        return devTypeIcons.bolt1
      } else if (deviceType == 2) {
        return devTypeIcons.yuntai1
      } else if (deviceType == 3) {
        return devTypeIcons.ballhead1
      } else if (deviceType == 4) {
        return devTypeIcons.hemisphere1
      } else if (deviceType == 5) {
        return devTypeIcons.softMan1
      } else if (deviceType == 6) {
        return devTypeIcons.bayonet1
      } else if (deviceType == 7) {
        return devTypeIcons.car1
      } else if (deviceType == 8) {
        return devTypeIcons.drone1
      }
    } else {
      if (deviceType == 1) {
        return devTypeIcons.bolt2
      } else if (deviceType == 2) {
        return devTypeIcons.yuntai2
      } else if (deviceType == 3) {
        return devTypeIcons.ballhead2
      } else if (deviceType == 4) {
        return devTypeIcons.hemisphere2
      } else if (deviceType == 5) {
        return devTypeIcons.softMan2
      } else if (deviceType == 6) {
        return devTypeIcons.bayonet2
      } else if (deviceType == 7) {
        return devTypeIcons.car2
      } else if (deviceType == 8) {
        return devTypeIcons.drone2
      }
    }
  }
  // 告警
  function setDevImg1(deviceType) {
    if (deviceType == 1) {
      return devTypeIcons.bolt3
    } else if (deviceType == 2) {
      return devTypeIcons.yuntai3
    } else if (deviceType == 3) {
      return devTypeIcons.ballhead3
    } else if (deviceType == 4) {
      return devTypeIcons.hemisphere3
    } else if (deviceType == 5) {
      return devTypeIcons.softMan3
    } else if (deviceType == 6) {
      return devTypeIcons.bayonet3
    } else if (deviceType == 7) {
      return devTypeIcons.car3
    } else if (deviceType == 8) {
      return devTypeIcons.drone3
    }
  }
  // 播放状态
  function setDevImg2(deviceType) {
    if (deviceType == 1) {
      return devTypeIcons.bolt4
    } else if (deviceType == 2) {
      return devTypeIcons.yuntai4
    } else if (deviceType == 3) {
      return devTypeIcons.ballhead4
    } else if (deviceType == 4) {
      return devTypeIcons.hemisphere4
    } else if (deviceType == 5) {
      return devTypeIcons.softMan4
    } else if (deviceType == 6) {
      return devTypeIcons.bayonet4
    } else if (deviceType == 7) {
      return devTypeIcons.car4
    } else if (deviceType == 8) {
      return devTypeIcons.drone4
    }
  }
  // 告警动图
  function setDevImg3(deviceType) {
    if (deviceType == 1) {
      return devTypeIcons.bolt5
    } else if (deviceType == 2) {
      return devTypeIcons.yuntai5
    } else if (deviceType == 3) {
      return devTypeIcons.ballhead5
    } else if (deviceType == 4) {
      return devTypeIcons.hemisphere5
    } else if (deviceType == 5) {
      return devTypeIcons.softMan5
    } else if (deviceType == 6) {
      return devTypeIcons.bayonet5
    } else if (deviceType == 7) {
      return devTypeIcons.car5
    } else if (deviceType == 8) {
      return devTypeIcons.drone5
    }
  }
  return {
    getDevIcon,
    setDevImg,
    setDevImg1,
    setDevImg2,
    setDevImg3
  }
}
