//人脸数据
import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global

export const faceAttr = [
  [
    {
      gender: i18n.t('snap.gender')
    },
    [
      {
        name: i18n.t('snap.male'),
        value: 1
      },
      {
        name: i18n.t('snap.female'),
        value: 2
      },
      {
        name: i18n.t('snap.unknown'),
        value: 0
      }
    ]
  ],
  [
    {
      emotion: i18n.t('snap.emotion')
    },
    [
      {
        name: i18n.t('snap.unknown'),
        value: 0
      },
      {
        name: i18n.t('snap.anger'),
        value: 1
      },
      {
        name: i18n.t('snap.disgust'),
        value: 2
      },
      {
        name: i18n.t('snap.fear'),
        value: 3
      },
      {
        name: i18n.t('snap.happy'),
        value: 4
      },
      {
        name: i18n.t('snap.calm'),
        value: 5
      },
      {
        name: i18n.t('snap.sadness'),
        value: 6
      },
      {
        name: i18n.t('snap.surprised'),
        value: 7
      }
    ]
  ],
  [
    {
      ageUpLimit: i18n.t('snap.upperAgeLimit')
    }
  ],
  [
    {
      ageLowerLimit: i18n.t('snap.lowerAgeLimit')
    }
  ],
  [
    {
      accompanyNumber: i18n.t('snap.numberOfFacesInTheSameIndustry')
    }
  ],
  [
    {
      skinColor: i18n.t('snap.colour')
    }
  ],
  [
    {
      hairStyle: i18n.t('snap.hairstyle')
    },
    [
      {
        name: i18n.t('snap.flatHead'),
        value: 1
      },
      {
        name: i18n.t('snap.midpoint'),
        value: 2
      },
      {
        name: i18n.t('snap.manSHairStyleWithHairPartedOnTheSide'),
        value: 3
      },
      {
        name: i18n.t('snap.baldnessOfForehead'),
        value: 4
      },
      {
        name: i18n.t('snap.baldnessOfTheNeck'),
        value: 5
      },
      {
        name: i18n.t('snap.completeBaldness'),
        value: 6
      },
      {
        name: i18n.t('snap.curlyHair'),
        value: 7
      },
      {
        name: i18n.t('snap.wavyHair'),
        value: 8
      },
      {
        name: i18n.t('snap.braidedHair'),
        value: 9
      },
      {
        name: i18n.t('snap.updo'),
        value: 10
      },
      {
        name: i18n.t('snap.shawl'),
        value: 11
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      hairColor: i18n.t('snap.hairColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      faceStyle: i18n.t('snap.facialShape')
    }
  ],
  [
    {
      facialFeature: i18n.t('snap.facialFeatures')
    }
  ],
  [
    {
      physicalFeature: i18n.t('snap.physicalFeatures')
    }
  ],
  [
    {
      respiratorColor: i18n.t('snap.maskColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      capStyle: i18n.t('snap.hatStyle')
    },
    [
      {
        name: i18n.t('snap.beanies'),
        value: 1
      },
      {
        name: i18n.t('snap.beret'),
        value: 2
      },
      {
        name: i18n.t('snap.baseballCap'),
        value: 3
      },
      {
        name: i18n.t('snap.flatNeckedHat'),
        value: 4
      },
      {
        name: i18n.t('snap.fishermanSHat'),
        value: 5
      },
      {
        name: i18n.t('snap.pulloverCap'),
        value: 6
      },
      {
        name: i18n.t('snap.duckTongueCap'),
        value: 7
      },
      {
        name: i18n.t('snap.largeBrimmedHat'),
        value: 8
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      capStyle: i18n.t('snap.hatColor')
    }
  ],
  [
    {
      glassStyle: i18n.t('snap.glassesStyle')
    },
    [
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      glassColor: i18n.t('snap.eyeglassColor')
    }
  ],
  [
    {
      eyebrowStyle: i18n.t('snap.eyebrowType')
    },
    [
      {
        name: i18n.t('snap.raiseOneSEyebrowsUpwards'),
        value: 1
      },
      {
        name: i18n.t('snap.straightEyebrow'),
        value: 2
      },
      {
        name: i18n.t('snap.splayedEyebrow'),
        value: 3
      },
      {
        name: i18n.t('snap.paleEyebrows'),
        value: 4
      },
      {
        name: i18n.t('snap.thickEyebrows'),
        value: 5
      },
      {
        name: i18n.t('snap.curvedEyebrow'),
        value: 6
      },
      {
        name: i18n.t('snap.fineEyebrow'),
        value: 7
      },
      {
        name: i18n.t('snap.shortEyebrows'),
        value: 8
      },
      {
        name: i18n.t('snap.specialEyebrows'),
        value: 9
      }
    ]
  ],
  [
    {
      noseStyle: i18n.t('snap.nasalType')
    },
    [
      {
        name: i18n.t('snap.ordinaryNose'),
        value: 1
      },
      {
        name: i18n.t('snap.flatNose'),
        value: 2
      },
      {
        name: i18n.t('snap.pointedNose'),
        value: 3
      },
      {
        name: i18n.t('snap.chaotianNose'),
        value: 4
      },
      {
        name: i18n.t('snap.olecranonNose'),
        value: 5
      },
      {
        name: i18n.t('snap.garlicNose'),
        value: 6
      },
      {
        name: i18n.t('snap.broadNose'),
        value: 7
      },
      {
        name: i18n.t('snap.smallNose'),
        value: 8
      },
      {
        name: i18n.t('snap.exposedNose'),
        value: 9
      },
      {
        name: i18n.t('snap.specialNose'),
        value: 10
      }
    ]
  ],
  [
    {
      mustacheStyle: i18n.t('snap.huType')
    },
    [
      {
        name: i18n.t('snap.yiZiHu'),
        value: 1
      },
      {
        name: i18n.t('snap.baziHu'),
        value: 2
      },
      {
        name: i18n.t('snap.lightBeard'),
        value: 3
      },
      {
        name: i18n.t('snap.collateralBeard'),
        value: 4
      },
      {
        name: i18n.t('snap.goatBeard'),
        value: 5
      },
      {
        name: i18n.t('snap.huabaiHu'),
        value: 6
      },
      {
        name: i18n.t('snap.aLittleBeard'),
        value: 7
      }
    ]
  ],
  [
    {
      lipStyle: i18n.t('snap.lips')
    },
    [
      {
        name: i18n.t('snap.commonMouth'),
        value: 1
      },
      {
        name: i18n.t('snap.thickLips'),
        value: 2
      },
      {
        name: i18n.t('snap.thinLips'),
        value: 3
      },
      {
        name: i18n.t('snap.thickMouth'),
        value: 4
      },
      {
        name: i18n.t('snap.upturnedMouth'),
        value: 5
      },
      {
        name: i18n.t('snap.downwardCurlingOfTheMouth'),
        value: 6
      },
      {
        name: i18n.t('snap.protrudingMouth'),
        value: 7
      },
      {
        name: i18n.t('snap.concaveMouth'),
        value: 8
      },
      {
        name: i18n.t('snap.toothlessMouth'),
        value: 9
      },
      {
        name: i18n.t('snap.smallMouth'),
        value: 10
      }
    ]
  ],
  [
    {
      wrinklePouch: i18n.t('snap.wrinkleEyeBags')
    },
    [
      {
        name: i18n.t('snap.raisedHeadWrinkles'),
        value: 1
      },
      {
        name: i18n.t('snap.leftCornerCrease'),
        value: 2
      },
      {
        name: i18n.t('snap.rightCornerCrease'),
        value: 3
      },
      {
        name: i18n.t('snap.eyebrowStria'),
        value: 4
      },
      {
        name: i18n.t('snap.leftEyePattern'),
        value: 5
      },
      {
        name: i18n.t('snap.rightEyePattern'),
        value: 6
      },
      {
        name: i18n.t('snap.eyebags'),
        value: 7
      },
      {
        name: i18n.t('snap.leftSmilePattern'),
        value: 8
      },
      {
        name: i18n.t('snap.rightSmileyPattern'),
        value: 9
      },
      {
        name: i18n.t('snap.nasalStria'),
        value: 10
      },
      {
        name: i18n.t('snap.leftHandedStria'),
        value: 11
      },
      {
        name: i18n.t('snap.rightThinStripe'),
        value: 12
      }
    ]
  ],
  [
    {
      acneStain: i18n.t('snap.acnePigmentation')
    },
    [
      {
        name: i18n.t('snap.acneOne'),
        value: 1
      },
      {
        name: i18n.t('snap.acneLess'),
        value: 2
      },
      {
        name: i18n.t('snap.acneMany'),
        value: 3
      },
      {
        name: i18n.t('snap.frecklesRare'),
        value: 4
      },
      {
        name: i18n.t('snap.frecklesLess'),
        value: 5
      },
      {
        name: i18n.t('snap.frecklesMany'),
        value: 6
      },
      {
        name: i18n.t('snap.darkSpots'),
        value: 7
      }
    ]
  ],
  [
    {
      freckleBirthmark: i18n.t('snap.moleBirthmark')
    },
    [
      {
        name: i18n.t('snap.nevusSmall'),
        value: 1
      },
      {
        name: i18n.t('snap.nevusIn'),
        value: 2
      },
      {
        name: i18n.t('snap.nevusLarge'),
        value: 3
      },
      {
        name: i18n.t('snap.blackNevusSmall'),
        value: 4
      },
      {
        name: i18n.t('snap.blackNevusIn'),
        value: 5
      },
      {
        name: i18n.t('snap.blackNevusnevusLarge'),
        value: 6
      },
      {
        name: i18n.t('snap.birthmark'),
        value: 7
      }
    ]
  ],
  [
    {
      scarDimple: i18n.t('snap.scarDimples')
    },
    [
      {
        name: i18n.t('snap.scar'),
        value: 1
      },
      {
        name: i18n.t('snap.leftDimple'),
        value: 2
      },
      {
        name: i18n.t('snap.rightDimple'),
        value: 3
      }
    ]
  ],
  [
    {
      otherFeature: i18n.t('snap.otherFeatures')
    },
    [
      {
        name: i18n.t('snap.rosaceaSmall'),
        value: 1
      },
      {
        name: i18n.t('snap.rosaceaLarge'),
        value: 2
      },
      {
        name: i18n.t('snap.rosaceaHeavy'),
        value: 3
      },
      {
        name: i18n.t('snap.zhaofengEarLeft'),
        value: 4
      },
      {
        name: i18n.t('snap.zhaofengEarRight'),
        value: 5
      },
      {
        name: i18n.t('snap.bigEarLeft'),
        value: 6
      },
      {
        name: i18n.t('snap.bigEarRight'),
        value: 7
      },
      {
        name: i18n.t('snap.roughSkin'),
        value: 8
      },
      {
        name: i18n.t('snap.vitiligoMinor'),
        value: 9
      },
      {
        name: i18n.t('snap.vitiligo'),
        value: 10
      },
      {
        name: i18n.t('snap.vitiligoMajor'),
        value: 11
      }
    ]
  ]
]

//人员数据
export const personAttr = [
  [
    {
      idType: i18n.t('snap.documentType')
    },
    [
      {
        name: i18n.t('snap.residentIDCard'),
        value: 111
      },
      {
        name: i18n.t('snap.certificateOfOfficers'),
        value: 114
      },
      {
        name: i18n.t('snap.policeOfficerCertificate'),
        value: 123
      },
      {
        name: i18n.t('snap.ordinaryPassport'),
        value: 414
      }
    ]
  ],
  [
    {
      idNumber: i18n.t('snap.identificationNumber')
    }
  ],
  [
    {
      name: i18n.t('snap.name')
    }
  ],
  [
    {
      usedName: i18n.t('snap.formerName')
    }
  ],
  [
    {
      alias: i18n.t('snap.nickname')
    }
  ],
  [
    {
      ethicCode: i18n.t('snap.ethnicCode')
    }
  ],
  [
    {
      nationalityCode: i18n.t('snap.nationalityCodes')
    }
  ],
  [
    {
      nativeCityCode: i18n.t('snap.hometownProvinceCityCounty')
    }
  ],
  [
    {
      residenceAdminDivision: i18n.t('snap.administrativeDivisionOfResidence')
    }
  ],
  [
    {
      chineseAccentCode: i18n.t('snap.chineseAccent')
    }
  ],
  [
    {
      personOrg: i18n.t('snap.unitName')
    }
  ],
  [
    {
      jobCategory: i18n.t('snap.occupationalCategory')
    }
  ],
  [
    {
      accompanyNumber: i18n.t('snap.numberOfPeers')
    }
  ],
  [
    {
      heightUpLimit: i18n.t('snap.upperHeightLimit')
    }
  ],
  [
    {
      heightLowerLimit: i18n.t('snap.lowerLimitOfHeight')
    }
  ],
  [
    {
      bodyType: i18n.t('snap.shape')
    }
  ],
  [
    {
      gesture: i18n.t('snap.attitude')
    },
    [
      {
        name: i18n.t('snap.station'),
        value: 1
      },
      {
        name: i18n.t('snap.squat'),
        value: 2
      },
      {
        name: i18n.t('snap.recumbent'),
        value: 3
      },
      {
        name: i18n.t('snap.lie'),
        value: 4
      },
      {
        name: i18n.t('snap.sit'),
        value: 5
      },
      {
        name: i18n.t('snap.walk'),
        value: 6
      },
      {
        name: i18n.t('snap.running'),
        value: 7
      },
      {
        name: i18n.t('snap.jump'),
        value: 8
      },
      {
        name: i18n.t('snap.climb'),
        value: 9
      },
      {
        name: i18n.t('snap.prostrate'),
        value: 10
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      gesture: i18n.t('snap.state')
    },
    [
      {
        name: i18n.t('snap.lookAtDisdainfully'),
        value: 1
      },
      {
        name: i18n.t('snap.blink'),
        value: 2
      },
      {
        name: i18n.t('snap.frown'),
        value: 3
      },
      {
        name: i18n.t('snap.eyebrowRaising'),
        value: 4
      },
      {
        name: i18n.t('snap.pushMirror'),
        value: 5
      },
      {
        name: i18n.t('snap.grabTheHead'),
        value: 6
      },
      {
        name: i18n.t('snap.noseDigging'),
        value: 7
      },
      {
        name: i18n.t('snap.touchTheChin'),
        value: 8
      },
      {
        name: i18n.t('snap.gesture'),
        value: 9
      },
      {
        name: i18n.t('snap.leftHandedPerson'),
        value: 10
      },
      {
        name: i18n.t('snap.neckConstriction'),
        value: 11
      },
      {
        name: i18n.t('snap.walkAndSway'),
        value: 12
      },
      {
        name: i18n.t('snap.outerEightCharacters'),
        value: 13
      },
      {
        name: i18n.t('snap.innerEightCharacters'),
        value: 14
      },
      {
        name: i18n.t('snap.facialMuscleTwitching'),
        value: 15
      },
      {
        name: i18n.t('snap.speakWithACrookedTongue'),
        value: 16
      },
      {
        name: i18n.t('snap.swingOneSHead'),
        value: 17
      },
      {
        name: i18n.t('snap.tremor'),
        value: 18
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      physicalFeature: i18n.t('snap.physicalFeatures')
    }
  ],
  [
    {
      bodyFeature: i18n.t('snap.surfaceFeatures')
    }
  ],
  [
    {
      habitualMovement: i18n.t('snap.habitualMovements')
    },
    [
      {
        name: i18n.t('snap.lookAtDisdainfully'),
        value: 1
      },
      {
        name: i18n.t('snap.blink'),
        value: 2
      },
      {
        name: i18n.t('snap.frown'),
        value: 3
      },
      {
        name: i18n.t('snap.eyebrowRaising'),
        value: 4
      },
      {
        name: i18n.t('snap.pushMirror'),
        value: 5
      },
      {
        name: i18n.t('snap.grabTheHead'),
        value: 6
      },
      {
        name: i18n.t('snap.noseDigging'),
        value: 7
      },
      {
        name: i18n.t('snap.touchTheChin'),
        value: 8
      },
      {
        name: i18n.t('snap.gesture'),
        value: 9
      },
      {
        name: i18n.t('snap.leftHandedPerson'),
        value: 10
      },
      {
        name: i18n.t('snap.neckConstriction'),
        value: 11
      },
      {
        name: i18n.t('snap.walkAndSway'),
        value: 12
      },
      {
        name: i18n.t('snap.outerEightCharacters'),
        value: 13
      },
      {
        name: i18n.t('snap.innerEightCharacters'),
        value: 14
      },
      {
        name: i18n.t('snap.facialMuscleTwitching'),
        value: 15
      },
      {
        name: i18n.t('snap.speakWithACrookedTongue'),
        value: 16
      },
      {
        name: i18n.t('snap.swingOneSHead'),
        value: 17
      },
      {
        name: i18n.t('snap.tremor'),
        value: 18
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      behavior: i18n.t('snap.behavior')
    },
    [
      {
        name: i18n.t('snap.tailgating'),
        value: 1
      },
      {
        name: i18n.t('snap.wandering'),
        value: 2
      },
      {
        name: i18n.t('snap.withdrawal'),
        value: 3
      },
      {
        name: i18n.t('snap.fight'),
        value: 4
      },
      {
        name: i18n.t('snap.drive'),
        value: 5
      },
      {
        name: i18n.t('snap.makingPhoneCalls'),
        value: 6
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      behaviorDescription: i18n.t('snap.behaviorDescription')
    }
  ],
  [
    {
      appendant: i18n.t('snap.appendage')
    },
    [
      {
        name: i18n.t('snap.mobilePhone'),
        value: 1
      },
      {
        name: i18n.t('snap.umbrella'),
        value: 2
      },
      {
        name: i18n.t('snap.mask'),
        value: 3
      },
      {
        name: i18n.t('snap.watch'),
        value: 4
      },
      {
        name: i18n.t('snap.helmet'),
        value: 5
      },
      {
        name: i18n.t('snap.glasses'),
        value: 6
      },
      {
        name: i18n.t('snap.hat'),
        value: 7
      },
      {
        name: i18n.t('snap.package'),
        value: 8
      },
      {
        name: i18n.t('snap.scarf'),
        value: 9
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      appendantDescription: i18n.t('snap.attachmentDescription')
    }
  ],
  [
    {
      umbrellaColor: i18n.t('snap.umbrellaColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      bagStyle: i18n.t('snap.bagStyle')
    },
    [
      {
        name: i18n.t('snap.shoulderBag'),
        value: 1
      },
      {
        name: i18n.t('snap.handbag'),
        value: 2
      },
      {
        name: i18n.t('snap.backpack'),
        value: 3
      },
      {
        name: i18n.t('snap.wallet'),
        value: 4
      },
      {
        name: i18n.t('snap.handbag1'),
        value: 5
      },
      {
        name: i18n.t('snap.waistPack'),
        value: 6
      },
      {
        name: i18n.t('snap.keypack'),
        value: 7
      },
      {
        name: i18n.t('snap.cardPackage'),
        value: 8
      },
      {
        name: i18n.t('snap.handPullBox'),
        value: 9
      },
      {
        name: i18n.t('snap.travelBag'),
        value: 10
      },
      {
        name: i18n.t('snap.denimBag'),
        value: 11
      },
      {
        name: i18n.t('snap.crossbodyBag'),
        value: 12
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      bagColor: i18n.t('snap.packageColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      coatStyle: i18n.t('snap.topStyle')
    },
    [
      {
        name: i18n.t('snap.suit'),
        value: 1
      },
      {
        name: i18n.t('snap.ethnicClothing'),
        value: 2
      },
      {
        name: i18n.t('snap.tShirt'),
        value: 3
      },
      {
        name: i18n.t('snap.shirt'),
        value: 4
      },
      {
        name: i18n.t('snap.sweater'),
        value: 5
      },
      {
        name: i18n.t('snap.jacket'),
        value: 6
      },
      {
        name: i18n.t('snap.leatherJacket'),
        value: 7
      },
      {
        name: i18n.t('snap.overcoat'),
        value: 8
      },
      {
        name: i18n.t('snap.windbreaker'),
        value: 9
      },
      {
        name: i18n.t('snap.sweater1'),
        value: 10
      },
      {
        name: i18n.t('snap.cottonCoat'),
        value: 11
      },
      {
        name: i18n.t('snap.downJacket'),
        value: 12
      },
      {
        name: i18n.t('snap.sportswear'),
        value: 13
      },
      {
        name: i18n.t('snap.workClothes'),
        value: 14
      },
      {
        name: i18n.t('snap.denimClothing'),
        value: 15
      },
      {
        name: i18n.t('snap.pajamas'),
        value: 16
      },
      {
        name: i18n.t('snap.dress'),
        value: 17
      },
      {
        name: i18n.t('snap.topless'),
        value: 18
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      coatLength: i18n.t('snap.topLength')
    },
    [
      {
        name: i18n.t('snap.longSleeved'),
        value: 1
      },
      {
        name: i18n.t('snap.shortSleeved'),
        value: 2
      },
      {
        name: i18n.t('snap.sleeveless'),
        value: 3
      }
    ]
  ],
  [
    {
      coatColor: i18n.t('snap.topColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      trousersStyle: i18n.t('snap.pantStyle')
    },
    [
      {
        name: i18n.t('snap.jeans'),
        value: 1
      },
      {
        name: i18n.t('snap.westernPants'),
        value: 2
      },
      {
        name: i18n.t('snap.overalls'),
        value: 3
      },
      {
        name: i18n.t('snap.leatherPants'),
        value: 4
      },
      {
        name: i18n.t('snap.beachPants'),
        value: 5
      },
      {
        name: i18n.t('snap.sportsPants'),
        value: 6
      },
      {
        name: i18n.t('snap.pajamaPants'),
        value: 7
      },
      {
        name: i18n.t('snap.noPants'),
        value: 8
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      trousersColor: i18n.t('snap.pantColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      trousersLen: i18n.t('snap.pantLength')
    },
    [
      {
        name: i18n.t('snap.trousers'),
        value: 1
      },
      {
        name: i18n.t('snap.shorts'),
        value: 2
      }
    ]
  ],
  [
    {
      shoesStyle: i18n.t('snap.shoeStyle')
    },
    [
      {
        name: i18n.t('snap.cricketShoes'),
        value: 1
      },
      {
        name: i18n.t('snap.leatherShoes'),
        value: 2
      },
      {
        name: i18n.t('snap.sneakers'),
        value: 3
      },
      {
        name: i18n.t('snap.slippers'),
        value: 4
      },
      {
        name: i18n.t('snap.sandals'),
        value: 5
      },
      {
        name: i18n.t('snap.casualShoes'),
        value: 6
      },
      {
        name: i18n.t('snap.highBoots'),
        value: 7
      },
      {
        name: i18n.t('snap.midLengthBoots'),
        value: 8
      },
      {
        name: i18n.t('snap.lowBoots'),
        value: 9
      },
      {
        name: i18n.t('snap.hikingBoots'),
        value: 10
      },
      {
        name: i18n.t('snap.militaryBoots'),
        value: 11
      },
      {
        name: i18n.t('snap.bootless'),
        value: 12
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      shoesColor: i18n.t('snap.shoeColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      isDriver: i18n.t('snap.driverOrNot')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.uncertain'),
        value: 2
      }
    ]
  ],
  [
    {
      isForeigner: i18n.t('snap.whetherForeignRelatedPersonnel')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.uncertain'),
        value: 2
      }
    ]
  ],
  [
    {
      passportType: i18n.t('snap.typesOfPassportDocuments')
    },
    [
      {
        name: i18n.t('snap.diplomaticPassport'),
        value: 11
      },
      {
        name: i18n.t('snap.officialPassport'),
        value: 12
      },
      {
        name: i18n.t('snap.ordinaryPassportForBusinessPurposes'),
        value: 13
      },
      {
        name: i18n.t('snap.ordinaryPassport'),
        value: 14
      },
      {
        name: i18n.t('snap.travelerSPassOfThePeopleSRepublicOfChina'),
        value: 15
      },
      {
        name: i18n.t('snap.travelPassesForTaiwanResidentsToEnterOrLeaveTheMainland'),
        value: 16
      },
      {
        name: i18n.t('snap.seamanSCertificate'),
        value: 17
      },
      {
        name: i18n.t('snap.crewMemberCertificate'),
        value: 18
      },
      {
        name: i18n.t('snap.railwayEmployeeCertificate'),
        value: 19
      },
      {
        name: i18n.t('snap.entryExitPermitOfThePeopleRepublicOfChina'),
        value: 20
      },
      {
        name: i18n.t('snap.passForTravelingBetweenInlandAreasAndHongKongAndMacao'),
        value: 21
      },
      {
        name: i18n.t('snap.oneWayPassToHongKongAndMacao'),
        value: 23
      },
      {
        name: i18n.t('snap.homeVisitingCertificateForHongKongAndMacaoCompatriots'),
        value: 24
      },
      {
        name: i18n.t('snap.mainlandResidentsTravelPermitToTaiwan'),
        value: 25
      },
      {
        name: i18n.t('snap.TravelPermitToHongKongAndMacauSpecialAdministrativeRegion'),
        value: 27
      },
      {
        name: i18n.t('snap.overseasChineseReturnAndSettlementCertificate'),
        value: 28
      },
      {
        name: i18n.t('snap.taiwanCompatriotSettlementCertificate'),
        value: 29
      },
      {
        name: i18n.t('snap.alienEntryAndExitPermit'),
        value: 30
      },
      {
        name: i18n.t('snap.foreignTravelPermit'),
        value: 31
      },
      {
        name: i18n.t('snap.alienResidencePermit'),
        value: 32
      },
      {
        name: i18n.t('snap.temporaryResidencePermitsForForeigners'),
        value: 33
      },
      {
        name: i18n.t('snap.naturalizationCertificate'),
        value: 35
      },
      {
        name: i18n.t('snap.certificateOfDisembarkation'),
        value: 36
      },
      {
        name: i18n.t('snap.certificateOfReregistration'),
        value: 37
      },
      {
        name: i18n.t('snap.temporaryResidencePermit'),
        value: 38
      },
      {
        name: i18n.t('snap.fishermanSCertificateForSailingFishingBoats'),
        value: 40
      },
      {
        name: i18n.t('snap.TemporarySeagoingFishingBoatCitizenCertificate'),
        value: 41
      },
      {
        name: i18n.t('snap.householdRegistrationBookForSeagoingShips'),
        value: 42
      },
      {
        name: i18n.t('snap.HouseholdRegistrationCertificateForSeagoingShips'),
        value: 43
      },
      {
        name: i18n.t('snap.GuangdongHongKongMacaoFloatingFishermanCertificate'),
        value: 44
      },
      {
        name: i18n.t('snap.GuangdongHongKongMacaoTemporaryMobileFishermanCertificate'),
        value: 45
      },
      {
        name: i18n.t('snap.HouseholdRegistrationBookForMobileFishingBoatsInGuangdongHongKongAndMacao'),
        value: 46
      },
      {
        name: i18n.t('snap.permitToRideOnPlatformWheels'),
        value: 47
      },
      {
        name: i18n.t('snap.laborPersonnelBoardingOperationCertificate'),
        value: 48
      },
      {
        name: i18n.t('snap.taiwanResidentLandingPermit'),
        value: 49
      },
      {
        name: i18n.t('snap.tradeCertificate'),
        value: 50
      },
      {
        name: i18n.t('snap.borderPass'),
        value: 60
      },
      {
        name: i18n.t('snap.shenzhenTransitFarmingWitness'),
        value: 61
      },
      {
        name: i18n.t('snap.hongKongSpecialAdministrativeRegionPassport'),
        value: 70
      },
      {
        name: i18n.t('snap.macauSpecialAdministrativeRegionPassport'),
        value: 71
      },
      {
        name: i18n.t('snap.myanmarChinesePassport'),
        value: 81
      },
      {
        name: i18n.t('snap.yunnanBorderEntryAndExitPermit'),
        value: 82
      },
      {
        name: i18n.t('snap.chinaNorthKoreaEntryAndExitPermit'),
        value: 90
      },
      {
        name: i18n.t('snap.chaozhongTransitPass'),
        value: 91
      },
      {
        name: i18n.t('snap.hydrologicalWorkPermit'),
        value: 92
      },
      {
        name: i18n.t('snap.chinaNorthKoreaRepresentativeCertificate'),
        value: 93
      },
      {
        name: i18n.t('snap.chinaNorthKoreaShipCrewCertificate'),
        value: 94
      },
      {
        name: i18n.t('snap.sinoKoreanPublicSecurityCertificate'),
        value: 95
      },
      {
        name: i18n.t('snap.sinoKoreanPublicSecurityCertificate1'),
        value: 96
      },
      {
        name: i18n.t('snap.sinoKoreanPublicSecurityCertificate2'),
        value: 97
      },
      {
        name: i18n.t('snap.otherDocuments'),
        value: 99
      }
    ]
  ],
  [
    {
      immigrantTypeCode: i18n.t('snap.categoryCodeForEntryExitPersonnel')
    }
  ],
  [
    {
      isSuspectedTerrorist: i18n.t('snap.areThereIndividualsInvolvedInTerrorism')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.uncertain'),
        value: 2
      }
    ]
  ],
  [
    {
      suspectedTerroristNumber: i18n.t('snap.terroristPersonnelNumber')
    }
  ],
  [
    {
      isCriminalInvolved: i18n.t('snap.isThePersonInvolvedInTheCase')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.uncertain'),
        value: 2
      }
    ]
  ],
  [
    {
      criminalInvolvedSpecilisationCode: i18n.t('snap.expertiseOfPersonnelInvolvedInTheCase')
    }
  ],
  [
    {
      bodySpeciallMark: i18n.t('snap.specialMarkingsOnTheBodySurface')
    }
  ],
  [
    {
      crimeMethod: i18n.t('snap.theMeansOfCommittingTheCrime')
    }
  ],
  [
    {
      crimeCharacterCode: i18n.t('snap.characteristicsOfTheCrime')
    }
  ],
  [
    {
      escapedCriminalNumber: i18n.t('snap.numberOfFugitives')
    }
  ],
  [
    {
      isDetainees: i18n.t('snap.isThereAPersonInCustody')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.uncertain'),
        value: 2
      }
    ]
  ],
  [
    {
      detentionHouseCode: i18n.t('snap.codeOfDetentionCenter')
    }
  ],
  [
    {
      detaineesIdentity: i18n.t('snap.identityOfDetainees')
    },
    [
      {
        name: i18n.t('snap.nationalCivilServants'),
        value: 1
      },
      {
        name: i18n.t('snap.administrativeStaff'),
        value: 2
      },
      {
        name: i18n.t('snap.employeesOfEnterprisesAndInstitutions'),
        value: 3
      },
      {
        name: i18n.t('snap.worker'),
        value: 4
      },
      {
        name: i18n.t('snap.farmer'),
        value: 5
      },
      {
        name: i18n.t('snap.individualBusinessOwners'),
        value: 6
      },
      {
        name: i18n.t('snap.onCampusStudents'),
        value: 7
      },
      {
        name: i18n.t('snap.retiredPersonnel'),
        value: 8
      },
      {
        name: i18n.t('snap.unemployedPersonnel'),
        value: 9
      },
      {
        name: i18n.t('snap.soldier'),
        value: 10
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      detaineesSpecialIdentity: i18n.t('snap.specialIdentityOfDetainees')
    }
  ],
  [
    {
      memberTypeCode: i18n.t('snap.memberTypeCode')
    }
  ],
  [
    {
      isVictim: i18n.t('snap.whetherTheVictim')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.uncertain'),
        value: 2
      }
    ]
  ],
  [
    {
      victimType: i18n.t('snap.typesOfVictims')
    }
  ],
  [
    {
      injuredDegree: i18n.t('snap.degreeOfInjury')
    },
    [
      {
        name: i18n.t('snap.death'),
        value: 1
      },
      {
        name: i18n.t('snap.seriousInjury'),
        value: 2
      },
      {
        name: i18n.t('snap.minorInjury'),
        value: 3
      },
      {
        name: i18n.t('snap.minorInjury1'),
        value: 4
      },
      {
        name: i18n.t('snap.other'),
        value: 9
      }
    ]
  ],
  [
    {
      corpseConditionCode: i18n.t('snap.bodyConditionCode')
    }
  ]
]

//机动车数据
export const motorAttr = [
  [
    {
      hasPlate: i18n.t('snap.isThereALicensePlate')
    },
    [
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.no'),
        value: 0
      }
    ]
  ],
  [
    {
      plateClass: i18n.t('snap.typeOfLicensePlate')
    },
    [
      {
        name: i18n.t('snap.largeCarLicensePlate'),
        value: '01'
      },
      {
        name: i18n.t('snap.smallCarLicensePlate'),
        value: '02'
      },
      {
        name: i18n.t('snap.embassyCarLicensePlate'),
        value: '03'
      },
      {
        name: i18n.t('snap.consulateCarNumberPlate'),
        value: '04'
      },
      {
        name: i18n.t('snap.overseasCarLicensePlate'),
        value: '05'
      },
      {
        name: i18n.t('snap.foreignCarLicensePlate'),
        value: '06'
      },
      {
        name: i18n.t('snap.ordinaryMotorcycleLicensePlate'),
        value: '07'
      },
      {
        name: i18n.t('snap.portableMotorcycleLicensePlate'),
        value: '08'
      },
      {
        name: i18n.t('snap.embassyMotorcycleLicensePlate'),
        value: '09'
      },
      {
        name: i18n.t('snap.consulateMotorcycleLicensePlate'),
        value: '10'
      },
      {
        name: i18n.t('snap.overseasMotorcycleLicensePlate'),
        value: '11'
      },
      {
        name: i18n.t('snap.foreignMotorcycleLicensePlate'),
        value: '12'
      },
      {
        name: i18n.t('snap.lowSpeedVehicleLicensePlate'),
        value: '13'
      },
      {
        name: i18n.t('snap.tractorLicensePlate'),
        value: '14'
      },
      {
        name: i18n.t('snap.trailerLicensePlate'),
        value: '15'
      },
      {
        name: i18n.t('snap.coachCarLicensePlate'),
        value: '16'
      },
      {
        name: i18n.t('snap.coachMotorcycleLicensePlate'),
        value: '17'
      },
      {
        name: i18n.t('snap.temporaryEntryVehicleLicensePlate'),
        value: '20'
      },
      {
        name: i18n.t('snap.temporaryEntryMotorcycleLicensePlate'),
        value: '21'
      },
      {
        name: i18n.t('snap.temporaryDrivingLicensePlate'),
        value: '22'
      },
      {
        name: i18n.t('snap.policeCarLicensePlate'),
        value: '23'
      },
      {
        name: i18n.t('snap.policeMotorcycleLicensePlate'),
        value: '24'
      },
      {
        name: i18n.t('snap.originalAgriculturalMachineryLicensePlate'),
        value: '25'
      },
      {
        name: i18n.t('snap.hongKongEntryAndExitLicensePlate'),
        value: '26'
      },
      {
        name: i18n.t('snap.macauEntryAndExitLicensePlate'),
        value: '27'
      },
      {
        name: i18n.t('snap.armedPoliceNumberPlate'),
        value: '31'
      },
      {
        name: i18n.t('snap.militaryLicensePlate'),
        value: '32'
      },
      {
        name: i18n.t('snap.otherLicensePlates'),
        value: '99'
      }
    ]
  ],
  [
    {
      plateColor: i18n.t('snap.licensePlateColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      plateNo: i18n.t('snap.licensePlateNumber')
    }
  ],
  [
    {
      plateNoAttach: i18n.t('snap.trailerBrand')
    }
  ],
  [
    {
      plateDescribe: i18n.t('snap.licensePlateDescription')
    }
  ],
  [
    {
      isDecked: i18n.t('snap.whetherToDeckOrNot')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      }
    ]
  ],
  [
    {
      isAltered: i18n.t('snap.whetherToAlterOrNot')
    }
  ],
  [
    {
      isCovered: i18n.t('snap.isItObstructed')
    }
  ],
  [
    {
      speed: i18n.t('snap.drivingSpeed')
    }
  ],
  [
    {
      drivingStatusCode: i18n.t('snap.drivingStatusCode')
    }
  ],
  [
    {
      usingPropertiesCode: i18n.t('snap.vehicleUsageCode')
    }
  ],
  [
    {
      vehicleBrand: i18n.t('snap.vehicleBrand')
    }
  ],
  [
    {
      vehicleModel: i18n.t('snap.vehicleModel')
    }
  ],
  [
    {
      vehicleLength: i18n.t('snap.vehicleLength')
    }
  ],
  [
    {
      vehicleWidth: i18n.t('snap.vehicleWidth')
    }
  ],
  [
    {
      vehicleHeight: i18n.t('snap.vehicleHeight')
    }
  ],
  [
    {
      vehicleColor: i18n.t('snap.vehicleColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      vehicleHood: i18n.t('snap.hood')
    }
  ],
  [
    {
      vehicleTrunk: i18n.t('snap.rearCover')
    }
  ],
  [
    {
      vehicleWheel: i18n.t('snap.wheel')
    }
  ],
  [
    {
      wheelPrintedPattern: i18n.t('snap.wheelPrintPattern')
    }
  ],
  [
    {
      vehicleWindow: i18n.t('snap.windows')
    }
  ],
  [
    {
      vehicleRoof: i18n.t('snap.roof')
    }
  ],
  [
    {
      vehicleDoor: i18n.t('snap.door')
    }
  ],
  [
    {
      sideOfVehicle: i18n.t('snap.carSide')
    }
  ],
  [
    {
      carOfVehicle: i18n.t('snap.carriage')
    }
  ],
  [
    {
      rearviewMirror: i18n.t('snap.rearviewMirror')
    }
  ],
  [
    {
      vehicleChassis: i18n.t('snap.chassis')
    }
  ],
  [
    {
      vehicleShielding: i18n.t('snap.screen')
    }
  ],
  [
    {
      filmColor: i18n.t('snap.filmColor')
    },
    [
      {
        name: i18n.t('snap.darkColor'),
        value: 0
      },
      {
        name: i18n.t('snap.lightColor'),
        value: 1
      },
      {
        name: i18n.t('snap.nothing'),
        value: 2
      }
    ]
  ],
  [
    {
      isModified: i18n.t('snap.modificationLogo')
    },
    [
      {
        name: i18n.t('snap.notModified'),
        value: 0
      },
      {
        name: i18n.t('snap.modification'),
        value: 1
      }
    ]
  ],
  [
    {
      tollgateId: i18n.t('snap.checkpointID'),
    }
  ],
  [
    {
      vehicleColorDepth: i18n.t('snap.colorDepth')
    },
    [
      {
        name: i18n.t('snap.deep'),
        value: 0
      },
      {
        name: i18n.t('snap.shallow'),
        value: 1
      }
    ]
  ],
  [
    {
      hitMarkInfo: i18n.t('snap.collisionMarkInformation')
    },
    [
      {
        name: i18n.t('snap.noCollisionMarks'),
        value: 0
      },
      {
        name: i18n.t('snap.minorImpactMarks'),
        value: 1
      },
      {
        name: i18n.t('snap.largeNumberOfCollisionMarks'),
        value: 1
      }
    ]
  ],
  [
    {
      vehicleBodyDesc: i18n.t('snap.bodyDescription')
    }
  ],
  [
    {
      vehicleFrontItem: i18n.t('snap.itemsInFrontOfTheCar')
    },
    [
      {
        name: i18n.t('snap.detectionFlag'),
        value: 1
      },
      {
        name: i18n.t('snap.perfume'),
        value: 2
      },
      {
        name: i18n.t('snap.pendants'),
        value: 3
      },
      {
        name: i18n.t('snap.sunshade'),
        value: 4
      },
      {
        name: i18n.t('snap.nightSunVisor'),
        value: 5
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      descOfFrontItem: i18n.t('snap.descriptionOfItemsInTheFrontOfTheCar')
    }
  ],
  [
    {
      vehicleRearItem: i18n.t('snap.itemsAtTheRearOfTheCar')
    }
  ],
  [
    {
      descOfRearItem: i18n.t('snap.descriptionOfItemsAtTheRearOfTheCar')
    },
    [
      {
        name: i18n.t('snap.pillow'),
        value: 1
      },
      {
        name: i18n.t('snap.umbrella1'),
        value: 2
      },
      {
        name: i18n.t('snap.tissuePaper'),
        value: 3
      },
      {
        name: i18n.t('snap.carStickers'),
        value: 4
      },
      {
        name: i18n.t('snap.identification'),
        value: 5
      },
      {
        name: i18n.t('snap.graffiti'),
        value: 6
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      numOfPassenger: i18n.t('snap.numberOfPeopleInTheCar')
    }
  ],
  [
    {
      passTime: i18n.t('snap.afterAMoment')
    }
  ],
  [
    {
      nameOfPassedRoad: i18n.t('snap.nameOfRoadPassingBy')
    }
  ],
  [
    {
      isSuspicious: i18n.t('snap.isItASuspiciousVehicle')
    },
    [
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.no'),
        value: 0
      }
    ]
  ],
  [
    {
      sunvisor: i18n.t('snap.sunshadeStatus')
    },
    [
      {
        name: i18n.t('snap.packUp'),
        value: 0
      },
      {
        name: i18n.t('snap.putDown'),
        value: 1
      }
    ]
  ],
  [
    {
      safetyBelt: i18n.t('snap.seatBeltStatus')
    },
    [
      {
        name: i18n.t('snap.unrelated'),
        value: 0
      },
      {
        name: i18n.t('snap.related'),
        value: 1
      }
    ]
  ],
  [
    {
      calling: i18n.t('snap.telephoneStatus')
    },
    [
      {
        name: i18n.t('snap.noPhoneCallsMade'),
        value: 0
      },
      {
        name: i18n.t('snap.onThePhone'),
        value: 1
      }
    ]
  ],
  [
    {
      plateReliability: i18n.t('snap.licensePlateRecognitionCredibility')
    }
  ],
  [
    {
      plateCharReliability: i18n.t('snap.recognitionCredibilityOfLicensePlateNumbers')
    }
  ],
  [
    {
      brandReliability: i18n.t('snap.brandLogoRecognitionCredibility')
    }
  ],
  [
    {
      laneNo: i18n.t('snap.laneNumber'),
    }
  ],
  [
    {
      direction: i18n.t('snap.directionOfTravel')
    },
    [
      {
        name: i18n.t('snap.westToEast'),
        value: 1
      },
      {
        name: i18n.t('snap.eastToWest'),
        value: 2
      },
      {
        name: i18n.t('snap.northToSouth'),
        value: 3
      },
      {
        name: i18n.t('snap.southToNorth'),
        value: 4
      },
      {
        name: i18n.t('snap.southwestToNortheast'),
        value: 5
      },
      {
        name: i18n.t('snap.northeastToSouthwest'),
        value: 6
      },
      {
        name: i18n.t('snap.northwestToSoutheast'),
        value: 7
      },
      {
        name: i18n.t('snap.southeastToNorthwest'),
        value: 8
      },
      {
        name: i18n.t('snap.other'),
        value: 9
      }
    ]
  ],
  [
    {
      vehicleClass: i18n.t('snap.vehicleType')
    }
  ],
  [
    {
      vehicleYearBrand: i18n.t('snap.vehicleModelYear')
    }
  ]
]

//非机动车数据
export const nonMotorAttr = [
  [
    {
      hasPlate: i18n.t('snap.isThereALicensePlate')
    },
    [
      {
        name: i18n.t('snap.yes'),
        value: 1
      },
      {
        name: i18n.t('snap.no'),
        value: 0
      }
    ]
  ],
  [
    {
      plateClass: i18n.t('snap.typeOfLicensePlate')
    },
    [
      {
        name: i18n.t('snap.largeCarLicensePlate'),
        value: '01'
      },
      {
        name: i18n.t('snap.smallCarLicensePlate'),
        value: '02'
      },
      {
        name: i18n.t('snap.embassyCarLicensePlate'),
        value: '03'
      },
      {
        name: i18n.t('snap.consulateCarNumberPlate'),
        value: '04'
      },
      {
        name: i18n.t('snap.overseasCarLicensePlate'),
        value: '05'
      },
      {
        name: i18n.t('snap.foreignCarLicensePlate'),
        value: '06'
      },
      {
        name: i18n.t('snap.ordinaryMotorcycleLicensePlate'),
        value: '07'
      },
      {
        name: i18n.t('snap.portableMotorcycleLicensePlate'),
        value: '08'
      },
      {
        name: i18n.t('snap.embassyMotorcycleLicensePlate'),
        value: '09'
      },
      {
        name: i18n.t('snap.consulateMotorcycleLicensePlate'),
        value: '10'
      },
      {
        name: i18n.t('snap.overseasMotorcycleLicensePlate'),
        value: '11'
      },
      {
        name: i18n.t('snap.foreignMotorcycleLicensePlate'),
        value: '12'
      },
      {
        name: i18n.t('snap.lowSpeedVehicleLicensePlate'),
        value: '13'
      },
      {
        name: i18n.t('snap.tractorLicensePlate'),
        value: '14'
      },
      {
        name: i18n.t('snap.trailerLicensePlate'),
        value: '15'
      },
      {
        name: i18n.t('snap.coachCarLicensePlate'),
        value: '16'
      },
      {
        name: i18n.t('snap.coachMotorcycleLicensePlate'),
        value: '17'
      },
      {
        name: i18n.t('snap.temporaryEntryVehicleLicensePlate'),
        value: '20'
      },
      {
        name: i18n.t('snap.temporaryEntryMotorcycleLicensePlate'),
        value: '21'
      },
      {
        name: i18n.t('snap.temporaryDrivingLicensePlate'),
        value: '22'
      },
      {
        name: i18n.t('snap.policeCarLicensePlate'),
        value: '23'
      },
      {
        name: i18n.t('snap.policeMotorcycleLicensePlate'),
        value: '24'
      },
      {
        name: i18n.t('snap.originalAgriculturalMachineryLicensePlate'),
        value: '25'
      },
      {
        name: i18n.t('snap.hongKongEntryAndExitLicensePlate'),
        value: '26'
      },
      {
        name: i18n.t('snap.macauEntryAndExitLicensePlate'),
        value: '27'
      },
      {
        name: i18n.t('snap.armedPoliceNumberPlate'),
        value: '31'
      },
      {
        name: i18n.t('snap.militaryLicensePlate'),
        value: '32'
      },
      {
        name: i18n.t('snap.otherLicensePlates'),
        value: '99'
      }
    ]
  ],
  [
    {
      plateColor: i18n.t('snap.licensePlateColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      plateNo: i18n.t('snap.licensePlateNumber')
    }
  ],
  [
    {
      plateNoAttach: i18n.t('snap.trailerBrand')
    }
  ],
  [
    {
      plateDescribe: i18n.t('snap.licensePlateDescription')
    }
  ],
  [
    {
      isDecked: i18n.t('snap.whetherToDeckOrNot')
    },
    [
      {
        name: i18n.t('snap.no'),
        value: 0
      },
      {
        name: i18n.t('snap.yes'),
        value: 1
      }
    ]
  ],
  [
    {
      isAltered: i18n.t('snap.whetherToAlterOrNot')
    }
  ],
  [
    {
      isCovered: i18n.t('snap.isItObstructed')
    }
  ],
  [
    {
      speed: i18n.t('snap.drivingSpeed')
    }
  ],
  [
    {
      drivingStatusCode: i18n.t('snap.drivingStatusCode')
    }
  ],
  [
    {
      usingPropertiesCode: i18n.t('snap.vehicleUsageCode')
    }
  ],
  [
    {
      vehicleBrand: i18n.t('snap.vehicleBrand')
    }
  ],
  [
    {
      vehicleModel: i18n.t('snap.vehicleModel')
    }
  ],
  [
    {
      vehicleLength: i18n.t('snap.vehicleLength')
    }
  ],
  [
    {
      vehicleWidth: i18n.t('snap.vehicleWidth')
    }
  ],
  [
    {
      vehicleHeight: i18n.t('snap.vehicleHeight')
    }
  ],
  [
    {
      vehicleColor: i18n.t('snap.vehicleColor')
    },
    [
      {
        name: i18n.t('snap.black'),
        value: 1
      },
      {
        name: i18n.t('snap.white'),
        value: 2
      },
      {
        name: i18n.t('snap.ash'),
        value: 3
      },
      {
        name: i18n.t('snap.red'),
        value: 4
      },
      {
        name: i18n.t('snap.blue'),
        value: 5
      },
      {
        name: i18n.t('snap.yellow'),
        value: 6
      },
      {
        name: i18n.t('snap.orange'),
        value: 7
      },
      {
        name: i18n.t('snap.brown'),
        value: 8
      },
      {
        name: i18n.t('snap.green'),
        value: 9
      },
      {
        name: i18n.t('snap.purple'),
        value: 10
      },
      {
        name: i18n.t('snap.young'),
        value: 11
      },
      {
        name: i18n.t('snap.powder'),
        value: 12
      },
      {
        name: i18n.t('snap.transparent'),
        value: 13
      },
      {
        name: i18n.t('snap.other'),
        value: 99
      }
    ]
  ],
  [
    {
      vehicleHood: i18n.t('snap.hood')
    }
  ],
  [
    {
      vehicleTrunk: i18n.t('snap.rearCover')
    }
  ],
  [
    {
      vehicleWheel: i18n.t('snap.wheel')
    }
  ],
  [
    {
      wheelPrintedPattern: i18n.t('snap.wheelPrintPattern')
    }
  ],
  [
    {
      vehicleWindow: i18n.t('snap.windows')
    }
  ],
  [
    {
      vehicleRoof: i18n.t('snap.roof')
    }
  ],
  [
    {
      vehicleDoor: i18n.t('snap.door')
    }
  ],
  [
    {
      sideOfVehicle: i18n.t('snap.carSide')
    }
  ],
  [
    {
      carOfVehicle: i18n.t('snap.carriage')
    }
  ],
  [
    {
      rearviewMirror: i18n.t('snap.rearviewMirror')
    }
  ],
  [
    {
      vehicleChassis: i18n.t('snap.chassis')
    }
  ],
  [
    {
      vehicleShielding: i18n.t('snap.screen')
    }
  ],
  [
    {
      filmColor: i18n.t('snap.filmColor')
    },
    [
      {
        name: i18n.t('snap.darkColor'),
        value: 0
      },
      {
        name: i18n.t('snap.lightColor'),
        value: 1
      },
      {
        name: i18n.t('snap.nothing'),
        value: 2
      }
    ]
  ],
  [
    {
      isModified: i18n.t('snap.modificationLogo')
    },
    [
      {
        name: i18n.t('snap.notModified'),
        value: 0
      },
      {
        name: i18n.t('snap.modification'),
        value: 1
      }
    ]
  ],
  [
    {
      plateConfidence: i18n.t('snap.numberRecognitionCredibility')
    }
  ]
]
