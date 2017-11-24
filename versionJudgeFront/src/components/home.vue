<template>
  <div class="home">
    <div class="homePage">
      <p class="pageTitle">上传版本信息</p>
      <div class="paramItem">
        <p class="title">项目</p>
        <select name="app" id="app" v-model="app">
          <option value="1">mobbs</option>
        </select>
      </div>
      <div class="paramItem">
        <p class="title">系统</p>
        <select name="os" id="os" v-model="os">
          <option value="1">ios</option>
          <option value="2">android</option>
          <option value="3">ios & android</option>
        </select>
      </div>
      <div class="paramItem">
        <p class="title">版本号</p>
        <input type="text" v-model="version"/>
      </div>
      <div class="paramItem">
        <p class="title">是否强制更新</p>
        <select name="isForceUpdate" id="isForceUpdate" v-model="isForceUpdate">
          <option value="1">是</option>
          <option value="0">否</option>
        </select>
      </div>
      <div class="paramItem">
        <p class="title">更新介绍</p>
        <div>
          <div class="paramItem" v-for="item, index in instructions" :key="index">
            <span class="secondTitle" v-text="index + '. '"></span>
            <textarea type="text" v-model="item.value"></textarea>
          </div>
        </div>
        <button @click="addInstruction">添加</button>
      </div>
      <button class="submit" @click="submitVersion">提交</button>
    </div>
    <div class="homePage">
      <p class="pageTitle">获取最新版本号</p>
      <div class="paramItem">
        <p class="title">项目</p>
        <select name="getApp" id="getApp" v-model="getApp">
          <option value="1">mobbs</option>
        </select>
      </div>
      <div class="paramItem">
        <p class="title">系统</p>
        <select name="getOs" id="getOs" v-model="getOs">
          <option value="1">ios</option>
          <option value="2">android</option>
        </select>
      </div>
      <button class="submit" @click="getVersion">提交</button>
      <div>
        <div class="paramItem">
          <p class="title">创建时间</p>
          <p class="showText" v-text="showData.createTime"></p>
        </div>
        <div class="paramItem">
          <p class="title">版本号</p>
          <p class="showText" v-text="showData.version"></p>
        </div>
        <div class="paramItem">
          <p class="title">是否强制更新</p>
          <p class="showText" v-text="(showData.isForceUpdate == '1') ? '是' : '否'"></p>
        </div>
        <div class="paramItem">
          <p class="title">更新介绍</p>
          <div>
            <div class="paramItem" v-for="item, index in showData.instructions" :key="index">
              <span class="secondTitle" v-text="index + '. '"></span>
              <p class="showText instruction" v-text="item"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  const appMap = {
    "1": 'mobbs'
  }
  const osMap = {
    "1": 'ios',
    "2": 'android',
  }
  export default {
    data () {
      return {
        appMap: appMap,
        osMap: osMap,
        ajaxCancelSource: this.$axios.CancelToken.source(),
        app: '1',
        os: '1',
        version: '',
        isForceUpdate: 0,
        instructions: [{
          value: ''
        }],

        // 获取版本号参数
        getApp: '1',
        getOs: '1',
        showData: {}
      }
    },
    mounted () {
    },
    methods: {
      addInstruction () {
        this.instructions.push({
          value: ''
        });
      },
      submitVersion () {
        let instructions = [];
        for (let i = 0; i < this.instructions.length; i++) {
          if (this.instructions[i].value === '') continue;
          instructions.push(this.instructions[i].value);
        }
        let map = {
          app: this.app,
          os: this.os,
          version: this.version,
          isForceUpdate: this.isForceUpdate,
          instructions: instructions,
        }
        console.log(map);

        this.$axios.mogoPost('/version/setversion', map, this.ajaxCancelSource.token)
          .then((res) => {
            if (res.status === 3001) {
              alert('保存成功');
            } else {
              alert(res.error);
            }
          })
          .catch(() => {
          });
      },
      getVersion () {
        this.$axios.mogoPost('/version/getversion', {
          app: this.getApp,
          os: this.getOs,
        }, this.ajaxCancelSource.token)
          .then((res) => {
            if (res.status === 3001) {
              console.log(res.payload);
              this.showData = res.payload;
            } else {
              alert(res.error);
            }
          })
          .catch(() => {
          });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .home
    text-align: left
    display: flex
    padding: 15px
  .homePage
    flex: 1
    min-width: 380px
    .pageTitle
      line-height: 50px
      font-size: 18px
      margin-top: 30px
  .paramItem
    display: flex
    align-items: center
    min-height: 30px
    margin-bottom: 10px
    .title
      min-width: 90px
    .secondTitle
      margin-right: 10px
    .instruction
      white-space: normal
      word-break: break-all
  input
    border: 1px #eeeeee solid
  button
    margin-left: 30px
  .submit
    margin-top: 10px
    margin-bottom: 40px
</style>
