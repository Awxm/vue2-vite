<template>
  <div class="login-container">
    <el-row>
      <el-col :span="14">
        <div class="login-bg">
          <div class="login-logo">
            <el-image style="width: 160px; height: 160px" :src="Logo"></el-image>
          </div>
          <div class="login-title">
            <div class="login-title__zh">检验科临床试验管理系统</div>
            <div class="login-title__en">Clinical trial management system</div>
            <div><i class="el-icon-right"></i></div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">用户登录</h3>
          </div>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-user class="icon" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-password class="icon" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-eye v-show="passwordType === 'password'" class="icon svg-icon" />
              <svg-eye-open v-show="passwordType !== 'password'" class="svg-icon" />
            </span>
          </el-form-item>
          <div class="check">
            <span>忘记密码</span>
          </div>
          <el-button
            :loading="loading"
            type="primary"
            :disabled="!checked"
            style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>

          <div class="login-user">
            <span class="text-muted">
              用户协议
            </span>
          </div>
          <div class="login-terms">
            <el-checkbox v-model="checked">
              我已阅读并同意 <span>《用户服务协议》</span>与<span>《隐私政策》</span>
            </el-checkbox>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SvgEye from '@/assets/svg/eye.svg';
import SvgEyeOpen from '@/assets/svg/eye-open.svg';
import SvgPassword from '@/assets/svg/password.svg';
import SvgUser from '@/assets/svg/user.svg';
import Logo from '@/assets/img/musui.png';

export default {
  name: 'Login',
  components: { SvgEye, SvgEyeOpen, SvgPassword, SvgUser },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
      } else {
        callback();
      }
    };
    return {
      Logo,
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', messages: '请输入名称' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      otherQuery: {},
      checked: false,
    };
  },
  watch: {
    $route: {
      handler(route) {
        const { query } = route;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              // this.dataDictionarty();
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
              this.loading = false;
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // dataDictionarty() {
    //   this.$post(this.urls.dictionarty.list, {}).then((result) => {
    //     this.$store.dispatch('dataDictionarty/dataDictionarty', result);
    //   });
    // },
  },
};
</script>

<style lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #fff;
  }
}
/* reset element-ui css */
.login-container {
  .el-row {
    height: 100%;
  }
  .el-col {
    position: relative;
    height: 100%;
  }

  .el-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    margin: 0 auto;
    transform: translate(-50%, -50%);
  }
  .el-input {
    display: inline-block;
    width: 85%;
    height: 50px;

    input {
      height: 50px;
      padding: 12px 5px 12px 15px;
      font-size: 16px;
      color: #889aa4;
      border: 0;
      border-radius: 0;
      appearance: none;

      &:-internal-input-suggested {
        font-size: 16px !important;
      }

      &:-webkit-autofill {
        font-size: initial;
        background-color: #fff !important;
        box-shadow: 0 0 0 1000px #fff inset !important;
        -webkit-text-fill-color: #889aa4 !important;
      }
    }
  }

  .el-form-item {
    margin-bottom: 30px;
    color: #fff;
    border: 1px solid #b9bed1;
    border-radius: 4px;
    &__content {
      display: flex;
      align-items: center;
    }
  }
  .el-button {
    width: 100%;
    padding: 14px 40px;
    font-size: 18px;
    border-radius: 4px;
  }
  .el-checkbox {
    &__label {
      span {
        color: #409eff;
      }
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #606266;
    }
  }
}
</style>

<style lang="scss" scoped>
$light_gray: #eee;
.login-container {
  height: 100%;
  min-height: 100%;
  .login-bg {
    position: relative;
    width: 100%;
    height: 100%;
    padding-left: 50px;
    background-image: url(@/assets/img/login-bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .login-form {
    position: relative;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .login-title {
    position: absolute;
    bottom: 140px;
    &__zh {
      font-family: Source Han Sans CN;
      font-size: 72px;
      color: #ffffff;
      text-shadow: 0px 3px 6px rgba(28, 91, 161, 0.7);
      opacity: 1;
    }
    &__en {
      margin-top: 24px;
      margin-bottom: 28px;
      font-family: Source Han Sans CN;
      font-size: 36px;
      font-weight: 400;
      color: #ffffff;
      text-shadow: 0px 2px 2px rgba(28, 91, 161, 0.7);
      opacity: 1;
    }
    .el-icon-right {
      font-size: 46px;
      color: #ffffff;
    }
  }

  .login-user {
    display: table;
    height: auto;
    margin-top: 200px;
    font-weight: bold;
    line-height: 1;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;

    &:before {
      background-position: right 1em top 50%;
    }
    &:after {
      background-position: left 1em top 50%;
    }
    &:before,
    &:after {
      position: relative;
      top: 50%;
      display: table-cell;
      width: 50%;
      content: '';
      background-image: url(@/assets/img/line.png);
      background-repeat: no-repeat;
    }
  }
  .login-terms {
    margin-top: 15px;
  }
  .svg-container {
    display: inline-block;
    width: 32px;
    height: 30px;
    padding: 6px 5px 6px 15px;
    line-height: 1;
    color: #889aa4;
    vertical-align: middle;
  }

  .svg-icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentcolor;
  }

  .icon {
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentcolor;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px;
      font-size: 26px;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    top: 7px;
    right: 10px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
  .check {
    margin-bottom: 30px;
    font-size: 16px;
    font-weight: 400;
    color: #444;
    text-align: right;
    span {
      color: #63b7ff;
      cursor: pointer;
    }
  }
}
</style>
