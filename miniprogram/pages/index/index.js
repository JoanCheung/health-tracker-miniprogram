// index.js
Page({
  data: {
    // 当前步骤 (0: 欢迎页, 1: 基本信息, 2-5: 舌诊问答, 6: 图片上传)
    currentStep: 0,
    
    // 基本信息
    basicInfo: {
      name: '',
      gender: '',
      age: ''
    },
    
    // 舌诊问答答案
    quizAnswers: {
      question1: '', // 口干舌燥
      question2: '', // 舌头颜色
      question3: '', // 舌苔厚度
      question4: ''  // 睡眠质量
    },
    
    // 舌头图片
    tongueImage: '',
    
    // 加载状态
    isLoading: false,
    
    // 表单验证状态
    canProceed: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        traceUser: true,
      });
    }
  },

  /**
   * 下一步
   */
  nextStep: function() {
    // 验证当前步骤是否可以继续
    if (!this.validateCurrentStep()) {
      return;
    }

    const currentStep = this.data.currentStep;
    if (currentStep < 6) {
      this.setData({
        currentStep: currentStep + 1
      });
    }
  },

  /**
   * 上一步
   */
  prevStep: function() {
    const currentStep = this.data.currentStep;
    if (currentStep > 0) {
      this.setData({
        currentStep: currentStep - 1
      });
    }
  },

  /**
   * 验证当前步骤是否可以继续
   */
  validateCurrentStep: function() {
    const { currentStep, basicInfo, quizAnswers, tongueImage } = this.data;
    
    switch (currentStep) {
      case 0: // 欢迎页
        return true;
      
      case 1: // 基本信息
        if (!basicInfo.name.trim()) {
          wx.showToast({
            title: '请输入姓名',
            icon: 'none'
          });
          return false;
        }
        if (!basicInfo.gender) {
          wx.showToast({
            title: '请选择性别',
            icon: 'none'
          });
          return false;
        }
        if (!basicInfo.age || basicInfo.age < 1 || basicInfo.age > 150) {
          wx.showToast({
            title: '请输入有效年龄',
            icon: 'none'
          });
          return false;
        }
        return true;
      
      case 2: // 问题1
        if (!quizAnswers.question1) {
          wx.showToast({
            title: '请选择答案',
            icon: 'none'
          });
          return false;
        }
        return true;
      
      case 3: // 问题2
        if (!quizAnswers.question2) {
          wx.showToast({
            title: '请选择答案',
            icon: 'none'
          });
          return false;
        }
        return true;
      
      case 4: // 问题3
        if (!quizAnswers.question3) {
          wx.showToast({
            title: '请选择答案',
            icon: 'none'
          });
          return false;
        }
        return true;
      
      case 5: // 问题4
        if (!quizAnswers.question4) {
          wx.showToast({
            title: '请选择答案',
            icon: 'none'
          });
          return false;
        }
        return true;
      
      case 6: // 图片上传
        if (!tongueImage) {
          wx.showToast({
            title: '请上传舌头照片',
            icon: 'none'
          });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  },

  /**
   * 姓名输入处理
   */
  onNameInput: function(e) {
    this.setData({
      'basicInfo.name': e.detail.value
    });
  },

  /**
   * 年龄输入处理
   */
  onAgeInput: function(e) {
    const age = parseInt(e.detail.value) || '';
    this.setData({
      'basicInfo.age': age
    });
  },

  /**
   * 性别选择处理
   */
  onGenderChange: function(e) {
    this.setData({
      'basicInfo.gender': e.detail.value
    });
  },

  /**
   * 舌诊问答1处理
   */
  onQuiz1Change: function(e) {
    this.setData({
      'quizAnswers.question1': e.detail.value
    });
  },

  /**
   * 舌诊问答2处理
   */
  onQuiz2Change: function(e) {
    this.setData({
      'quizAnswers.question2': e.detail.value
    });
  },

  /**
   * 舌诊问答3处理
   */
  onQuiz3Change: function(e) {
    this.setData({
      'quizAnswers.question3': e.detail.value
    });
  },

  /**
   * 舌诊问答4处理
   */
  onQuiz4Change: function(e) {
    this.setData({
      'quizAnswers.question4': e.detail.value
    });
  },

  /**
   * 拍摄舌头照片
   */
  takePhoto: function() {
    const self = this;
    
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'], // 只允许拍照
      camera: 'back', // 使用后置摄像头
      success: function(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        
        // 显示加载提示
        wx.showLoading({
          title: '处理中...'
        });
        
        // 上传到云存储
        self.uploadImageToCloud(tempFilePath);
      },
      fail: function(err) {
        console.error('拍照失败:', err);
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 重新拍摄
   */
  retakePhoto: function() {
    this.setData({
      tongueImage: ''
    });
    this.takePhoto();
  },

  /**
   * 上传图片到云存储
   */
  uploadImageToCloud: function(filePath) {
    const self = this;
    const timestamp = Date.now();
    const fileName = `tongue_images/${timestamp}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    
    wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: filePath,
      success: function(res) {
        console.log('图片上传成功:', res.fileID);
        self.setData({
          tongueImage: res.fileID
        });
        wx.hideLoading();
        wx.showToast({
          title: '照片上传成功',
          icon: 'success'
        });
      },
      fail: function(err) {
        console.error('图片上传失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 提交表单数据进行分析
   */
  submitForm: function() {
    if (!this.validateCurrentStep()) {
      return;
    }

    const { basicInfo, quizAnswers, tongueImage } = this.data;
    
    // 显示加载状态
    this.setData({
      isLoading: true
    });
    
    wx.showLoading({
      title: '分析中...'
    });

    // 准备提交的数据
    const submitData = {
      basicInfo: {
        name: basicInfo.name,
        gender: basicInfo.gender,
        age: basicInfo.age
      },
      quizAnswers: {
        question1: quizAnswers.question1, // 口干舌燥程度
        question2: quizAnswers.question2, // 舌头颜色
        question3: quizAnswers.question3, // 舌苔厚度
        question4: quizAnswers.question4  // 睡眠质量
      },
      tongueImage: tongueImage,
      timestamp: Date.now(),
      // 添加问题文本便于云函数理解
      questionTexts: {
        question1: "您最近是否感到口干舌燥？",
        question2: "您的舌头颜色通常是？",
        question3: "您的舌苔厚度如何？",
        question4: "您最近的睡眠质量如何？"
      }
    };

    console.log('提交数据:', submitData);

    // 调用云函数进行分析
    wx.cloud.callFunction({
      name: 'analyze',
      data: submitData,
      success: (res) => {
        console.log('云函数调用成功:', res);
        wx.hideLoading();
        
        this.setData({
          isLoading: false
        });

        if (res.result && res.result.success) {
          // 分析成功，跳转到结果页面
          wx.showToast({
            title: '分析完成',
            icon: 'success'
          });
          
          // 将结果保存到本地存储，供结果页面使用
          wx.setStorageSync('analysisResult', res.result.data);
          wx.setStorageSync('userInfo', {
            basicInfo: submitData.basicInfo,
            quizAnswers: submitData.quizAnswers
          });
          
          // 跳转到结果页面（需要创建结果页面）
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/result/index'
            });
          }, 1500);
          
        } else {
          // 分析失败
          wx.showToast({
            title: '分析失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        wx.hideLoading();
        
        this.setData({
          isLoading: false
        });

        // 根据错误类型显示不同的提示
        let errorMessage = '分析失败，请重试';
        
        if (err.errMsg && err.errMsg.includes('Environment not found')) {
          errorMessage = '云开发环境未配置';
        } else if (err.errMsg && err.errMsg.includes('FunctionName')) {
          errorMessage = '分析服务暂时不可用';
        }
        
        wx.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        });
      }
    });
  },

  /**
   * 重置表单数据
   */
  resetForm: function() {
    this.setData({
      currentStep: 0,
      basicInfo: {
        name: '',
        gender: '',
        age: ''
      },
      quizAnswers: {
        question1: '',
        question2: '',
        question3: '',
        question4: ''
      },
      tongueImage: '',
      isLoading: false
    });
  },

  /**
   * 分享功能
   */
  onShareAppMessage: function() {
    return {
      title: '智齿录 - 舌诊健康评估',
      path: '/pages/index/index',
      imageUrl: '/images/share-image.png' // 需要添加分享图片
    };
  }
});