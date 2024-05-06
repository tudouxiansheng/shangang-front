export default function () {
  const devTypeIcons = {
    yuntai1: require('@/assets/gis/yuntai1.png'),
    yuntai2: require('@/assets/gis/yuntai2.png'),
    yuntai3: require('@/assets/gis/yuntai3.png'),
    yuntai4: require('@/assets/gis/yuntai4.png'),

    bolt1: require('../assets/gis/bolt1.png'),
    bolt2: require('@/assets/gis/bolt2.png'),
    bolt3: require('@/assets/gis/bolt3.png'),
    bolt4: require('@/assets/gis/bolt4.png'),

    ballhead1: require('@/assets/gis/ballhead1.png'),
    ballhead2: require('@/assets/gis/ballhead2.png'),
    ballhead3: require('@/assets/gis/ballhead3.png'),
    ballhead4: require('@/assets/gis/ballhead4.png'),

    hemisphere1: require('@/assets/gis/hemisphere1.png'),
    hemisphere2: require('@/assets/gis/hemisphere2.png'),
    hemisphere3: require('@/assets/gis/hemisphere3.png'),
    hemisphere4: require('@/assets/gis/hemisphere4.png'),

    softMan1: require('@/assets/gis/softMan1.png'),
    softMan2: require('@/assets/gis/softMan2.png'),
    softMan3: require('@/assets/gis/softMan3.png'),
    softMan4: require('@/assets/gis/softMan4.png'),

    bayonet1: require('@/assets/gis/bayonet1.png'),
    bayonet2: require('@/assets/gis/bayonet2.png'),
    bayonet3: require('@/assets/gis/bayonet3.png'),
    bayonet4: require('@/assets/gis/bayonet4.png'),

    car1: require('@/assets/gis/car1.png'),
    car2: require('@/assets/gis/car2.png'),
    car3: require('@/assets/gis/car3.png'),
    car4: require('@/assets/gis/car4.png'),

    drone1: require('@/assets/gis/drone1.png'),
    drone2: require('@/assets/gis/drone2.png'),
    drone3: require('@/assets/gis/drone3.png'),
    drone4: require('@/assets/gis/drone4.png'),

    door1: require('@/assets/gis/door-online.png'),
    door2: require('@/assets/gis/door-offline.png'),
    door3: require('@/assets/gis/door-alarm.png'),

    gate1: require('@/assets/gis/gate-online.png'),
    gate2: require('@/assets/gis/gate-offline.png'),
    gate3: require('@/assets/gis/gate-alarm.png'),

    camera1: require('@/assets/gis/camera.png'),
    camera2: require('@/assets/gis/camera-offline.png'),
    camera3: require('@/assets/gis/camera-alarm.png'),
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
        // return devTypeIcons.bolt1
        return devTypeIcons.camera1
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
      } else if (deviceType == 10) {
        return devTypeIcons.door1
      } else if (deviceType == 11) {
        return devTypeIcons.gate1
      }
    } else {
      if (deviceType == 1) {
        // return devTypeIcons.bolt2
        return devTypeIcons.camera2
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
      } else if (deviceType == 10) {
        return devTypeIcons.door2
      } else if (deviceType == 11) {
        return devTypeIcons.gate2
      }
    }
  }
  // 告警
  function setDevImg1(deviceType) {
    if (deviceType == 1) {
      return devTypeIcons.camera3
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
  return {
    getDevIcon,
    setDevImg,
    setDevImg1,
    setDevImg2,
  }
}
